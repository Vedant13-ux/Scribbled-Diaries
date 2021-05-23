const express = require('express');
var router = express.Router();
const User = require('../models/user');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const Notification = require('../models/notification');
const { isLoggedIn } = require('../middleware/index');
const BookReview = require('../models/bookReview');
const Book = require('../models/books');


// Get the User by ID
router.get('/user/:id', (req, res) => {
	User.findById(req.params.id)
		.then(user => {
			res.status(200).send(user);
		}).catch((err) => {
			console.log(err)
		});
});

// Search ALL
router.get('/posts', (req, res) => {
	Post.find().sort({ created: -1 }).populate('author').exec((err, posts) => {
		if (err) {
			console.log(err.message);
			return res.send(err.message);
		}
		res.render('../utils/search.ejs', { posts });
	});
});

// Serach BY Category
router.get('/posts/category/:category', (req, res) => {
	var regex = new RegExp(escapeRegex(req.params.category), 'gi');
	Post.find({ category: regex }).sort({ created: -1 }).populate('author').exec((err, posts) => {
		if (err) {
			console.log(err.message);
			return res.send(err.message);
		}
		res.render('../utils/search.ejs', { posts: posts });
	});
});

// Serach by user
router.get('/posts/author/:author', (req, res) => {
	var regex = new RegExp(escapeRegex(req.params.author), 'gi');
	Post.find()
		.sort({ created: -1 })
		.populate({ path: 'author', select: 'name', match: { name: regex } })
		.exec((err, posts) => {
			if (err) {
				return res.send(err.message);
			}
			console.log(posts[0]);
			if (posts) {
				res.render('../utils/search.ejs', { posts: posts });
			}
		});
});

// Search BY Overtone
router.get('/posts/overtone/:overtone', (req, res) => {
	var regex = new RegExp(escapeRegex(req.params.overtone), 'gi');
	Post.find({ overtone: regex }).sort({ created: -1 }).populate('author').exec((err, posts) => {
		if (err) {
			console.log(err);
			return res.send(err);
		}
		res.render('../utils/search.ejs', { posts: posts });
	});
});

// Serach By Title

router.get('/posts/title/:title', (req, res) => {
	var regex = new RegExp(escapeRegex(req.params.title), 'gi');
	Post.find({ title: regex }).sort({ created: -1 }).populate('author').exec((err, posts) => {
		if (err) {
			console.log(err);
			return res.send(err);
		}
		res.render('../utils/search.ejs', { posts });
	});
});

// Bookmarks
router.post('/bookmarks/new/:id', isLoggedIn, (req, res) => {
	Post.findById(req.params.id).populate('author').exec((err, post) => {
		if (err) {
			res.send(err.message);
		}
		if (!post) {
			return res.status(404).send('Not Found');
		}
		if (req.user.bookmarks.findIndex((bookmark) => bookmark == post.id) == -1) {
			req.user.bookmarks.push(post);
			req.user.save();
		} else {
			res.status(403).send('Bookmark Already Exists');
		}
	});
});
router.delete('/bookmarks/delete/:id', isLoggedIn, (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			if (!post) {
				res.status(404).send('Not Found');
			}
			let to_remove = req.user.bookmarks.findIndex((bookmark) => {
				return bookmark == post._id;
			});
			req.user.bookmarks.splice(to_remove, 1);
			req.user.save();
		})
		.catch((err) => res.send(err));
});

