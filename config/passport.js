var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');
var bcrypt = require('bcrypt');
const crypto = require('crypto');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		return done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			return done(err, user);
		});
	});

	passport.use(
		'local-signup',
		new LocalStrategy(
			{
				usernameField: 'username',
				passwordField: 'password',
				passReqToCallback: true
			},
			function(req, username, password, done) {
				process.nextTick(function() {
					User.findOne({ name: username })
						.then(async function(user) {
							if (user) {
								return done(null, false, req.flash('error', 'The username is already taken.'));
							} else {
								var newUser = new User();
								newUser.name = username;
								newUser.password = newUser.generateHash(password);
								newUser.email = req.body.email;
								const token = crypto.randomBytes(64);
								newUser.token = token;
								newUser.save((err) => {
									if (err) {
										console.log(err);
										throw err;
									}
									return done(null, newUser);
								});
								// if (req.body.email) {
								// 	const mailOptions = {
								// 		from: 'Nodemailer Contact "<1e37fcde9bf32b>"',
								// 		to: req.body.email,
								// 		subject: 'Scribbled Diaries - Verification',
								// 		text: `
								// 		Hello, Thanks for regstering on our site. Please Click on the link bellow to verify your Account.
								// 		http://${req.headers.host}/verify-email?token=${token}`,
								// 		html: `
								// 			<h1>Hello,</h1>
								// 			<p> Thanks for regstering on our site. </p>
								// 			<p>Please Click on the link bellow to verify your Account.</p>
								// 			<a href="http://${req.headers.host}/verify-email?token=${token}">Verify Your Account</a>
								// 		`
								// 	};
								// 	var transporter = nodemailer.createTransport({
								// 		host: 'smtp.gmail.com',
								// 		port: 465,
								// 		auth: {
								// 			user: 'vedantnagani@gmail.com',
								// 			pass: 'vedant@2235'
								// 		}
								// 	});
								// 	transporter.sendMail(mailOptions, (err, info) => {
								// 		if (err) {
								// 			return console.log(err.message);
								// 		}
								// 		console.log('Message Sent : %s', info.messageId);
								// 		console.log('Preview URL : %s', info.getTestMessageURL(info));
								// 	});
								// }
							}
						})
						.catch((err) => {
							return done(err);
						});
				});
			}
		)
	);

	passport.use(
		'local-login',
		new LocalStrategy(
			{
				usernameField: 'username',
				passwordField: 'password',
				passReqToCallback: true
			},
			function(req, username, password, done) {
				process.nextTick(function() {
					User.findOne({ name: username })
						.then(function(user) {
							if (!user) {
								return done(null, false, req.flash('error', 'Username does not exist'));
							}
							bcrypt.compare(password, user.password, function(err, result) {
								if (result) {
									return done(null, user);
								} else {
									return done(null, false, req.flash('error', 'Password is incorrect'));
								}
							});
						})
						.catch((err) => {
							return done(err);
						});
				});
			}
		)
	);

	passport.use(
		'facebook',
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_APP_ID,
				clientSecret: process.env.FACEBOOK_APP_SECRET,
				callbackURL: 'http://localhost:3000/auth/facebook/callback',
				// callbackURL:'https://scribbled-diaries.herokuapp.com/auth/facebook/callback',
				profileFields: [ 'id', 'emails', 'name', 'picture.type(large)' ],
				passReqToCallback: true
			},
			function(req, accessToken, refreshToken, profile, done) {
				if (!req.user) {
					process.nextTick(function() {
						User.findOne({ unique_id: profile.id })
							.then(function(user) {
								if (user) {
									user.email = profile.emails[0].value;
									user.name = profile.name.givenName + ' ' + profile.name.familyName;
									user.photo = profile.photos
										? profile.photos[0].value
										: '/img/faces/unknown-user-pic.jpg';
									return done(null, user);
								} else {
									var newUser = new User();
									newUser.unique_id = profile.id;
									newUser.email = profile.emails[0].value;
									newUser.token = accessToken;
									newUser.type = 'facebook';
									newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
									newUser.photo = profile.photos
										? profile.photos[0].value
										: '/img/faces/unknown-user-pic.jpg';
									newUser.isVerified = true;
									newUser.save(function(err) {
										if (err) {
											throw err;
										}
										return done(null, newUser);
									});
								}
							})
							.catch((err) => {
								return done(err);
							});
					});
				}
			}
		)
	);

	passport.use(
		'google',
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: 'http://localhost:3000/auth/google/callback',
				// callbackURL:'https://scribbled-diaries.herokuapp.com/auth/google/callback',
				profileFields: [ 'id', 'emails', 'name', 'photos' ],
				passReqToCallback: true
			},
			function(req, accessToken, refreshToken, profile, done) {
				if (!req.user) {
					User.findOne({ unique_id: profile.id })
						.then(function(user) {
							if (user) {
								user.email = profile.emails[0].value;
								user.name = profile.displayName;
								user.photo = profile.photos
									? profile.photos[0].value
									: '/img/faces/unknown-user-pic.jpg';
								user.save();
								return done(null, user);
							} else {
								var newUser = new User();
								newUser.unique_id = profile.id;
								newUser.email = profile.emails[0].value;
								newUser.token = accessToken;
								newUser.type = 'google';
								newUser.name = profile.displayName;
								newUser.photo = profile.photos
									? profile.photos[0].value
									: '/img/faces/unknown-user-pic.jpg';
								newUser.isVerified = true;

								newUser.save(function(err) {
									if (err) {
										throw err;
									}
									return done(null, newUser);
								});
							}
						})
						.catch((err) => {
							return done(err);
						});
				}
			}
		)
	);

	passport.use(
		new TwitterStrategy(
			{
				consumerKey: process.env.TWITTER_API_KEY,
				consumerSecret: process.env.TWITTER_API_SECRET,
				callbackURL: 'http://localhost:3000/auth/twitter/callback',
				// callbackURL:'https://scribbled-diaries.herokuapp.com/auth/twitter/callback',
				profileFields: [ 'id', 'emails', 'name', 'photos' ],
				passReqToCallback: true
			},
			function(req, token, tokenSecret, profile, done) {
				process.nextTick(function() {
					User.findOne({ unique_id: profile.id })
						.then(function(user) {
							if (user) {
								var photo = profile.photos[0].value.replace('_normal', '');
								user.email = profile.email;
								user.name = profile.displayName;
								user.photo = profile.photos ? photo : '/img/faces/unknown-user-pic.jpg';
								user.save();
								return done(null, user);
							} else {
								var newUser = new User();
								var photo = profile.photos[0].value.replace('_normal', '');
								newUser.unique_id = profile.id;
								newUser.email = profile.email;
								newUser.type = 'twitter';
								newUser.token = token;
								newUser.name = profile.displayName;
								newUser.photo = profile.photos ? photo : '/img/faces/unknown-user-pic.jpg';

								newUser.save(function(err) {
									if (err) {
										throw err;
									}
									return done(null, newUser);
								});
							}
						})
						.catch((err) => {
							return done(err);
						});
				});
			}
		)
	);
};
