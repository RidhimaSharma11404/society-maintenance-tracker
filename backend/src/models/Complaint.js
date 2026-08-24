const mongoose = require('mongoose');

const { Schema } = mongoose;

const StatusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    comment: {
      type: String,
      required: [true, 'A transition comment is required']
    }
  },
  { _id: true }
);

const ComplaintSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    unitNumber: {
      type: String,
      required: [true, 'Unit number is required'],
      trim: true,
      index: true
    },
    resident: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    photoUrl: {
      type: String,
      default: null
    },
    currentStatus: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
      index: true
    },
    statusHistory: [StatusHistorySchema],
    dueDate: {
      type: Date,
      required: true,
      index: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    }
  },
  {
    timestamps: true
  }
);

// Define allowed transitions for strict Finite State Machine
const VALID_TRANSITIONS = {
  'Open': ['In Progress', 'Resolved'],
  'In Progress': ['Resolved', 'Open'],
  'Resolved': ['Closed', 'In Progress'],
  'Closed': []
};

// Pre-save validation to enforce state transitions
ComplaintSchema.pre('save', function (next) {
  if (this.isModified('currentStatus') && this.statusHistory.length > 0) {
    // If it's a new document, the first status is Open
    if (this.isNew) {
      return next();
    }

    // Previous status from history before the latest change
    // Note: statusHistory contains all historical steps.
    // If statusHistory has length >= 2 and the last entry represents the new state,
    // we compare the penultimate entry with currentStatus.
    let prevStatus = 'Open';
    if (this.statusHistory.length >= 2) {
      prevStatus = this.statusHistory[this.statusHistory.length - 2].status;
    } else if (this.statusHistory.length === 1) {
      prevStatus = this.statusHistory[0].status;
    }

    const nextStatus = this.currentStatus;

    if (prevStatus !== nextStatus) {
      const allowed = VALID_TRANSITIONS[prevStatus] || [];
      if (!allowed.includes(nextStatus)) {
        return next(
          new Error(`Invalid status transition from '${prevStatus}' to '${nextStatus}'. Allowed transitions: [${allowed.join(', ')}]`)
        );
      }
    }
  }
  next();
});

ComplaintSchema.statics.getValidTransitions = function (currentStatus) {
  return VALID_TRANSITIONS[currentStatus] || [];
};

module.exports = mongoose.model('Complaint', ComplaintSchema);
