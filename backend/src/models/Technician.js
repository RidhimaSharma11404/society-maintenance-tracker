const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    specialty: {
      type: String,
      required: true, // e.g. 'Plumbing', 'Electrical', 'Elevator AMC', 'Civil'
      index: true
    },
    company: {
      type: String,
      default: 'In-House Society Staff'
    },
    phone: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 4.8
    },
    activeJobsCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Available', 'On Job', 'Off Duty'],
      default: 'Available',
      index: true
    },
    currentLocation: {
      type: String,
      default: 'Society Maintenance Office'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Technician', technicianSchema);
