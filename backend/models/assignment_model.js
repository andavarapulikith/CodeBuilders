const mongoose = require('mongoose');
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  problems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Assignment', assignmentSchema);
