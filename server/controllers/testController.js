const Test = require('../models/Test');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

const ALLOWED_TEST_FIELDS = ['name', 'type', 'status', 'date', 'score', 'isArchived'];

// Helper function to pick only allowed fields from the client
const pickAllowedFields = (source) => {
  const picked = {};
  for (const key of ALLOWED_TEST_FIELDS) {
    if (source[key] !== undefined) picked[key] = source[key];
  }
  return picked;
};

const normalizeUpcomingPastDate = (effective) => {
  const status = effective.status ?? 'Upcoming';
  const date = effective.date;

  if (!date) return;

  const dateValue = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(dateValue.getTime())) return;

  if (status !== 'Upcoming') return;

  // Compare by day (UTC) to avoid timezone inconsistencies
  const todayUTC = new Date();
  todayUTC.setUTCHours(0, 0, 0, 0);

  const testUTC = new Date(dateValue);
  testUTC.setUTCHours(0, 0, 0, 0);

  if (testUTC < todayUTC) {
    effective.status = 'In Review';
  }
};

const validateScoreOnlyWhenCompleted = (effective) => {
  const status = effective.status ?? 'Upcoming';
  const scoreProvided = effective.score !== undefined;

  if (scoreProvided && status !== 'Completed') {
    throw new BadRequestError('Score only allowed when status is Completed');
  }
};

// Return all tests belonging to the authenticated user
const getAllTests = async (req, res, next) => {
  try {
    const filter = { createdBy: req.user.userId };
    const search = req.query.search?.trim();

    // Search filters
    if (search) {
      filter.$text = { $search: search };
    }

    // Other filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.isArchived !== undefined) filter.isArchived = req.query.isArchived === 'true';

    // Applying pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Applying sorting
    const sortString = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';

    const total = await Test.countDocuments(filter);
    const numberOfPages = Math.max(1, Math.ceil(total / limit));

    // If current page is out of the range, return an empty page
    if (page > numberOfPages) {
      return res.status(StatusCodes.OK).json({
        tests: [],
        count: 0,
        total,
        page,
        limit,
        numberOfPages,
      });
    }

    const tests = await Test.find(filter).sort(sortString).skip(skip).limit(limit);

    res.status(StatusCodes.OK).json({
      tests,
      count: tests.length,
      total,
      page,
      limit,
      numberOfPages,
    });
  } catch (error) {
    return next(error);
  }
};

const getTest = async (req, res) => {
  const {
    user: { userId },
    params: { id: testId },
  } = req;

  const test = await Test.findOne({
    createdBy: userId,
    _id: testId,
  });

  if (!test) {
    throw new NotFoundError(`Unable to find test with id ${testId}`);
  }

  res.status(StatusCodes.OK).json({ test });
};

const createTest = async (req, res) => {
  // Only accept allowed fields from client for security
  const data = pickAllowedFields(req.body);
  data.createdBy = req.user.userId;

  const effective = {
    status: data.status,
    date: data.date,
    score: data.score,
  };

  // Backend enforced rules
  normalizeUpcomingPastDate(effective);
  validateScoreOnlyWhenCompleted(effective);

  // Save the updated status if modified
  if (effective.status !== (data.status ?? 'Upcoming')) {
    data.status = effective.status;
  }

  const test = await Test.create(data);
  res.status(StatusCodes.CREATED).json({ test });
};

const updateTest = async (req, res) => {
  const {
    user: { userId },
    params: { id: testId },
  } = req;

  // Only update allowed fields
  const updates = pickAllowedFields(req.body);

  // Find the existing test
  const existing = await Test.findOne({
    createdBy: userId,
    _id: testId,
  });

  if (!existing) {
    throw new NotFoundError(`Unable to find test with id ${testId}`);
  }

  // Build the WIP final state after applying this patch
  const effective = {
    status: updates.status ?? existing.status,
    date: updates.date ?? existing.date,
    score: updates.score ?? existing.score,
  };

  // Backend enforced rules (update)
  normalizeUpcomingPastDate(effective);

  // Only validate score gating when client is trying to set score
  if (updates.score !== undefined) {
    validateScoreOnlyWhenCompleted({ status: effective.status, score: updates.score });
  }

  // If normalization changed status, persist it in the update
  if (effective.status !== (updates.status ?? existing.status)) {
    updates.status = effective.status;
  }

  const test = await Test.findOneAndUpdate(
    {
      createdBy: userId,
      _id: testId,
    },
    updates,
    { returnDocument: 'after', runValidators: true }
  );

  res.status(StatusCodes.OK).json({ test });
};

const deleteTest = async (req, res) => {
  const {
    user: { userId },
    params: { id: testId },
  } = req;

  const test = await Test.findOneAndDelete({
    createdBy: userId,
    _id: testId,
  });

  if (!test) {
    throw new NotFoundError(`Unable to find test with id ${testId}`);
  }

  res.status(StatusCodes.OK).json({ test });
};

module.exports = { getAllTests, getTest, createTest, updateTest, deleteTest };
