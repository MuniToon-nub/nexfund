import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');
  }
  return _resend;
}
const FROM_EMAIL = process.env.EMAIL_FROM || 'NexFund BD <noreply@nexfundbd.com>';

export async function sendOTPEmail(to: string, code: string, purpose: 'signup' | 'reset') {
  const subject = purpose === 'signup'
    ? 'Verify your NexFund BD account'
    : 'Reset your NexFund BD password';

  const body = purpose === 'signup'
    ? `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <div style="background: linear-gradient(135deg, #0F1D33, #1B2A4A); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #10B981; margin: 0; font-size: 24px;">NexFund BD</h1>
        </div>
        <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1B2A4A; margin-top: 0;">Verify your email</h2>
          <p style="color: #4B5563;">Enter this verification code to complete your signup:</p>
          <div style="background: #F3F4F6; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1B2A4A;">${code}</span>
          </div>
          <p style="color: #9CA3AF; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `
    : `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <div style="background: linear-gradient(135deg, #0F1D33, #1B2A4A); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #10B981; margin: 0; font-size: 24px;">NexFund BD</h1>
        </div>
        <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1B2A4A; margin-top: 0;">Reset your password</h2>
          <p style="color: #4B5563;">Use this code to reset your password:</p>
          <div style="background: #F3F4F6; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1B2A4A;">${code}</span>
          </div>
          <p style="color: #9CA3AF; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: body,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    // In development, log the OTP to console as fallback
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] OTP for ${to}: ${code}`);
    }
    return false;
  }
}

export async function sendMatchNotification(to: string, matchCount: number) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `You have ${matchCount} new match${matchCount > 1 ? 'es' : ''} on NexFund BD`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="background: linear-gradient(135deg, #0F1D33, #1B2A4A); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #10B981; margin: 0; font-size: 24px;">NexFund BD</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1B2A4A; margin-top: 0;">New Matches!</h2>
            <p style="color: #4B5563;">You have <strong>${matchCount}</strong> new AI-matched investor${matchCount > 1 ? 's' : ''} for your pitch.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/matches" 
               style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
              View Matches
            </a>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send match notification:', error);
    return false;
  }
}
