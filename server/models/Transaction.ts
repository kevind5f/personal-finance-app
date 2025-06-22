import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['expense', 'income', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
  },
  description: {
    type: String
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  targetAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  receipt: {
    type: String // URL or path to receipt image
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1, date: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema); 