var express = require('express');
var router = express.Router();

router.get('/google70b6e602a2529ed2.html', function(req, res) {
	res.render('google70b6e602a2529ed2.html');
});

router.get('/', function(req, res) {
	res.render('index/landing');
});

router.get('/aboutUs', (req, res) => {
	res.render('index/aboutUs');
});
router.get('*', (req, res) => {
	res.render('index/notFound.ejs');
});
module.exports = router;
