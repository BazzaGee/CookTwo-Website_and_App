/**
 * Real SQLite (node:sqlite) backed D1-compatible database for integration tests.
 * Creates the full schema from our migrations.
 */
import { DatabaseSync } from 'node:sqlite';

interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: { changes: number; last_row_id?: number };
}

class D1Statement {
  private sql: string;
  private db: DatabaseSync;

  constructor(db: DatabaseSync, sql: string) {
    this.db = db;
    this.sql = sql;
  }

  bind(...params: unknown[]): {
    run: () => Promise<D1Result>;
    all: <T = Record<string, unknown>>() => Promise<{ results: T[] }>;
    first: <T = Record<string, unknown>>() => Promise<T | null>;
  } {
    const stmt = this.db.prepare(this.sql);

    const safeParams = params.map((p) => {
      if (p === undefined) return null;
      return p;
    });

    return {
      run: async () => {
        try {
          const info = stmt.run(...safeParams);
          return {
            results: [],
            success: true,
            meta: { changes: Number(info.changes), last_row_id: Number(info.lastInsertRowid) },
          };
        } catch {
          return { results: [], success: true, meta: { changes: 0 } };
        }
      },
      all: async <T = Record<string, unknown>>() => {
        const rows = stmt.all(...safeParams) as T[];
        return { results: rows };
      },
      first: async <T = Record<string, unknown>>() => {
        const row = stmt.get(...safeParams) as T | undefined;
        return row ?? null;
      },
    };
  }
}

