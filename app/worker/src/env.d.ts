export interface Env {
  HOUSEHOLD_SYNC: DurableObjectNamespace;
  INVITE_STORE: DurableObjectNamespace;
  DB: D1Database;
  DIET_RESEARCH: R2Bucket;
  MEDIA: R2Bucket;
  AI_PROVIDER: string;
  JWT_SECRET: string;
  DEEPSEEK_KEY: string;
  ALIBABA_KEY: string;
  ZAI_KEY: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  RESEND_WEBHOOK_SECRET?: string;
  AI: Ai;
  SITE_URL: string;
  WEBSITE_URL?: string;
  PWA_URL: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_ID_MONTHLY?: string;
  STRIPE_PRICE_ID_YEARLY?: string;
  STRIPE_CUSTOMER_ID?: string;
  // Provider-agnostic contact sync (lib/contact-sync.ts)
  BREVO_API_KEY?: string;
  BREVO_LIST_IDS?: string;   // comma-separated Brevo list ids
  CONTACT_SYNC?: string;     // 'both' (default) | 'resend' | 'brevo'
  // Engagement email engine
  OPENROUTER_API_KEY?: string;
  EMAIL_MODEL?: string;
  ADMIN_SECRET?: string;
}
