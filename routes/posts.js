const express = require('express');
const router = express.Router();
const Post = require('../models/posts.js');
const { restrictCreate, isLoggedIn } = require('../middleware');
const User = require('../models/user.js');
const Notification = require('../models/notification');
const { fork } = require('child_process');
const user = require('../models/user.js');
const { populate } = require('../models/user.js');

router.get('/newPost', restrictCreate, (req, res) => {
	res.render('posts/newPost');
});

router.post('/newPost', isLoggedIn, (req, res) => {
	Post.create(req.body.post)
		.then(async (newPost) => {
			newPost.author = req.user;
			req.user.posts.push(newPost);
			newPost.save();
			req.user.save();

			//Pushing Notifications to  Followers
			if (req.user.followers != 0) {
				try {
					let newNotification = {
						text: `${req.user.name} posted a ${newPost.category} ${newPost.title}`,
						author:req.user,
						link:`/post/${newPost._id}`
					};
					var childProcess = fork('notification.js', { cwd: './utils' });
					childProcess.send({ user_id: req.user.id, notification: newNotification });
					childProcess.on('exit', () => {
						console.log('Terminated Child Process');
					});
				} catch (err) {
					console.log(err.message);
				}
			}
			res.redirect('/post/' + newPost._id);
		})
		.catch((err) => {
			req.flash('error', 'Something Went Wrong');
			console.log(err);
			res.redirect('/newPost');
		});
});

router.get('/post/:id', (req, res) => {
	Post.findById(req.params.id).populate({path:'comments',populate:{path:'author'}}).populate('author').exec((err, post) => {
		if (err) {
			req.flash('error', 'Something Went Wrong');
			return res.redirect('/newPost');
		}
		if (!post) {
			req.flash('error', 'Post Does Not Exist');
			return res.redirect('/home');
		}
		res.render('posts/viewPost', { post });
	});
});

router.get('/bookmarks', isLoggedIn, (req, res) => {
	User.findById(req.user.id)
		.populate({ path: 'bookmarks', populate: { path: 'author' } })
		.exec((err, user) => {
			if (err) {
				req.flash('error', 'Something Went Wrong');
				return res.redirect('back');
			} else {
				if (!user) {
					req.flash('error', 'Invalid Request');
					return res.redirect('back');
				}
				res.render('posts/bookmarks', { bookmarks: user.bookmarks });
			}
		});
});

module.exports = router;
