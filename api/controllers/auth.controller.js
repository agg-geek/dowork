const User = require('../models/user.model');
const createError = require('../utils/createError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signup = async (req, res, next) => {
	try {
		const hash = await bcrypt.hash(req.body.password, 12);
		const newUser = new User({
			...req.body,
			password: hash,
		});

		await newUser.save();

		const token = jwt.sign(
			{
				id: newUser._id,
				isSeller: newUser.isSeller,
			},
			process.env.JWT_SECRET_KEY
		);

		const { password, ...info } = newUser._doc;
		res.cookie('accessToken', token, { httpOnly: true });
		res.status(200).send(info);
	} catch (err) {
		next(err);
	}
};

module.exports.login = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) return next(createError(401, 'Wrong email or password!'));

		const isCorrect = bcrypt.compare(req.body.password, user.password);
		if (!isCorrect) return next(createError(401, 'Wrong email or password!'));

		const token = jwt.sign(
			{
				id: user._id,
				isSeller: user.isSeller,
			},
			process.env.JWT_SECRET_KEY
		);

		const { password, ...info } = user._doc;
		res.cookie('accessToken', token, { httpOnly: true });
		res.status(200).send(info);
	} catch (err) {
		next(err);
	}
};

module.exports.logout = async (req, res) => {
	res.clearCookie('accessToken', { sameSite: 'none', secure: true });
	res.status(200).send('User has been logged out.');
};
