import type { Env } from '../env';

export async function sendPaymentThankYouEmail(
  env: Env,
  to: string,
  planLabel: 'monthly' | 'yearly',
): Promise<void> {
  const from = env.RESEND_FROM || 'CookTwo <onboarding@resend.dev>';
  const planText = planLabel === 'yearly' ? 'yearly' : 'monthly';

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#FAF6EE;font-family:Inter,system-ui,-apple-system,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:36px;">
    <h1 style="color:#2C3E2D;font-size:26px;font-weight:700;margin:0 0 4px;">CookTwo</h1>
    <p style="color:#6B7B6C;font-size:14px;margin:0;">One dinner. Two plates. Zero arguments.</p>
  </div>
  <div style="background:#fff;border-radius:16px;padding:40px 32px;border:1px solid #E5E1DA;">
    <h2 style="color:#2C3E2D;font-size:20px;margin:0 0 12px;">Thank you for upgrading to Premium!</h2>
    <p style="color:#6B7B6C;font-size:15px;line-height:1.6;margin:0 0 24px;">
      You're now on the <strong style="color:#2C3E2D;">${planText} Premium</strong> plan.
      Every day you'll get <strong style="color:#2C3E2D;">70 AI requests</strong> — that's 7× the free limit —
      shared between you and your partner. Use them for meal planning, recipe generation,
      personalised nutrition advice, and more.
    </p>
    <p style="color:#6B7B6C;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Welcome aboard, and happy cooking!
    </p>
    <hr style="border:none;border-top:1px solid #E5E1DA;margin:24px 0;" />
    <p style="color:#9DA89E;font-size:12px;line-height:1.5;margin:0;">
      You can manage or cancel your subscription at any time from Settings → Plan inside the app.
      If you have any questions, reply to this email and we'll be happy to help.
    </p>
  </div>
  <p style="color:#6B7B6C;font-size:12px;text-align:center;margin-top:28px;">
    CookTwo — making mealtime work for two
  </p>
</div>
</body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Welcome to CookTwo Premium — Thank You!',
      html,
      tags: [{ name: 'category', value: 'payment-thankyou' }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API ${res.status}: ${text}`);
  }
}
