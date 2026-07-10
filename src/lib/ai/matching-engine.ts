import { connectDB } from '@/lib/db/connect';
import { Pitch, InvestorPreference, Match } from '@/lib/db/models';
import type { IPitchDocument } from '@/lib/db/models/Pitch.model';
import type { IInvestorPreferenceDocument } from '@/lib/db/models/InvestorPreference.model';
import type { IMatchBreakdown } from '@/types';

/**
 * Compute compatibility score between one pitch and one investor's preferences.
 * Rule-based scoring (Phase 1).
 * LLM semantic scoring can be layered on top in Phase 2.
 */
function computeScore(
  pitch: IPitchDocument,
  prefs: IInvestorPreferenceDocument
): { score: number; breakdown: IMatchBreakdown } {
  const breakdown: IMatchBreakdown = {
    industryFit: 0,
    ticketFit: 0,
    riskFit: 0,
    locationFit: 0,
    semanticFit: 0,
  };

  // Industry fit (0 or 30)
  if (prefs.industries.includes(pitch.industry)) {
    breakdown.industryFit = 30;
  }

  // Ticket fit (0 or 25)
  if (pitch.fundingAsk >= prefs.minTicket && pitch.fundingAsk <= prefs.maxTicket) {
    breakdown.ticketFit = 25;
  } else {
    // Partial credit if within 2x range
    const midTicket = (prefs.minTicket + prefs.maxTicket) / 2;
    const ratio = Math.abs(pitch.fundingAsk - midTicket) / midTicket;
    if (ratio < 1) {
      breakdown.ticketFit = Math.round(25 * (1 - ratio) * 0.5);
    }
  }

  // Risk fit (0 or 20) — map legitimacy score to risk bucket
  const riskMap: Record<string, [number, number]> = {
    low: [75, 100],
    medium: [40, 100],
    high: [0, 100],
  };
  const [minScore] = riskMap[prefs.riskAppetite] || [0, 100];
  if (pitch.legitimacyScore >= minScore) {
    breakdown.riskFit = 20;
  } else {
    // Partial credit
    breakdown.riskFit = Math.round(20 * (pitch.legitimacyScore / minScore) * 0.5);
  }

  // Location fit (0 or 10)
  if (prefs.preferredLocations.includes(pitch.location)) {
    breakdown.locationFit = 10;
  }

  // Semantic fit — placeholder for LLM scoring (0–15)
  // TODO: Call Gemini to compare freeTextPreferences vs pitch description
  breakdown.semanticFit = 0;

  const score = Math.min(
    breakdown.industryFit + breakdown.ticketFit + breakdown.riskFit + breakdown.locationFit + breakdown.semanticFit,
    100
  );

  return { score, breakdown };
}

/**
 * Recompute matches for a single pitch against all investors.
 */
export async function recomputeMatchesForPitch(pitchId: string): Promise<number> {
  await connectDB();

  const pitch = await Pitch.findById(pitchId);
  if (!pitch || pitch.status !== 'active') return 0;

  const preferences = await InvestorPreference.find({});
  let matchCount = 0;

  for (const prefs of preferences) {
    const { score, breakdown } = computeScore(pitch, prefs);

    // Only create match if score > 10
    if (score > 10) {
      await Match.findOneAndUpdate(
        { pitchId: pitch._id, investorId: prefs.investorId },
        {
          compatibilityScore: score,
          matchBreakdown: breakdown,
          $setOnInsert: { status: 'suggested' },
        },
        { upsert: true, new: true }
      );
      matchCount++;
    }
  }

  return matchCount;
}

/**
 * Recompute matches for all active pitches.
 */
export async function recomputeAllMatches(): Promise<{ pitchCount: number; totalMatches: number }> {
  await connectDB();

  const activePitches = await Pitch.find({ status: 'active' });
  let totalMatches = 0;

  for (const pitch of activePitches) {
    totalMatches += await recomputeMatchesForPitch(pitch._id.toString());
  }

  return { pitchCount: activePitches.length, totalMatches };
}
