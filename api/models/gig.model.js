const mongoose = require('mongoose');
const { Schema } = mongoose;

const GigSchema = new Schema(
	{
		userId: {
			type: String,
			required: [true, 'User ID of seller required'],
		},
		title: {
			type: String,
			required: [true, 'Title required'],
		},
		category: {
			type: String,
			required: [true, 'Category required'],
			enum: [
				'animation',
				'webdesign',
				'graphicdesign',
				'dataentry',
				'ai',
				'translation',
				'social',
				'seo',
				'voiceover',
				'bookcover',
			],
		},
		cover: {
			type: String,
			required: [true, 'Cover image required'],
		},
		images: {
			type: [String],
		},
		features: {
			type: [String],
		},
		desc: {
			type: String,
			required: [true, 'Description required'],
		},
		price: {
			type: Number,
			required: [true, 'Price required'],
		},
		totalStars: {
			type: Number,
			default: 0,
		},
		cntRating: {
			type: Number,
			default: 0,
		},
		sales: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Gig', GigSchema);
