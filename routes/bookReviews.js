const express = require('express');
var router = express.Router();
const BookReview = require('../models/bookReview');
const Book = require('../models/books');

const { isLoggedIn } = require('../middleware');

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

router.get('/bookreviews', (req, res) => {
	BookReview.find().sort({ created: -1 }).populate('book').populate('author').exec((err, bookReview) => {
		if (err) {
			req.flash('error', 'Something Went Wrong');
			return res.redirect('back');
		}
		res.render('bookReviews/bookReviews', { bookReview });
	});
});

// New BookReviews
router.get('/bookreviews/create', isLoggedIn, (req, res) => {
	res.render('bookReviews/new');
});

// router.post('/bookreviews/notexisting/create', isLoggedIn, upload.single('image'), async (req, res) => {
// 	try {
// 		var result = await cloudinary.v2.uploader.upload(req.file.path);
// 	} catch (err) {
// 		req.flash('error', err.message);
// 		return res.redirect('back');
// 	}
// 	req.body.review.image = result.secure_url;
// 	req.body.review.imageId = result.public_id;
// 	req.body.review.author = req.user;

// 	BookReview.create(req.body.review)
// 		.then(async (review) => {
// 			res.redirect('/bookreviews');
// 		})
// 		.catch((err) => {
// 			req.flash('error', err.message);
// 			return res.redirect('back');
// 		});
// });

router.post('/bookreviews/existing/create', isLoggedIn, async (req, res) => {
	BookReview.create(req.body.review)
		.then(async (review) => {
			Book.findOne({ bookId: req.body.book.bookId })
				.then(async (book) => {
					if (!book) {
						try {
							let newBook = await Book.create(req.body.book);
							review.book = newBook;
							review.author = req.user;
							newBook.reviews.push(review);
							await review.save();
							await newBook.save();
							res.redirect('/bookreviews');
						} catch (err) {
							req.flash('error', err.message);
							return res.redirect('back');
						}
					} else {
						try {
							review.book = book;
							review.author = req.user;
							book.reviews.push(review);
							book.update({ rating: req.body.rating });
							await review.save();
							await book.save();
						} catch (err) {
							req.flash('error', err.message);
							return res.redirect('back');
						}
						res.redirect('/bookreviews');
					}
				})
				.catch((err) => {
					console.log('book find error error');
					req.flash('error', err.message);
					return res.redirect('back');
				});
		})
		.catch((err) => {
			console.log('review error');
			req.flash('error', err.message);
			return res.redirect('back');
		});
});

module.exports = router;
