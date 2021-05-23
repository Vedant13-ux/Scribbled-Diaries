var express = require('express');
var router = express.Router();
var Post = require('../models/posts');

router.get('/home', (req, res) => {
	Post.find().sort({created:-1}).populate('author').exec((err, posts) => {
		if (err) {
			req.flash('error', 'Something Went Wrong');
			return res.redirect('/home');
		}
		res.render('home/home', { posts: posts});
	});
});

//Search Pattern

module.exports = router;
