const express = require('express');
var router = express.Router();
var passport = require('passport');
const { restrictCreate, isLoggedIn } = require('../middleware');
const User = require('../models/user');

// Stripe API
const Stripe = require('stripe');
const stripe = Stripe(
	'sk_test_51HW4kjJ97I3vbeYx0IcvnklqiFwfkY25BQUQvBJnwEECYmm1m0JzZedpqYD6Q0aBFX5SiLuNBxejkQTJRIpdpZ4u00qLtDB4Fn'
);
stripe.charges.retrieve('ch_1HWI3FJ97I3vbeYxz8t3K1Go', {
	apiKey:
		'sk_test_51HW4kjJ97I3vbeYx0IcvnklqiFwfkY25BQUQvBJnwEECYmm1m0JzZedpqYD6Q0aBFX5SiLuNBxejkQTJRIpdpZ4u00qLtDB4Fn'
});

// CLoudinary API
var multer = require('multer');
var storage = multer.diskStorage({
	filename: function(req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function(req, file, cb) {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'ved13',
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// Local Login

router.get('/signup', isNotLogged, (req, res) => {
	res.render('auth/signup');
});

router.post(
	'/signup',
	passport.authenticate('local-signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash: true
	}),
	function(req, res) {
		req.flash('sucess', 'Welcome to Yelp Camp');
	}
);

router.get('/login', function(req, res) {
	res.render('auth/login');
});

router.post(
	'/login',
	passport.authenticate('local-login', {
		failureRedirect: '/login',
		failureFlash: true
	}),
	function(req, res) {
		var redirectTo = req.session.redirectTo || '/home';
		delete req.session.redirectTo;
		res.redirect('/home');
	}
);

// Facebook Login
router.get(
	'/auth/facebook',
	passport.authenticate('facebook', {
		scope: [ 'email' ]
	})
);

router.get(
	'/auth/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		var redirectTo = req.session.redirectTo || '/home';
		delete req.session.redirectTo;
		// is authenticated ?
		res.redirect(redirectTo);
	}
);

//Google Login
router.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: [ 'profile', 'email' ]
	})
);

router.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		res.redirect('/home');
	}
);

// Twitter Login
router.get(
	'/auth/twitter',
	passport.authenticate('twitter', {
		scope: [ 'profile', 'email' ]
	})
);

router.get(
	'/auth/twitter/callback',
	passport.authenticate('twitter', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		res.redirect('/home');
	}
);
// Examples;

// Logout
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Successfully Logged You Out');
	res.redirect('home');
});

// My Profile
router.get('/user/:id/', (req, res) => {
	User.findById(req.params.id)
		.populate({ path: 'posts', options: { sort: { created: -1 } }, populate: { path: 'author' } })
		.exec((err, user) => {
			if (err) {
				req.flash('error', err.message);
				console.log(err);
				res.redirect('back');
			} else {
				if (!user) {
					req.flash('error', 'User Does Not Exist');
					return res.redirect('/home');
				}
				res.render('account/myProfile', { user });
			}
		});
});
// Profile  Image Upload

router.post('/updateImage', isLoggedIn, upload.single('file'), async (req, res) => {
	try {
		cloudinary.v2.uploader.destroy(req.user.photoId);
		var result = await cloudinary.v2.uploader.upload(req.file.path);
		req.user.photoId = result.public_id;
		req.user.photo = result.secure_url;
		req.user.save();
		console.log('Image Saved');
		res.redirect('/user/' + req.user.id);
	} catch (err) {
		console.log(err.message);
		req.flash('error', err.message);
		return res.redirect('back');
	}
});

//Payemnts
router.get('/donate', (req, res) => {
	res.render('index/donate');
});

function isNotLogged(req, res, next) {
	if (!req.isAuthenticated()) {
		next();
	} else {
		req.flash('You are already Logged in');
		res.redirect('/home');
	}
}
module.exports = router;
