const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authController');

router.get('/dashboard/:id', getUser);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