// Likes
router.post('/likes/new/:id', isLoggedIn, (req, res) => {
	Post.findById(req.params.id).populate('author')
		.exec(async (err, post) => {
			if (err) {
				res.send(err.message);
			}
			if (!post) {
				return res.status(404).send('Not Found');
			}
			if (post.liked_by.findIndex((user) => user == req.user.id) == -1) {
				post.liked_by.push(req.user);
				post.save();
				if (req.user.id != post.author.id) {
					try {
						let newNotification = {
							text: `${req.user.name} liked your ${post.category} ${post.title}`,
							author: req.user,
							link: `/post/${post._id}`
						};
						let notification = await Notification.create(newNotification);
						let user = await User.findById(post.author.id);
						user.notifications.push(notification);
						user.save();
					} catch (err) {
						if (err) {
							console.log(err.message + 'hey');
						}
					}
				}
			} else {
				res.status(403).send('You already Like this Post');
			}
		})
});
router.delete('/likes/delete/:id', isLoggedIn, (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			if (!post) {
				return res.status(404).send('Not Found');
			}
			let to_remove = post.liked_by.findIndex((user) => {
				return user == req.user.id;
			});
			post.liked_by.splice(to_remove, 1);
			post.save();
		})
		.catch((err) => {
			res.send(err);
		});
});

// User Follow
router.post('/follow/add/:id', isLoggedIn, (req, res) => {
	User.findById(req.params.id)
		.then(async (user) => {
			if (!user) {
				return res.status.send('Not Found');
			}
			if (user.followers.findIndex((follower) => req.user.id == follower) == -1 && user._id != req.user._id) {
				req.user.followings.push(user);
				user.followers.push(req.user);
				req.user.save();
				user.save();
				try {
					let newNotification = {
						text: `${req.user.name} started following you`,
						author: req.user,
						link: `/user/${req.user.id}`
					};
					let notification = await Notification.create(newNotification);
					user.notifications.push(notification);
					user.save();
				} catch (err) {
					if (err) {
						console.log(err.message);
					}
				}
			} else {
				res.status(403).send('You Already Follow this Account');
			}
		})
		.catch((err) => {
			res.send(err);
		});
});

router.post('/follow/delete/:id', isLoggedIn, (req, res) => {
	User.findById(req.params.id)
		.then((user) => {
			if (!user) {
				return res.status.send('Not Found');
			}

			let to_remove_follower = user.followers.findIndex((follower) => follower == req.user.id);
			let to_remove_following = req.user.followings.findIndex((following) => following == user._id);
			user.followers.splice(to_remove_follower, 1);
			req.user.followings.splice(to_remove_following, 1);

			req.user.save();
			user.save();
		})
		.catch((err) => {
			res.send(err);
		});
});

// Comments
router.get('/posts/:id/comments', (req, res) => {
	Post.findById(req.params.id).populate({ path: 'comments', populate: { path: 'author' } }).exec((err, post) => {
		if (err) {
			res.send(err);
		}
		if (!post) {
			return res.status(404).send('Not Found');
		}
		res.render('../utils/commentsAll', { comments: post.comments });
	});
});

router.post('/posts/:id/comments', isLoggedIn, (req, res) => {
	Post.findById(req.params.id).populate('author')
		.exec((err, post) => {
			if (!post) {
				return res.status(404).send('Not Found');
			}
			Comment.create(req.body)
				.then(async (newComment) => {
					newComment.author = req.user;
					post.comments.push(newComment);
					newComment.save();
					post.save();
					res.render('../utils/comments', { newComment: newComment });
					if (req.user.id != post.author.id) {
						try {
							let newNotification = {
								text: `${req.user.name} commented on your post ${post.title}`,
								author: req.user,
								link: `/post/${post.id}`
							};
							let notification = await Notification.create(newNotification);
							let author = await User.findById(post.author.id);
							author.notifications.push(notification);
							author.save();
						} catch (err) {
							res.send(err.message);
						}
					}
				})
				.catch((err) => res.send(err));
		})

});

router.put('/comments/edit/:id', isLoggedIn, (req, res) => {
	Comment.findByIdAndUpdate(req.params.id, req.body)
		.then((comment) => {
			if (!comment) {
				return res.status(404).send('Not Found');
			}
		})
		.then((err) => res.send(err));
});

router.delete('/comments/delete/:id', isLoggedIn, (req, res) => {
	Comment.findByIdAndDelete(req.params.id)
		.then((comment) => {
			if (!comment) {
				return res.status(404).send('Not Found');
			}
		})
		.then((err) => res.send(err));
});

