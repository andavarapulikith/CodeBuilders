const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  constraints: {
    type: String,
    required: true,
  },
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  sampleTestCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
      },
    },
  ],
  
  inputFile: {
    type: String, // Path to the input file
    required: false, // This can be optional if direct input is provided
  },
  outputFile: {
    type: String, // Path to the output file
    required: false, // This can be optional if direct output is provided
  },
  topicTags: [
    {
      type: String,
      trim: true,
    },
  ],
  companyTags: [
    {
      type: String,
      trim: true,
    }
  ],
  submissionsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
