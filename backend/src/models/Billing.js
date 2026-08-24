const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema(
  {
    unitNumber: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    residentName: {
      type: String,
      required: true
    },
    month: {
      type: String,
      required: true // e.g. 'August 2026'
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    breakdown: {
      maintenanceCharge: { type: Number, default: 3500 },
      sinkingFund: { type: Number, default: 500 },
      waterCharges: { type: Number, default: 450 },
      commonElectricity: { type: Number, default: 650 },
      parkingFee: { type: Number, default: 400 }
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['PAID', 'DUE', 'OVERDUE'],
      default: 'DUE',
      index: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    paidDate: {
      type: Date
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'NetBanking', 'CreditCard', 'Cash', 'Pending'],
      default: 'Pending'
    },
    transactionRef: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Billing', billingSchema);
