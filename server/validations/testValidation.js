const { body, param, query } = require('express-validator');

// Allowed enum types
const TEST_TYPES = ['Quiz', 'Exam', 'Midterm', 'Final Exam'];
const TEST_STATUSES = ['Upcoming', 'In Review', 'Completed'];
const TEST_SORT_FIELDS = ['type', 'status', 'score', 'date', 'createdAt', 'isArchived'];

// Validates the test ID to ensure its a valids MongoDB ObjectId
const testIdValidation = [param('id').isMongoId().withMessage('Invalid test id format').bail()];

const normalizeUpcomingPastDateToInReview = (req, { assumeUpcomingIfMissing = false } = {}) => {
  const hasDate = req.body.date !== undefined && req.body.date !== null;
  if (!hasDate) return;

  // Make sure it's a Date and handle if not
  const dateValue = req.body.date instanceof Date ? req.body.date : new Date(req.body.date);
  if (Number.isNaN(dateValue.getTime())) return;

  const statusValue = req.body.status;

  // Only normalize if status is Upcoming OR missing (create flow default is Upcoming)
  const isUpcoming =
    statusValue === 'Upcoming' || (assumeUpcomingIfMissing && statusValue === undefined);

  if (!isUpcoming) return;

  const now = new Date();
  if (dateValue < now) {
    req.body.status = 'In Review';
  }
};

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
    .withMessage('isArchived must be a boolean')
    .bail()
    .toBoolean(),

  // Prevent clients from setting ownership
  body('createdBy')
    .optional()
    .custom(() => {
      throw new Error('createdBy cannot be set by the client');
    }),

  body().custom((_, { req }) => {
    normalizeUpcomingPastDateToInReview(req, { assumeUpcomingIfMissing: true });
    return true;
  }),

  body().custom((_, { req }) => {
    const { status, score } = req.body;

    if (score !== undefined && status !== 'Completed') {
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
    .withMessage('isArchived must be a boolean')
    .bail()
    .toBoolean(),

  // Prevent clients from setting ownership
  body('createdBy')
    .optional()
    .custom(() => {
      throw new Error('createdBy cannot be updated by the client');
    }),

  // If payload includes BOTH date and status, normalize if date is past and status is Upcoming.
  body().custom((_, { req }) => {
    const hasStatus = req.body.status !== undefined;
    const hasDate = req.body.date !== undefined;

    if (hasStatus && hasDate) {
      normalizeUpcomingPastDateToInReview(req);
    }

    return true;
  }),

  body().custom((_, { req }) => {
    const hasScore = req.body.score !== undefined;
    const hasStatus = req.body.status !== undefined;

    if (!hasScore) return true;

    if (hasStatus && req.body.status !== 'Completed') {
      throw new Error('Score only allowed when status is Completed');
    }

    return true;
  }),
];

// Query validation rules (stuff after ? in url)
const listTestsQueryValidation = [
  query('search')
    .optional()
    .isString()
    .withMessage('search must be a string')
    .bail()
    .isLength({ max: 100 })
    .withMessage('search must be at most 100 characters'),

  query('status')
    .optional()
    .isIn(TEST_STATUSES)
    .withMessage(`Test status must be one of: ${TEST_STATUSES.join(', ')}`)
    .bail(),

  query('type')
    .optional()
    .isIn(TEST_TYPES)
    .withMessage(`Test type must be one of: ${TEST_TYPES.join(', ')}`)
    .bail(),

  query('isArchived')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isArchived must be a boolean string: true or false')
    .bail(),

  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be an integer >= 1')
    .bail(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100')
    .bail(),

  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a valid string')
    .bail()
    .custom((value) => {
      const fields = value.split(',');
      for (let field of fields) {
        const baseField = field.startsWith('-') ? field.substring(1) : field;
        if (!TEST_SORT_FIELDS.includes(baseField)) {
          throw new Error(`Invalid sort field. Allowed fields: ${TEST_SORT_FIELDS.join(', ')}`);
        }
      }
      return true;
    }),
];

module.exports = {
  testIdValidation,
  createTestValidation,
  updateTestValidation,
  listTestsQueryValidation,
};
