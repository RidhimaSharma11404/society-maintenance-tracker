const mongoose = require('mongoose');

const { Schema } = mongoose;

const NoticeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: [true, 'Notice content is required'],
      trim: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true
    },
    category: {
      type: String,
      enum: ['General', 'Maintenance', 'Emergency', 'Event', 'Finance'],
      default: 'General'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notice', NoticeSchema);
