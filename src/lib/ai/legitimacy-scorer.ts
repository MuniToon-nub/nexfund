import { connectDB } from '@/lib/db/connect';
import { Pitch } from '@/lib/db/models';
import type { IPitchDocument } from '@/lib/db/models/Pitch.model';

interface LegitimacyResult {
  score: number;
  flags: string[];
}

/**
 * Rule-based legitimacy scorer (modular stub).
 * Swap this with OCR+ML pipeline post-MVP without changing the interface.
 */
export async function scoreLegitimacy(pitch: IPitchDocument): Promise<LegitimacyResult> {
  let score = 0;
  const flags: string[] = [];

  // +20: Trade license uploaded
  if (pitch.documents?.tradeLicenseUrl) {
    score += 20;
  } else {
    flags.push('Missing trade license document');
  }

  // +20: TIN certificate uploaded
  if (pitch.documents?.tinCertificateUrl) {
    score += 20;
  } else {
    flags.push('Missing TIN certificate');
  }

  // +20: Funding ask within reasonable range (BDT 50,000 to 10 Cr)
  if (pitch.fundingAsk >= 50000 && pitch.fundingAsk <= 100000000) {
    score += 20;
  } else {
    flags.push('Funding ask outside typical range');
  }

  // +20: Description is substantive (>200 chars)
  if (pitch.description && pitch.description.length > 200) {
    score += 20;
  } else {
    flags.push('Pitch description too brief — add more detail');
  }

  // +20: No duplicate business name
  await connectDB();
  const duplicateCount = await Pitch.countDocuments({
    businessName: { $regex: new RegExp(`^${escapeRegex(pitch.businessName)}$`, 'i') },
    _id: { $ne: pitch._id },
  });

  if (duplicateCount === 0) {
    score += 20;
  } else {
    flags.push('A pitch with this business name already exists');
  }

  return { score: Math.min(score, 100), flags };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
