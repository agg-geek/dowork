const mongoose = require('mongoose');
const userData = require('./users.json');
const gigData = require('./gigs.json');
const reviewData = require('./reviews.json');
const User = require('../models/user.model');
const Gig = require('../models/gig.model');
const Review = require('../models/review.model');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
mongoose.set('strictQuery', true);

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('MongoDB connection successful'))
	.catch(err => console.error(err));

const randomNo = (min, range) => Math.floor(Math.random() * range) + min;
const randomElementfromArray = array => array[Math.floor(Math.random() * array.length)];

const seedUsers = async () => {
	await User.deleteMany({});

	let totalUsersToSeed = 10;
	let usersToMakeSeller = 3;
	for (let i = 0; i < totalUsersToSeed; i++) {
		const user = new User({
			name: userData[i].name,
			username: `${i < usersToMakeSeller ? 's' : 'u'}${i + 1}`,
			email: `${i < usersToMakeSeller ? 's' : 'u'}${i + 1}@e.com`,
			password: '$2b$12$FtX20r6R2GE/OlkQ2ELIfOlaBh1T9l8jAsxptwIfLicq2O5mU67hC',
			country: 'India',
			phone: userData[i].phonenumber,
			desc: userData[i].desc,
			isSeller: i < usersToMakeSeller ? true : false,
		});
		await user.save();
	}
};

const sellerIds = [];
const populateSellerId = async () => {
	const sellers = await User.find({ isSeller: true });
	for (let i = 0; i < sellers.length; i++) {
		const id = sellers[i]._id.toString();
		sellerIds.push(id);
	}
};

const seedGigs = async () => {
	await Gig.deleteMany({});

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < gigData[i].title.length; j++) {
			const coverImageNo = randomNo(0, 4);

			const gig = new Gig({
				userId: randomElementfromArray(sellerIds),
				title: gigData[i].title[j],
				desc: gigData[i].desc[j],
				totalStars: 0,
				cntRating: 0,
				category: gigData[i].category,
				price: randomNo(2000, 18000),
				cover: gigData[i].images[coverImageNo],
				images: gigData[i].images.filter((_, i) => i != coverImageNo),
				features: [...gigData[i].features],
				sales: randomNo(100, 900),
			});
			await gig.save();
		}
	}
};

const gigIds = [];
const populateGigId = async () => {
	const gigs = await Gig.find();
	for (let i = 0; i < gigs.length; i++) {
		const id = gigs[i]._id.toString();
		gigIds.push(id);
	}
};

const buyerIds = [];
const populateBuyerId = async () => {
	const buyers = await User.find({ isSeller: false });
	for (let i = 0; i < buyers.length; i++) {
		const id = buyers[i]._id.toString();
		buyerIds.push(id);
	}
};

const seedReviews = async () => {
	await Review.deleteMany({});

	for (let i = 0; i < gigIds.length; i++) {
		for (let j = 0; j < 5; j++) {
			const reviewNo = randomNo(0, reviewData.length - 1);

			const currGigId = randomElementfromArray(gigIds);
			const review = new Review({
				gigId: currGigId,
				userId: randomElementfromArray(buyerIds),
				star: reviewData[reviewNo].star,
				desc: reviewData[reviewNo].desc,
			});

			await Gig.findByIdAndUpdate(currGigId, {
				$inc: { totalStars: reviewData[reviewNo].star, cntRating: 1 },
			});

			await review.save();
		}
	}
};

const seedDB = async () => {
	await seedUsers();
	await populateSellerId();

	await seedGigs();

	await populateGigId();
	await populateBuyerId();
	await seedReviews();
};

seedDB().then(() => {
	mongoose.connection.close();
});
