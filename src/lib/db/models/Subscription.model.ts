import mongoose, { Schema, Document, Model } from 'mongoose';
import type { SubscriptionTier, PaymentMethod } from '@/types';

export interface ISubscriptionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  tier: SubscriptionTier;
  amount: number;
  billingCycle: 'monthly';
  paymentMethod: PaymentMethod;
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tier: { type: String, enum: ['free', 'premium'], required: true },
    amount: { type: Number, required: true },
    billingCycle: { type: String, enum: ['monthly'], default: 'monthly' },
    paymentMethod: { type: String, enum: ['bkash', 'nagad', 'sslcommerz'], required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ userId: 1, status: 1 });

const Subscription: Model<ISubscriptionDocument> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscriptionDocument>('Subscription', SubscriptionSchema);
export default Subscription;
