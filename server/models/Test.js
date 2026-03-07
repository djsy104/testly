const mongoose = require('mongoose');
const TestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Test name must be provided.'],
      maxlength: 30,
    },

    type: {
      type: String,
      required: [true, 'Test type must be provided.'],
      enum: ['Quiz', 'Exam', 'Midterm', 'Final Exam', 'Other'],
      default: 'Quiz',
    },

    status: {
      type: String,
      enum: ['Upcoming', 'In Review', 'Completed'],
      default: 'Upcoming',
    },

    date: {
      type: Date,
      required: [true, 'Test date must be provided'],
    },

    score: {
      type: Number,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Test', TestSchema);
