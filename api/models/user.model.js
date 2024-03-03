const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Name required'],
		},
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: [true, 'Username should be unique'],
		},
		email: {
			type: String,
			required: [true, 'Email required'],
			unique: [true, 'Email should be unique'],
		},
		password: {
			type: String,
			required: [true, 'Password required'],
		},
		img: {
			type: String,
		},
		country: {
			type: String,
		},
		phone: {
			type: String,
		},
		desc: {
			type: String,
		},
		isSeller: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
