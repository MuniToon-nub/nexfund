import mongoose, { Schema, Document, Model } from 'mongoose';
import type { PitchStatus, FundingType, Industry, Location, IAIExtractedFields } from '@/types';

export interface IPitchDocument extends Document {
  ownerId: mongoose.Types.ObjectId;
  businessName: string;
  industry: Industry;
  description: string;
  fundingAsk: number;
  fundingType: FundingType;
  yearsOperating: number;
  employeeCount: number;
  location: Location;
  documents: {
    tradeLicenseUrl?: string;
    tinCertificateUrl?: string;
    pitchDeckUrl?: string;
    financialsUrl?: string;
  };
  legitimacyScore: number;
  legitimacyFlags: string[];
  aiExtractedFields?: IAIExtractedFields;
  status: PitchStatus;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PitchSchema = new Schema<IPitchDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: true, trim: true },
    industry: {
      type: String,
      enum: ['e-commerce', 'light-manufacturing', 'agro-processing-agritech', 'tech-enabled-services', 'other'],
      required: true,
    },
    description: { type: String, required: true },
    fundingAsk: { type: Number, required: true }, // BDT integer
    fundingType: { type: String, enum: ['equity', 'debt', 'revenue-share'], required: true },
    yearsOperating: { type: Number, required: true, min: 0 },
    employeeCount: { type: Number, required: true, min: 0 },
    location: { type: String, enum: ['Dhaka', 'Chattogram', 'Sylhet', 'Other'], required: true },
    documents: {
      tradeLicenseUrl: String,
      tinCertificateUrl: String,
      pitchDeckUrl: String,
      financialsUrl: String,
    },
    legitimacyScore: { type: Number, default: 0, min: 0, max: 100 },
    legitimacyFlags: [{ type: String }],
    aiExtractedFields: {
      industry: String,
      riskIndicators: [String],
      businessModelSummary: String,
    },
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'active', 'flagged', 'closed'],
      default: 'draft',
    },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PitchSchema.index({ ownerId: 1 });
PitchSchema.index({ status: 1 });
PitchSchema.index({ industry: 1, status: 1 });

const Pitch: Model<IPitchDocument> =
  mongoose.models.Pitch || mongoose.model<IPitchDocument>('Pitch', PitchSchema);
export default Pitch;
