const express = require('express');
const router = express.Router();
const { register, login, logout, getUser } = require('../controllers/authController');

router.get('/dashboard/:id', getUser);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
