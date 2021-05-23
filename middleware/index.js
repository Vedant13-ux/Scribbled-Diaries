// var User = require('../models/user');
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You should be logged in to do that');
	res.redirect('/login');
};

middlewareObj.restrictCreate = function(req, res, next) {
	if (!req.isAuthenticated()) {
		req.session.redirectTo = '/newPost';
		res.redirect('/login');
	} else {
		next();
	}
};

module.exports = middlewareObj;
