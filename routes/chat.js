const express = require('express'),
	router = express.Router();
const { isLoggedIn } = require('../middleware/index');
const User=require('../models/user');

router.get('/chat', isLoggedIn, (req, res) => {
	res.render('chat/index.ejs');
});

router.get('/chat/messanger', isLoggedIn, (req, res) => {
	res.render('chat/chat2.ejs');
});
router.get('/chat/personal',isLoggedIn,async (req,res)=>{
	try{
		var user= await User.findById(req.user.id).populate({path:'conversations',populate:{path:'messages',populate:{path:'to'}}}).populate('interactions').exec();
	}catch(err){
		console.log(err.message);
	}
	res.render('chat/personalChat',{user});
})
module.exports = router;
