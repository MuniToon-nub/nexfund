import mongoose, { Schema, Document, Model } from 'mongoose';
import type { UserRole, KYCStatus, SubscriptionTier } from '@/types';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  kycStatus: KYCStatus;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['sme', 'investor', 'admin'], required: true },
    isVerified: { type: Boolean, default: false },
    kycStatus: { type: String, enum: ['pending', 'verified', 'flagged', 'rejected'], default: 'pending' },
    subscriptionTier: { type: String, enum: ['free', 'premium'], default: 'free' },
    subscriptionExpiresAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
export default User;
