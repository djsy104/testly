const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  // Creates a default error shape
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong... try again later! ',
  };

  // Handles Mongoose validation errors
  if (err.name === 'ValidationError') {
    // Extracts all validation messages and combines them
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(' ');
    customError.statusCode = 400;
  }

  // Handles invalid MongoDB Object IDs
  if (err.name === 'CastError') {
    customError.msg = `No object found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  // Handles duplicate key errors
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field. Please choose another value.`;
    customError.statusCode = 400;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