// Social Media Handles
router.post('/socialHandles/facebook', isLoggedIn, (req, res) => {
	try {
		req.user.social_handles.facebook = req.body.url;
		req.user.save();
		res.send('Saved URL');
	} catch (err) {
		res.send(err.message);
	}
});

router.post('/socialHandles/twitter', isLoggedIn, (req, res) => {
	try {
		req.user.social_handles.twitter = req.body.url;
		req.user.save();
		res.send('Saved URL');
	} catch (err) {
		res.send(err.message);
	}
});

router.post('/socialHandles/instagram', isLoggedIn, (req, res) => {
	try {
		req.user.social_handles.instagram = req.body.url;
		req.user.save();
		res.send('Saved URL');
	} catch (err) {
		res.send(err.message);
	}
});

router.post('/socialHandles/linkedin', isLoggedIn, (req, res) => {
	try {
		req.user.social_handles.linkedin = req.body.url;
		req.user.save();
		res.send('Saved URL');
	} catch (err) {
		res.send(err.message);
	}
});

router.post('/socialHandles/personalBlog', isLoggedIn, (req, res) => {
	try {
		req.user.social_handles.personalBlog = req.body.url;
		req.user.save();
		res.send('Saved URL');
	} catch (err) {
		res.send(err.message);
	}
});

// ABout the User(Bio)
router.post('/aboutUser', isLoggedIn, async (req, res) => {
	try {
		req.user.bio = req.body.bio;
		req.user.save();
		res.send('Saved Your Bio');
	} catch (err) {
		res.send(err);
	}
});

// Delete Notifications
router.delete('/notifications/delete', isLoggedIn, (req, res) => {
	req.user.notifications.splice(0, req.user.notifications.length);
	req.user.save();
	Notification.find().populate({ path: 'author' }).exec((err, notifications) => {
		if (err) {
			return res.send(err.message);
		}
		res.send('deleted');
		for (notification of notifications) {
			Notification.findByIdAndDelete(notification._id, (err, noti) => {
				if (err) {
					res.send(err.message);
				}
			});
		}
		console.log(notifications);
	})
});



// *****************************************************************************************************************************************************
// Book reviews

// Search Books

// Like
router.post('/bookReview/likes/new/:id', isLoggedIn, (req, res) => {
	BookReview.findById(req.params.id).populate('book').populate('author')
		.exec(async (err, post) => {
			if (err) {
				res.send(err);
			}
			if (!post) {
				return res.status(404).send('Not Found');
			}
			if (post.liked_by.findIndex((user) => user == req.user.id) == -1) {
				post.liked_by.push(req.user);
				post.save();
				if (req.user.id != post.author.id) {
					try {
						let newNotification = {
							text: `${req.user.name} liked your review on the book ${post.book.bookTitle}`,
							author: req.user,
							link: `/book/${post.book.name}/${post.book._id}`
						};
						let notification = await Notification.create(newNotification);
						let user = await User.findById(post.author.id);
						user.notifications.push(notification);
						user.save();
					} catch (err) {
						if (err) {
							console.log(err.message + 'hey');
						}
					}
				}
			} else {
				res.status(403).send('You already Like this Post');
			}
		})
});


router.delete('/bookReview/likes/delete/:id', isLoggedIn, (req, res) => {
	BookReview.findById(req.params.id)
		.then((post) => {
			if (!post) {
				return res.status(404).send('Not Found');
			}
			let to_remove = post.liked_by.findIndex((user) => {
				return user == req.user.id;
			});
			post.liked_by.splice(to_remove, 1);
			post.save();
		})
		.catch((err) => {
			res.send(err);
		});
});


// Fidning Books from own Database
router.get('/bookReview/books/:author/:title', isLoggedIn, (req, res) => {
	let author = new RegExp(escapeRegex(req.params.author), 'gi');
	let title = new RegExp(escapeRegex(req.params.title), 'gi');
	Book.findOne({ authors: author, bookTitle: title })
		.then((book) => {
			if (!book) {
				res.send(null);
			}
			else {
				res.send(book);
			}
		})
		.catch(err => {
			res.send(err.message);
		})
});



function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
module.exports = router;