const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	text: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Comment', commentSchema);
