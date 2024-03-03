const express = require('express');
const { deleteUser, getUser } = require('../controllers/user.controller');
const { verifyToken } = require('../utils/verifyToken');

const router = express.Router();

router.get('/:id', getUser);
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
