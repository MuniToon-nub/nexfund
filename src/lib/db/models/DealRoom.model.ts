import mongoose, { Schema, Document, Model } from 'mongoose';
import type { DealStatus } from '@/types';

export interface IMessageSubdoc {
  sender: mongoose.Types.ObjectId;
  content: string;
  attachmentUrl?: string;
  timestamp: Date;
}

export interface IDealRoomDocument extends Document {
  matchId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  messages: IMessageSubdoc[];
  dealStatus: DealStatus;
  dealValue?: number;
  commissionRate: number;
  commissionAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageSubdoc>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    attachmentUrl: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const DealRoomSchema = new Schema<IDealRoomDocument>(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true, unique: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [MessageSchema],
    dealStatus: {
      type: String,
      enum: ['open', 'negotiating', 'closed_won', 'closed_lost'],
      default: 'open',
    },
    dealValue: { type: Number },
    commissionRate: { type: Number, default: 0.03, min: 0, max: 1 },
    commissionAmount: { type: Number },
  },
  { timestamps: true }
);

DealRoomSchema.index({ participants: 1 });
DealRoomSchema.index({ matchId: 1 });

const DealRoom: Model<IDealRoomDocument> =
  mongoose.models.DealRoom || mongoose.model<IDealRoomDocument>('DealRoom', DealRoomSchema);
export default DealRoom;
