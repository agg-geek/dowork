const express = require('express');
const {
	getGig,
	getGigs,
	createGig,
	deleteGig,
} = require('../controllers/gig.controller');
const { verifyToken } = require('../utils/verifyToken');

const router = express.Router();

router.get('/', getGigs);
router.get('/:id', getGig);
router.post('/', verifyToken, createGig);
router.delete('/:id', verifyToken, deleteGig);

module.exports = router;
