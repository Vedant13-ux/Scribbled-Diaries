///including packages
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.disable('etag').disable('x-powered-by');
require('dotenv').config();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const TwitterStrategy = require('passport-twitter');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const User = require('./models/user');
const Message = require('./models/messages');
const Conversation = require('./models/conversation');
const { fork } = require('child_process');
const Stripe = require('stripe');

require('dotenv').config();
// const User = require('./models/user');

//database config
mongoose
	.connect(
		'mongodb://localhost:27017/diaries' ||
		'mongodb+srv://vedant13:1234@cluster0.4j7p8.mongodb.net/scribbled-diaries?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		}
	)
	.then(() => {
		console.log('Connected');
	})
	.catch((err) => {
		console.log(err.message);
	});
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(
	require('express-session')({
		secret: 'Vedant is Cool',
		resave: false,
		saveUninitialized: false
	})
);
app.use(flash());

//Setting Up Passport.JS

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); //Strategies

// User of Local Variables in HTML Files

// Socket.io
const socket = require('socket.io');
const server = app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log('listening on *:3000');
});
const io = socket(server);

// Chat Scetion
const botName = 'Chat Bot';
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

// Run when client connects
io.on('connection', (socket) => {
	// console.log(socket);
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		// Welcome current user
		socket.emit('message', formatMessage(botName, 'Welcome to CraftedDiaries Chat!'));

		// Broadcast when a user connects
		socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

		// Send users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
		});
	});

	// Listen for chatMessage
	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});


	// Runs when client disconnects
	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		if (user) {
			io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

			// Send users and room info
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room)
			});
		}
	});
});


// Private Chat
var onlineUsers = {};
var online = []
io.on('connection', (socket) => {
	socket.on('online', (userId) => {
		onlineUsers[userId] = socket;
		online.push();
		console.log(onlineUsers);
	});

	socket.on('pvtMessage', async ({ userId, to, msg }) => {
		try {
			var toUser = await User.findById(to);
			var fromUser = await User.findById(userId);
			var msgBody = {
				from: fromUser,
				to: toUser,
				text: msg
			}
			var newMsg = await Message.create(msgBody);
			Conversation.findOne({ $or: [{ between: `${userId}/${to}` }, { between: `${to}/${userId}` }] })
				.then(async (conv) => {
					if (!conv) {
						try {
							let newConv = await Conversation.create({ between: `${userId}/${to}` });
							req.user.conversations.push(newConv);
							req.user.interactions.push(toUser);
							toUser.interactions.push(req.user);
							toUser.conversations.push(newConv);
							newConv.messages.push(newMsg);
							newConv.save();
							req.user.save();
							toUser.save();
						}
						catch (err) {
							console.log(err.message);
						}
					}
					else {
						conv.messages.push(newMsg);
						conv.save();
					}
				})
		} catch (err) {
			console.log(err.message);
		}
		if (to in online) {
			io.to(onlineUsers[to]).emit('newPvtMsg', msgBody);
		}
	});
});
app.use(function (req, res, next) {
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use(async function (req, res, next) {
	if (req.user) {
		try {
			let user = await User.findById(req.user._id).populate({ path: 'notifications', populate: { path: 'author' } }).exec();
			res.locals.notifications = user.notifications.reverse();
		} catch (err) {
			console.log(err.message);
		}
	}
	next();
});
// ***********************************************************

// app.use(async (req, res, next) => {
// 	if(req.user){
// 		let user = await User.findById('5f81bd52ea1f8a082c599255');
// 		req.user.interactions.push(user);
// 		req.user.save();
// 	}
// 	next();
// });

var indexRoutes = require('./routes/index');
var reader = require('./routes/reader-section');

var homeRoutes = require('./routes/home');
var postRoutes = require('./routes/posts');
var chatRoutes = require('./routes/chat');
var authRoutes = require('./routes/auth');
var BookReviewRutes = require('./routes/bookReviews');
var apiRoutes = require('./routes/api');
const { emit } = require('process');

app.use(reader);
app.use(homeRoutes);
app.use(postRoutes);
app.use(chatRoutes);
app.use(BookReviewRutes);
app.use(authRoutes);
app.use('/api/', apiRoutes);
app.use(indexRoutes);

// app.listen(process.env.PORT || 3000, process.env.IP, function() {
// 	console.log('Crafted Diaries is Running');
// });
