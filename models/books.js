const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
	bookId: String,
	bookTitle: String,
	authors: String,
	genre: String,
	image: String,
	description: String,
	language: String,
	pageCount: Number,
	rating: {
		averageRating: Number,
		count: Number
	},
	previewLink: String,
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'BookReview'
		}
	]
});
module.exports = mongoose.model('Book', bookSchema);
