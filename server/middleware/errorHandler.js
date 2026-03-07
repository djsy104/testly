const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  // Default to 500 if the error object doesn't have a status code
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // Creates a default error shape
  let payload = {
    error: {
      message: err.message || 'Something went wrong',
    },
  };

  // Handles Mongoose validation errors
  if (err.name === 'ValidationError') {
    payload.error.message = 'Validation failed';

    // Extracts all validation messages
    payload.error.details = Object.values(err.errors).map((item) => ({
      field: item.path, // The field that failed validation
      message: item.message, // The validation message
    }));
    statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handles invalid MongoDB Object IDs
  if (err.name === 'CastError') {
    payload.error.message = `No object found with id : ${err.value}`;
    statusCode = StatusCodes.NOT_FOUND;
  }

  // Handles duplicate key errors (MongoDB error code 11000)
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    payload.error.message = 'Duplicate value';
    payload.error.details = [{ field, message: `${field} "${value}" is already in use` }];

    statusCode = StatusCodes.BAD_REQUEST;
  }

  return res.status(statusCode).json(payload);
};

module.exports = errorHandlerMiddleware;
