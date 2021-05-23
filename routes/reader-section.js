const express = require('express');
const router = express.Router();
const requests = require('requests');

router.get('/readerSection', (req, res) => {
	res.render('reader-section/poem');
});


module.exports = router;
