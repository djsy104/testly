const express = require('express');
const router = express.Router();
const {
  getAllTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
} = require('../controllers/tests');
const validateRequest = require('../middleware/validateRequest');
const {
  testIdValidation,
  createTestValidation,
  updateTestValidation,
  listTestsQueryValidation,
} = require('../validations/testValidation');

// Display all tests + Create test
router
  .route('/')
  .get(listTestsQueryValidation, validateRequest, getAllTests)
  .post(createTestValidation, validateRequest, createTest);

// Get + Update + Delete test
router
  .route('/:id')
  .get(testIdValidation, validateRequest, getTest)
  .patch(updateTestValidation, validateRequest, updateTest)
  .delete(testIdValidation, validateRequest, deleteTest);

module.exports = router;
