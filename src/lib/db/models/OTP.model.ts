import mongoose, { Schema, Document, Model } from 'mongoose';
import type { OTPPurpose } from '@/types';

export interface IOTPDocument extends Document {
  email: string;
  codeHash: string;
  expiresAt: Date;
  purpose: OTPPurpose;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTPDocument>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    purpose: { type: String, enum: ['signup', 'reset'], required: true },
  },
  { timestamps: true }
);

// TTL index: MongoDB automatically deletes expired documents
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OTPSchema.index({ email: 1, purpose: 1 });

const OTP: Model<IOTPDocument> =
  mongoose.models.OTP || mongoose.model<IOTPDocument>('OTP', OTPSchema);
export default OTP;
