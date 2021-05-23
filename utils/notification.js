const mongoose = require('mongoose');

const User = require('../models/user');
const Notification = require('../models/notification');
mongoose.connect(
	'mongodb://localhost:27017/diaries' ,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	}
);

process.on('message', async (notif) => {
	try {
		var user = await User.findById(notif.user_id).populate('followers').exec();
		var notification = await Notification.create(notif.notification);

		for (follower of user.followers) {
			follower.notifications.push(notification);
			await follower.save();
			console.log('saved');
		}
	} catch (err) {
		console.log('error');
	}

	process.exit();
});