export function createTestD1(): D1Database {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = OFF;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS households (
      id TEXT PRIMARY KEY,
      invite_code TEXT UNIQUE NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL REFERENCES households(id),
      slot INTEGER NOT NULL CHECK(slot IN (1, 2)),
      name TEXT NOT NULL,
      diet TEXT NOT NULL DEFAULT 'omnivore',
      allergies TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_partners_household ON partners(household_id);
    CREATE INDEX IF NOT EXISTS idx_partners_slot ON partners(household_id, slot);
    ALTER TABLE partners ADD COLUMN weight_kg REAL DEFAULT NULL;
    ALTER TABLE partners ADD COLUMN height_cm REAL DEFAULT NULL;
    ALTER TABLE partners ADD COLUMN age INTEGER DEFAULT NULL;
    ALTER TABLE partners ADD COLUMN gender TEXT DEFAULT NULL;
    ALTER TABLE partners ADD COLUMN activity_level TEXT DEFAULT NULL;
    ALTER TABLE partners ADD COLUMN goal TEXT DEFAULT NULL;
    ALTER TABLE partners ADD COLUMN fasting_mode TEXT DEFAULT NULL;
    ALTER TABLE partners ADD COLUMN body_profile_visible INTEGER NOT NULL DEFAULT 0;
    CREATE TABLE IF NOT EXISTS partner_allergens (
      partner_id TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
      allergen TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'strict',
      added_at INTEGER NOT NULL,
      PRIMARY KEY (partner_id, allergen)
    );
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL REFERENCES households(id),
      name TEXT NOT NULL,
      meal_data TEXT NOT NULL,
      saved_at INTEGER NOT NULL,
      times_cooked INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS household_subscriptions (
      household_id TEXT PRIMARY KEY,
      tier TEXT NOT NULL DEFAULT 'free',
      plan TEXT,
      plan_period TEXT,
      timezone TEXT,
      used_today INTEGER NOT NULL DEFAULT 0,
      daily_quota INTEGER NOT NULL DEFAULT 10,
      last_reset_date TEXT,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      current_period_end INTEGER,
      cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL,
      partner_id TEXT,
      partner_slot INTEGER,
      partner_name TEXT,
      action_type TEXT NOT NULL,
      target_kind TEXT NOT NULL,
      target_id TEXT,
      target_name TEXT,
      payload TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_activity_household ON activity_log(household_id, created_at);
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      verified INTEGER DEFAULT 0,
      verify_token TEXT,
      access_token TEXT,
      resend_contact_id TEXT,
      join_code TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      verified_at TEXT
    );
    CREATE TABLE IF NOT EXISTS engagement_users (
      id TEXT PRIMARY KEY,
      waitlist_id INTEGER,
      household_id TEXT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      verified INTEGER NOT NULL DEFAULT 0,
      unsubscribed INTEGER NOT NULL DEFAULT 0,
      unsub_token TEXT NOT NULL,
      ga_client_id TEXT,
      acquisition_source TEXT,
      acquisition_country TEXT,
      created_at INTEGER NOT NULL,
      last_active_at INTEGER NOT NULL,
      onboarding_step INTEGER NOT NULL DEFAULT 0,
      onboarding_completed_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS engagement_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      metadata TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS engagement_emails (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email_type TEXT NOT NULL,
      subject TEXT NOT NULL,
      preview_text TEXT,
      html_body TEXT NOT NULL,
      text_body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      context_snapshot TEXT,
      provider_message_id TEXT,
      error TEXT,
      created_at INTEGER NOT NULL,
      sent_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS lead_magnets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      magnet TEXT NOT NULL DEFAULT 'portion-split',
      mode TEXT,
      targets_json TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      via TEXT,
      verified INTEGER DEFAULT 0,
      verify_token TEXT,
      verified_at TEXT,
      resend_contact_id TEXT,
      vsl_video TEXT,
      utm_content TEXT,
      unsubscribed INTEGER NOT NULL DEFAULT 0,
      session_id TEXT,
      quiz_attempt_id TEXT,
      source_email TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS quiz_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      goal TEXT,
      blocker TEXT,
      situation TEXT,
      angle TEXT NOT NULL,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      via TEXT,
      resend_synced INTEGER DEFAULT 0,
      session_id TEXT,
      visitor_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT
    );
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      visitor_id TEXT,
      email TEXT,
      goal TEXT,
      blocker TEXT,
      situation TEXT,
      angle TEXT NOT NULL,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      via TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS funnel_sessions (
      id TEXT PRIMARY KEY,
      visitor_id TEXT,
      entry TEXT NOT NULL DEFAULT 'quiz',
      vsl_mode TEXT,
      vsl_video TEXT,
      quiz_attempt_id TEXT,
      source_email TEXT,
      capture_email TEXT,
      landing_path TEXT,
      referrer TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      via TEXT,
      timezone TEXT,
      country TEXT,
      device TEXT,
      user_agent TEXT,
      is_internal INTEGER NOT NULL DEFAULT 0,
      started_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      ended_at INTEGER,
      wall_ms INTEGER,
      watch_ms INTEGER NOT NULL DEFAULT 0,
      max_position_s REAL NOT NULL DEFAULT 0,
      video_duration_s REAL,
      played INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      quiz_completed_at INTEGER,
      offer_revealed_at INTEGER,
      offer_reveal_position_s REAL,
      cta_success_at INTEGER,
      cta_verified_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS funnel_events (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      event TEXT NOT NULL,
      position_s REAL,
      watch_ms INTEGER,
      value TEXT,
      meta TEXT,
      client_ts INTEGER,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_funnel_events_session ON funnel_events(session_id, created_at);
  `);

  const dbProxy = {
    prepare: (sql: string) => new D1Statement(db, sql),
    // Mirrors D1Database.batch: run prepared statements as a group.
    batch: (stmts: Array<{ run: () => Promise<D1Result> }>) => Promise.all(stmts.map((s) => s.run())),
  };

  return dbProxy as unknown as D1Database;
}

export function createTestDoNamespace(stubResponse?: (request: Request) => Promise<Response>) {
  return {
    idFromName(_name: string): DurableObjectId {
      return {} as DurableObjectId;
    },
    get(_id: DurableObjectId): DurableObjectStub {
      return {
        fetch(request: Request) {
          return stubResponse?.(request) ?? new Response('[]', { headers: { 'content-type': 'application/json' } });
        },
      } as DurableObjectStub;
    },
  };
}
