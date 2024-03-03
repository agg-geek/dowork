const express = require('express');
const { verifyToken } = require('../utils/verifyToken');
const {
	getOrders,
	createPaymentIntent,
	confirmPayment,
} = require('../controllers/order.controller');

const router = express.Router();

router.post('/create-payment-intent/:gigId', verifyToken, createPaymentIntent);
router.patch('/', verifyToken, confirmPayment);
router.get('/', verifyToken, getOrders);

module.exports = router;
