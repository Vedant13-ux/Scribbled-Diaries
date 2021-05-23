const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var userSchema = new mongoose.Schema({
	unique_id: String,
	token: String,
	type: String,
	email: String,
	name: String,
	isVerified: {
		type: Boolean,
		default: false
	},
	photo: {
		type: String,
		default: 'https://d57tm.org/wp-content/uploads/2019/04/headshot-placeholder.png'
	},
	photoId: {
		type: String,
		default: '123z99'
	},
	created: {
		type: Date,
		default: Date.now
	},
	password: String,
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}
	],
	bookmarks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}
	],
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	followings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	notifications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Notification'
		}
	],
	social_handles: {
		facebook: String,
		twitter: String,
		instagram: String,
		linkedin: String,
		personalBlog: String
	},
	conversations:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Conversation'
		}
	],
	interactions:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:'User'
		}
	],
	bio: String
});
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

module.exports = mongoose.model('User', userSchema);
