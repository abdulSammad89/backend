const mongoose = require('mongoose');
const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: (true, 'title must be required'),
    },
    description: {
      type: String,
      require: (true, 'description must be required'),
    },
    dueDate: {
      type: String,
      require: (true, 'dueDate must be required'),
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const projectModel = mongoose.model('projects', projectSchema);

module.exports = projectModel;
