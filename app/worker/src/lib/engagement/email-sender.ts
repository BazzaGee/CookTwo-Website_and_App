// Email sender adapter for CookTwo engagement engine.
// Sends via Resend and logs every send/draft to engagement_emails.
// If RESEND_API_KEY or EMAIL_FROM is missing, saves as a draft (preview mode).

import type { EmailOutput } from './email-writer';

export interface SendResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
  mode: 'live' | 'draft';
}

export interface SenderEnv {
  DB: D1Database;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  PWA_URL?: string;
  SITE_URL?: string;
}

export async function sendEngagementEmail(
  env: SenderEnv,
  userId: string,
  emailType: string,
  emailOutput: EmailOutput,
  contextSnapshot: any,
  unsubToken: string,
): Promise<SendResult> {
  const emailId = crypto.randomUUID();
  const now = Date.now();

  const pwaUrl = env.PWA_URL || 'https://cooktwo.app/PWA';
  const siteUrl = env.SITE_URL || 'https://cooktwo.com';
  const unsubLink = `${siteUrl}/api/engagement/unsubscribe?token=${encodeURIComponent(unsubToken)}`;

  const htmlWithUnsub =
    emailOutput.html_body +
    `<div style="margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center;">` +
    `<p>You're receiving this because you signed up for CookTwo.</p>` +
    `<p><a href="${unsubLink}" style="color:#999;">Unsubscribe</a></p>` +
    `</div>`;

  const textWithUnsub = emailOutput.text_body + `\n\n---\nUnsubscribe: ${unsubLink}`;

  if (env.RESEND_API_KEY && env.RESEND_FROM) {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.RESEND_FROM,
          to: [await getUserEmail(env.DB, userId)],
          subject: emailOutput.subject,
          html: htmlWithUnsub,
          text: textWithUnsub,
          tags: [{ name: 'category', value: `engagement-${emailType}` }],
        }),
      });

      if (resp.ok) {
        const data = (await resp.json()) as { id: string };
        await env.DB.prepare(
          `INSERT INTO engagement_emails (id, user_id, email_type, subject, preview_text, html_body, text_body, status, context_snapshot, provider_message_id, created_at, sent_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'sent', ?, ?, ?, ?)`
        ).bind(
          emailId, userId, emailType,
          emailOutput.subject, emailOutput.preview_text || '',
          htmlWithUnsub, textWithUnsub,
          JSON.stringify(contextSnapshot),
          data.id, now, now,
        ).run();
        return { success: true, providerMessageId: data.id, mode: 'live' };
      }

      const errText = await resp.text();
      console.error(`Resend ${resp.status}: ${errText.slice(0, 300)}`);
    } catch (err: any) {
      console.error(`Resend error: ${err.message}`);
    }
  }

  // Draft / preview mode
  await env.DB.prepare(
    `INSERT INTO engagement_emails (id, user_id, email_type, subject, preview_text, html_body, text_body, status, context_snapshot, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`
  ).bind(
    emailId, userId, emailType,
    emailOutput.subject, emailOutput.preview_text || '',
    htmlWithUnsub, textWithUnsub,
    JSON.stringify(contextSnapshot),
    now,
  ).run();

  return { success: true, mode: 'draft' };
}

async function getUserEmail(db: D1Database, userId: string): Promise<string> {
  const row = await db.prepare('SELECT email FROM engagement_users WHERE id = ?').bind(userId).first<{ email: string }>();
  return row?.email || '';
}
