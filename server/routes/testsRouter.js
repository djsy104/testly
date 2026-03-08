/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Test CRUD + list features (search/filter/sort/pagination)
 */

const express = require('express');
const router = express.Router();
const {
  getAllTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
} = require('../controllers/testController');
const validateRequest = require('../middleware/validateRequest');
const {
  testIdValidation,
  createTestValidation,
  updateTestValidation,
  listTestsQueryValidation,
} = require('../validations/testValidation');

/**
 * @swagger
 * /api/tests:
 *   get:
 *     tags: [Tests]
 *     summary: List tests for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Full-text search (name)
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Upcoming, In Review, Completed] }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [Quiz, Exam, Midterm, Final Exam] }
 *       - in: query
 *         name: isArchived
 *         schema: { type: string, enum: [true, false] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, example: 10 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, example: "-createdAt" }
 *         description: Comma-separated fields, prefix with "-" for desc
 *     responses:
 *       200:
 *         description: List of tests + pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Test'
 *                 count:
 *                   type: integer
 *                   description: Number of tests returned in this page
 *                 total:
 *                   type: integer
 *                   description: Total number of matching tests across all pages
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 numberOfPages:
 *                   type: integer
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Authentication invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     tags: [Tests]
 *     summary: Create a new test
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, date]
 *             properties:
 *               name: { type: string, example: "Math Quiz 1" }
 *               type: { type: string, example: "Quiz" }
 *               status: { type: string, example: "Upcoming" }
 *               date: { type: string, format: date, example: "2026-03-20" }
 *               score: { type: integer, example: 95 }
 *               isArchived: { type: boolean, example: false }
 *     responses:
 *       201:
 *         description: Created test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Authentication invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router
  .route('/')
  .get(listTestsQueryValidation, validateRequest, getAllTests)
  .post(createTestValidation, validateRequest, createTest);

/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     tags: [Tests]
 *     summary: Get one test by id (must belong to the user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *
 *   patch:
 *     tags: [Tests]
 *     summary: Update a test by id (must belong to the user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               type: { type: string }
 *               status: { type: string }
 *               date: { type: string, format: date }
 *               score: { type: integer }
 *               isArchived: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     tags: [Tests]
 *     summary: Delete a test by id (must belong to the user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Test deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router
  .route('/:id')
  .get(testIdValidation, validateRequest, getTest)
  .patch(updateTestValidation, validateRequest, updateTest)
  .delete(testIdValidation, validateRequest, deleteTest);

module.exports = router;
