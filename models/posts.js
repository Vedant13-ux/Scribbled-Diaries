const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	authorId: String,
	title: String,
	content: String,
	image: String,
	imageId: String,
	category: String,
	overtone: String,
	created: {
		type: Date,
		default: Date.now
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
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
	isDraft: { type: Boolean, default: false }
});

module.exports = mongoose.model('Post', postSchema);
