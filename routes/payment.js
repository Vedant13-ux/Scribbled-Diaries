const express = require('express');
const router = express.Router();
const paytmChecksum = require('paytmchecksum');

router.get('/payment/paytm', (req, res) => {
	let params = {
		MID: 'vcIbam17379901118937',
		WEBSITE: 'WEBSTAGING',
		CHANNEL_ID: 'WEB',
		INDUSTRY_TYPE_ID: 'Retail'
	};
});
