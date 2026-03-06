const { body } = require('express-validator');
const User = require('../models/User');

// Register validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ min: 1, max: 30 })
    .withMessage('Name must be at least 1 character and less than 30 characters'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .bail()
    .trim()
    .toLowerCase()
    .custom(async (value) => {
      const userEmail = await User.exists({ email: value });
      if (userEmail) {
        throw new Error('Email already registered!');
      }

      return true;
    }),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .bail(),
];

// Login validation rules
const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .bail()
    .trim()
    .toLowerCase(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidation, loginValidation };
