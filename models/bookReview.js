const mongoose = require('mongoose');

const bookReviewSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	liked_by: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	content: String,
	ratings: Number,
	created: {
		type: Date,
		default: Date.now()
	},
	book: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Book'
	}
});
module.exports = mongoose.model('BookReview', bookReviewSchema);
