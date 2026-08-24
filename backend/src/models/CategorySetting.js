const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySettingSchema = new Schema(
  {
    category: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    },
    severityWeight: {
      type: Number,
      required: [true, 'Severity weight is required'],
      min: [1, 'Severity weight minimum is 1'],
      max: [5, 'Severity weight maximum is 5'],
      default: 3
    },
    slaHours: {
      type: Number,
      required: [true, 'SLA hours is required'],
      min: [1, 'SLA hours must be at least 1 hour'],
      default: 24
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CategorySetting', CategorySettingSchema);
