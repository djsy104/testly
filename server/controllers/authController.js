const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

// Registers the user
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    throw new BadRequestError('Please provide a name, email, and passwword.');
  const user = await User.create({ name, email: email.trim().lowercase(), password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name, userID: user._id }, token });
};

// Logs in the user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) throw new BadRequestError('Please provide email.');

  if (!password) throw new BadRequestError('Please provide password.');

  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('Invalid credentials!');

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthenticatedError('Incorrect password!');

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

// Logs out the user
const logout = async (req, res) => {
  const { email, password } = req.body;

  if (!email) throw new BadRequestError('Please provide email.');

  if (!password) throw new BadRequestError('Please provide password.');

  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('Invalid credentials!');

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthenticatedError('Incorrect password!');

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

// Returns the current user
const getUser = async (req, res) => {
  const { email } = req.body;

  if (!email) throw new BadRequestError('Please provide email.');

  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('Invalid credentials!');

  res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email } });
};

module.exports = { register, login, logout, getUser };
