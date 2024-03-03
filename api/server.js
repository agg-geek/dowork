require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoute = require('./routes/user.route');
const gigRoute = require('./routes/gig.route');
const orderRoute = require('./routes/order.route');
const conversationRoute = require('./routes/conversation.route');
const messageRoute = require('./routes/message.route');
const reviewRoute = require('./routes/review.route');
const authRoute = require('./routes/auth.route');

const app = express();

mongoose.set('strictQuery', true);

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('MongoDB connection successful'))
	.catch(err => console.error(err));

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/gigs', gigRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/orders', orderRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.use((err, req, res, next) => {
	const errorStatus = err.status || 500;
	const errorMessage = err.message || 'Something went wrong!';

	return res.status(errorStatus).send(errorMessage);
});

app.listen(8800, () => {
	console.log('Backend server is running!');
});
