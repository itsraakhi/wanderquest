const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			trim: true,
			minlength: [10, 'A tour name must have atleast 10 characters'],
			maxlength: [40, 'A tour name must have atmost 40 characters'],
		},
		slug: String,
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
			// enum: ['easy', 'medium', 'difficult'],
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: 'Difficulty can be either easy, medium or difficult',
			},
		},
		ratingsAvg: {
			type: Number,
			default: 4,
			min: [1, 'Rating must be atleast 1'],
			max: [5, 'Rating must be atmost 5'],
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
			select: false,
		},
		startDates: [Date],
		secretTour: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

tourSchema.virtual('durationWeeks').get(function () {
	return this.duration / 7;
});

tourSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	next();
});

tourSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
