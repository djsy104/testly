const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError } = require('../errors');

// Registers the user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name, userID: user._id }, token });
};

// Logs in the user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('Invalid credentials!');

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthenticatedError('Incorrect password!');

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

// Returns the current user
const getCurrentUser = async (req, res) => {
  // Finds user by id; if found return everything BUT password
  const user = await User.findById(req.user.userId).select('-password');

  // If user does not exist, return an error
  if (!user) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  res.status(StatusCodes.OK).json({ user });
};

module.exports = { registerUser, loginUser, getCurrentUser };
