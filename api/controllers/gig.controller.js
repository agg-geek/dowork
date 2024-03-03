const Gig = require('../models/gig.model');
const createError = require('../utils/createError');

module.exports.getGigs = async (req, res, next) => {
	const q = req.query;
	const filters = {
		...(q.userId && { userId: q.userId }),
		...(q.category && { category: q.category }),
		...((q.min || q.max) && {
			price: {
				...(q.min && { $gt: q.min }),
				...(q.max && { $lt: q.max }),
			},
		}),
		...(q.search && { title: { $regex: q.search, $options: 'i' } }),
	};
	try {
		const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
		res.status(200).send(gigs);
	} catch (err) {
		next(err);
	}
};

module.exports.getGig = async (req, res, next) => {
	try {
		const gig = await Gig.findById(req.params.id);
		if (!gig) return next(createError(404, 'Gig not found.'));
		res.status(200).send(gig);
	} catch (err) {
		next(err);
	}
};

module.exports.createGig = async (req, res, next) => {
	if (!req.isSeller) return next(createError(403, 'Only sellers can create a gig!'));

	const newGig = new Gig({
		...req.body,
		userId: req.userId,
	});

	try {
		const savedGig = await newGig.save();
		res.status(201).send(savedGig);
	} catch (err) {
		next(err);
	}
};

module.exports.deleteGig = async (req, res, next) => {
	try {
		const gig = await Gig.findById(req.params.id);
		if (!gig) return next(createError(404, 'Gig not found.'));

		if (gig.userId !== req.userId)
			return next(createError(403, 'You can delete only your gig!'));

		await Gig.findByIdAndDelete(req.params.id);
		res.status(200).send('Gig has been deleted!');
	} catch (err) {
		next(err);
	}
};
