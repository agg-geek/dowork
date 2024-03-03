const express = require('express');
const {
	createConversation,
	getConversations,
	getSingleConversation,
	updateConversation,
} = require('../controllers/conversation.controller');
const { verifyToken } = require('../utils/verifyToken');

const router = express.Router();

router.post('/', verifyToken, createConversation);
router.get('/', verifyToken, getConversations);
router.get('/:id', verifyToken, getSingleConversation);
router.patch('/:id', verifyToken, updateConversation);

module.exports = router;
