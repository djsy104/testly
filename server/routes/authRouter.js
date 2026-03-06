const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const authenticateUser = require('../middleware/authentication');
const validateRequest = require('../middleware/validateRequest');
const { loginValidation, registerValidation } = require('../validations/authValidation');

// Public routes
router.post('/register', registerValidation, validateRequest, registerUser);
router.post('/login', loginValidation, validateRequest, loginUser);

// Protected routes
router.get('/me', authenticateUser, getCurrentUser);

module.exports = router;
