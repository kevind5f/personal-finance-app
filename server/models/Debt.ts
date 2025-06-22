import mongoose from 'mongoose';

const debtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['loan', 'credit_card', 'mortgage', 'other'],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  remainingAmount: {
    type: Number,
    required: true,
    min: 0
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  paymentFrequency: {
    type: String,
    enum: ['monthly', 'weekly', 'biweekly', 'quarterly', 'yearly'],
    required: true,
    default: 'monthly'
  },
  paymentAmount: {
    type: Number,
    required: true,
    min: 0
  },
  lender: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paid', 'defaulted'],
    default: 'active'
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
debtSchema.index({ user: 1, status: 1 });
debtSchema.index({ user: 1, endDate: 1 });

export const Debt = mongoose.model('Debt', debtSchema); 