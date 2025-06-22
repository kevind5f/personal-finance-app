import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
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
    enum: ['cash', 'bank', 'credit', 'investment', 'other'],
    required: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  limit: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
accountSchema.index({ user: 1, type: 1 });

export const Account = mongoose.model('Account', accountSchema); 