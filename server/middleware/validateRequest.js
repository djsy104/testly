const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const validateRequest = (req, res, next) => {
  // Collect validation errors from express-validator
  const errors = validationResult(req);

  // If errors exist, handle them
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        message: 'Validation failed!',
        formattedErrors,
      },
    });
  }

  // If no validation errors, continue to controller
  next();
};

module.exports = validateRequest;
