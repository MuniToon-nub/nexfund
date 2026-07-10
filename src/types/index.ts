// ============================================================
// NexFund BD — Core Type Definitions
// ============================================================

// ---------- Enums / Literals ----------
export type UserRole = 'sme' | 'investor' | 'admin';
export type KYCStatus = 'pending' | 'verified' | 'flagged' | 'rejected';
export type SubscriptionTier = 'free' | 'premium';
export type PitchStatus = 'draft' | 'pending_review' | 'active' | 'flagged' | 'closed';
export type FundingType = 'equity' | 'debt' | 'revenue-share';
export type RiskAppetite = 'low' | 'medium' | 'high';
export type MatchStatus = 'suggested' | 'viewed' | 'deal_room_opened' | 'passed';
export type DealStatus = 'open' | 'negotiating' | 'closed_won' | 'closed_lost';
export type PaymentMethod = 'bkash' | 'nagad' | 'sslcommerz';
export type OTPPurpose = 'signup' | 'reset';

export const INDUSTRIES = [
  'e-commerce',
  'light-manufacturing',
  'agro-processing-agritech',
  'tech-enabled-services',
  'other',
] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const LOCATIONS = ['Dhaka', 'Chattogram', 'Sylhet', 'Other'] as const;
export type Location = (typeof LOCATIONS)[number];

// ---------- User ----------
export interface IUser {
  _id: string;
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

// ---------- Pitch ----------
export interface IAIExtractedFields {
  industry: string;
  riskIndicators: string[];
  businessModelSummary: string;
}

export interface IPitch {
  _id: string;
  ownerId: string;
  businessName: string;
  industry: Industry;
  description: string;
  fundingAsk: number; // BDT integer
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
  legitimacyScore: number; // 0-100
  legitimacyFlags: string[];
  aiExtractedFields?: IAIExtractedFields;
  status: PitchStatus;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Investor Preference ----------
export interface IInvestorPreference {
  _id: string;
  investorId: string;
  industries: Industry[];
  minTicket: number; // BDT
  maxTicket: number; // BDT
  riskAppetite: RiskAppetite;
  preferredLocations: Location[];
  freeTextPreferences: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Match ----------
export interface IMatchBreakdown {
  industryFit: number;
  ticketFit: number;
  riskFit: number;
  locationFit: number;
  semanticFit: number;
}

export interface IMatch {
  _id: string;
  pitchId: string;
  investorId: string;
  compatibilityScore: number; // 0-100
  matchBreakdown: IMatchBreakdown;
  status: MatchStatus;
  createdAt: Date;
}

// ---------- DealRoom / Message ----------
export interface IMessage {
  _id: string;
  sender: string;
  content: string;
  attachmentUrl?: string;
  timestamp: Date;
}

export interface IDealRoom {
  _id: string;
  matchId: string;
  participants: string[]; // [smeUserId, investorUserId]
  messages: IMessage[];
  dealStatus: DealStatus;
  dealValue?: number; // BDT, if closed_won
  commissionRate: number; // 0.03–0.05
  commissionAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Subscription ----------
export interface ISubscription {
  _id: string;
  userId: string;
  tier: SubscriptionTier;
  amount: number; // BDT
  billingCycle: 'monthly';
  paymentMethod: PaymentMethod;
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

// ---------- OTP ----------
export interface IOTP {
  _id: string;
  email: string;
  codeHash: string;
  expiresAt: Date;
  purpose: OTPPurpose;
  createdAt: Date;
}

// ---------- API Response Helpers ----------
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ---------- JWT Payload ----------
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  tier: SubscriptionTier;
}

// ---------- Tier Limits ----------
export const TIER_LIMITS = {
  free: {
    maxPitches: 1,
    maxMatchesPerMonth: 5,
    maxDealRooms: 1,
    aiSuggestions: false,
    analytics: false,
    fullBreakdown: false,
  },
  premium: {
    maxPitches: 999, // effectively unlimited
    maxMatchesPerMonth: 25,
    maxDealRooms: 5,
    aiSuggestions: true,
    analytics: true,
    fullBreakdown: true,
  },
} as const;
