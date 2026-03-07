const { body, param, query } = require('express-validator');

// Allowed enum types
const TEST_TYPES = ['Quiz', 'Exam', 'Midterm', 'Final'];
const TEST_STATUSES = ['Upcoming', 'In Review', 'Completed'];

// Validates the test ID to ensure its a valids MongoDB ObjectId
const testIdValidation = [param('id').isMongoId().withMessage('Invalid test id format').bail()];

// Create test validation rules
const createTestValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Test name is required')
    .bail()
    .isLength({ max: 30 })
    .withMessage('Test name must be less than or equal to 30 characters')
    .bail(),

  body('type')
    .notEmpty()
    .withMessage('Test type is required')
    .bail()
    .isIn(TEST_TYPES)
    .withMessage(`Valid Test types are: ${TEST_TYPES.join(', ')}`)
    .bail(),

  body('status')
    .optional()
    .isIn(TEST_STATUSES)
    .withMessage(`Valid Test statuses are: ${TEST_STATUSES.join(', ')}`)
    .bail(),

  body('date')
    .notEmpty()
    .withMessage('Test date is required')
    .bail()
    .isISO8601()
    .withMessage('Test date must be a valid ISO-8601 date (YYYY-MM-DD)')
    .bail()
    .toDate(),

  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be an integer between 0 and 100')
    .bail(),

  body('isArchived')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('isArchived must be a boolean')
    .bail(),

  // Prevent clients from setting ownership
  body('createdBy')
    .optional()
    .custom(() => {
      throw new Error('createdBy cannot be set by the client');
    }),

  // Ensures score MUST be set if status is 'Completed'
  body().custom((_, { req }) => {
    const { status, score } = req.body;

    if (status === 'Completed' && score === undefined) {
      throw new Error('Score required when status is Completed');
    }

    if (status !== 'Completed' && score !== undefined) {
      throw new Error('Score only allowed when status is Completed');
    }

    return true;
  }),
];

// Update test validation rules
const updateTestValidation = [
  // Utilizes the spread operator to apply the testIdValidation logic
  ...testIdValidation,

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Test name cannot be empty')
    .bail()
    .isLength({ max: 30 })
    .withMessage('Test name must be less than or equal to 30 characters')
    .bail(),

  body('type')
    .optional()
    .notEmpty()
    .withMessage('Test type cannot be empty')
    .bail()
    .isIn(TEST_TYPES)
    .withMessage(`Valid Test types are: ${TEST_TYPES.join(', ')}`)
    .bail(),

  body('status')
    .optional()
    .notEmpty()
    .withMessage('Status cannot be empty')
    .bail()
    .isIn(TEST_STATUSES)
    .withMessage(`Valid Test statuses are: ${TEST_STATUSES.join(', ')}`)
    .bail(),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Test date must be a valid ISO-8601 date (YYYY-MM-DD)')
    .bail()
    .toDate(),

  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be an integer between 0 and 100')
    .bail(),

  body('isArchived')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('isArchived must be a boolean')
    .bail(),

  // Prevent clients from setting ownership
  body('createdBy')
    .optional()
    .custom(() => {
      throw new Error('createdBy cannot be updated by the client');
    }),

  // Ensures score MUST be set if status is 'Completed'
  body().custom((_, { req }) => {
    const hasStatus = req.body.status !== undefined;
    const hasScore = req.body.score !== undefined;

    // If neither field is being updated, skip
    if (!hasStatus && !hasScore) return true;

    const { status, score } = req.body;

    if (status === 'Completed' && score === undefined) {
      throw new Error('Score required when status is Completed');
    }

    if (status !== 'Completed' && score !== undefined) {
      throw new Error('Score only allowed when status is Completed');
    }

    return true;
  }),
];

// Query validation rules (stuff after ? in url)
const listTestsQueryValidation = [
  query('status')
    .optional()
    .isIn(TEST_STATUSES)
    .withMessage(`status must be one of: ${TEST_STATUSES.join(', ')}`)
    .bail(),

  query('type')
    .optional()
    .isIn(TEST_TYPES)
    .withMessage(`type must be one of: ${TEST_TYPES.join(', ')}`)
    .bail(),

  query('isArchived')
    .optional()
    .isBoolean()
    .withMessage('isArchived must be a boolean')
    .bail()
    .toBoolean(),

  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('page must be an integer >= 1')
    .bail()
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100')
    .bail()
    .toInt(),
];

module.exports = {
  testIdValidation,
  createTestValidation,
  updateTestValidation,
  listTestsQueryValidation,
};
