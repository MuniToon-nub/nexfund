import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Industry, Location, RiskAppetite } from '@/types';

export interface IInvestorPreferenceDocument extends Document {
  investorId: mongoose.Types.ObjectId;
  industries: Industry[];
  minTicket: number;
  maxTicket: number;
  riskAppetite: RiskAppetite;
  preferredLocations: Location[];
  freeTextPreferences: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvestorPreferenceSchema = new Schema<IInvestorPreferenceDocument>(
  {
    investorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    industries: [{
      type: String,
      enum: ['e-commerce', 'light-manufacturing', 'agro-processing-agritech', 'tech-enabled-services', 'other'],
    }],
    minTicket: { type: Number, required: true, min: 0 },
    maxTicket: { type: Number, required: true, min: 0 },
    riskAppetite: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    preferredLocations: [{
      type: String,
      enum: ['Dhaka', 'Chattogram', 'Sylhet', 'Other'],
    }],
    freeTextPreferences: { type: String, default: '' },
  },
  { timestamps: true }
);

InvestorPreferenceSchema.index({ investorId: 1 });

const InvestorPreference: Model<IInvestorPreferenceDocument> =
  mongoose.models.InvestorPreference ||
  mongoose.model<IInvestorPreferenceDocument>('InvestorPreference', InvestorPreferenceSchema);
export default InvestorPreference;
