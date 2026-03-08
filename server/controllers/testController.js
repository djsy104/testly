const Test = require('../models/Test');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');

const ALLOWED_TEST_FIELDS = ['name', 'type', 'status', 'date', 'score', 'isArchived'];

// Helper function to pick only allowed fields from the client
const pickAllowedFields = (source) => {
  const picked = {};
  for (const key of ALLOWED_TEST_FIELDS) {
    if (source[key] !== undefined) picked[key] = source[key];
  }
  return picked;
};

// Return all tests belonging to the authenticated user
const getAllTests = async (req, res, next) => {
  try {
    const filter = { createdBy: req.user.userId };
    const search = req.query.search?.trim();

    // Search filters
    if (search) {
      // $ -> MongoDB query operator
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

    const total = await Test.countDocuments(filter); // Total number of results
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

  const test = await Test.findOneAndUpdate(
    {
      createdBy: userId,
      _id: testId,
    },
    updates,
    { new: true, runValidators: true }
  );

  if (!test) {
    throw new NotFoundError(`Unable to find test with id ${testId}`);
  }

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
