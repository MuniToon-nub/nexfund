import mongoose, { Schema, Document, Model } from 'mongoose';
import type { MatchStatus, IMatchBreakdown } from '@/types';

export interface IMatchDocument extends Document {
  pitchId: mongoose.Types.ObjectId;
  investorId: mongoose.Types.ObjectId;
  compatibilityScore: number;
  matchBreakdown: IMatchBreakdown;
  status: MatchStatus;
  createdAt: Date;
}

const MatchSchema = new Schema<IMatchDocument>(
  {
    pitchId: { type: Schema.Types.ObjectId, ref: 'Pitch', required: true },
    investorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    compatibilityScore: { type: Number, required: true, min: 0, max: 100 },
    matchBreakdown: {
      industryFit: { type: Number, default: 0 },
      ticketFit: { type: Number, default: 0 },
      riskFit: { type: Number, default: 0 },
      locationFit: { type: Number, default: 0 },
      semanticFit: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['suggested', 'viewed', 'deal_room_opened', 'passed'],
      default: 'suggested',
    },
  },
  { timestamps: true }
);

MatchSchema.index({ pitchId: 1, investorId: 1 }, { unique: true });
MatchSchema.index({ investorId: 1, compatibilityScore: -1 });
MatchSchema.index({ pitchId: 1, compatibilityScore: -1 });

const Match: Model<IMatchDocument> =
  mongoose.models.Match || mongoose.model<IMatchDocument>('Match', MatchSchema);
export default Match;
