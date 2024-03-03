const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const createError = require('../utils/createError');
const Order = require('../models/order.model');
const Gig = require('../models/gig.model');

module.exports.createPaymentIntent = async (req, res, next) => {
	const gig = await Gig.findById(req.params.gigId);
	if (!gig) return next(createError(404, 'Order failed as gig does not exist'));

	const paymentIntent = await stripe.paymentIntents.create({
		amount: gig.price * 100,
		currency: 'inr',
		automatic_payment_methods: {
			enabled: true,
		},
	});

	const newOrder = new Order({
		gigId: gig._id,
		img: gig.cover,
		title: gig.title,
		buyerId: req.userId,
		sellerId: gig.userId,
		price: gig.price,
		payment_intent: paymentIntent.id,
	});

	await newOrder.save();

	res.status(200).send({ clientSecret: paymentIntent.client_secret });
};

module.exports.confirmPayment = async (req, res, next) => {
	try {
		const orders = await Order.findOneAndUpdate(
			{ payment_intent: req.body.payment_intent },
			{ $set: { isCompleted: true } }
		);

		res.status(200).send('Order has been confirmed.');
	} catch (err) {
		next(err);
	}
};

module.exports.getOrders = async (req, res, next) => {
	try {
		const orders = await Order.find({
			...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
			isCompleted: true,
		});

		res.status(200).send(orders);
	} catch (err) {
		next(err);
	}
};
