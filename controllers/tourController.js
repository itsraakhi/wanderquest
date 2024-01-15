const { json } = require('express');
const Tour = require('./../models/tourModel');

module.exports.getAllTours = async (req, res) => {
	try {
		// 1. Build query
		//    a. Basic filtering
		const queryObj = { ...req.query };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach(field => delete queryObj[field]);

		//    b. Advanced filtering
		//       implement using operators gte, gt, lte, lt in query string
		//       the query string looks like ?difficulty=easy&price[lte]=1000
		//       console.log(req.query); gives:
		//       { difficulty: 'easy', price: { lte: '1000' } }
		//       hence replace lte etc stuff with $lte

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

		let query = Tour.find(JSON.parse(queryStr));

		//    c. Implement sorting
		//       ?sort=price to sort by price
		//       ?sort=-price to sort by price in descending order
		//       ?sort=price,ratingsAvg to sort by price, if price is same, sort by ratingsAvg
		//       req.query looks like { sort: 'price,ratingsAvg' }
		//       mongoose query should look like .sort('price ratingsAvg')

		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createdAt'); // sort by newest
		}

		//    d. Field limiting (projection)
		//       return only the data requested by the client
		//       specify ?fields=name,price to request only name and price of tours
		//       mongoose works as .select('name price') to select name and price
		//       specify ?fields=-price to request everything but price of tour
		//       mongoose works as .select('-price') to not select price, but everything else

		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			// mongo creates a __v to it to use internally
			// but we don't need it so just omit it
			query = query.select('-__v');
		}

		// 2. Execute query
		const tours = await Tour.find(query);

		// 3. Send response
		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: { tours },
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err,
		});
	}
};

module.exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: { tour },
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: 'Tour not found',
		});
	}
};

module.exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);
		res.status(201).json({
			status: 'success',
			data: { tour: newTour },
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
};

module.exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			status: 'success',
			data: { tour },
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			// message: err,
			message: 'Could not update the document',
		});
	}
};

module.exports.deleteTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndDelete(req.params.id, req.body);

		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: 'Could not delete the document',
		});
	}
};
