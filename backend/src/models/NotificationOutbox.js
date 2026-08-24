const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationOutboxSchema = new Schema(
  {
    recipient: {
      type: String,
      required: [true, 'Recipient is required'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    body: {
      type: String,
      required: [true, 'Body is required']
    },
    status: {
      type: String,
      enum: ['PENDING', 'SENT', 'FAILED'],
      default: 'PENDING',
      index: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastAttempt: {
      type: Date,
      default: null
    },
    error: {
      type: String,
      default: null
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('NotificationOutbox', NotificationOutboxSchema);
