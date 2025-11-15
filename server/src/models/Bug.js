// models/Bug.js - Bug model schema

const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    reporter: {
      type: String,
      required: [true, 'Reporter name is required'],
      trim: true,
    },
    assignedTo: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    stepsToReproduce: {
      type: String,
      trim: true,
    },
    expectedBehavior: {
      type: String,
      trim: true,
    },
    actualBehavior: {
      type: String,
      trim: true,
    },
    environment: {
      type: String,
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
bugSchema.index({ status: 1 });
bugSchema.index({ priority: 1 });
bugSchema.index({ createdAt: -1 });

// Instance method to update status
bugSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

// Static method to get bugs by status
bugSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

module.exports = mongoose.model('Bug', bugSchema);

