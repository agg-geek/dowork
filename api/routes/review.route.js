const express = require('express');
const { verifyToken } = require('../utils/verifyToken');
const { createReview, getReviews } = require('../controllers/review.controller');

const router = express.Router();

router.post('/', verifyToken, createReview);
router.get('/:gigId', getReviews);

module.exports = router;
