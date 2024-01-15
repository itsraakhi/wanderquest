const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
		trim: true,
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price'],
	},
	duration: {
		type: Number,
		required: [true, 'A tour must have a duration'],
	},
	maxGroupSize: {
		type: Number,
		required: [true, 'A tour must have a max group size'],
	},
	difficulty: {
		type: String,
		required: [true, 'A tour must have a difficulty'],
	},
	ratingsAvg: {
		type: Number,
		default: 4,
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	priceDiscount: Number,
	summary: {
		type: String,
		required: [true, 'A tour must have a summary'],
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	imageCover: {
		type: String,
		required: [true, 'A tour must have a cover image'],
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now(),
		select: false, // to never send this field to client
	},
	startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;