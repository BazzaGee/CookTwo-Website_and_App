import { describe, it, expect } from 'vitest';
import { createTestD1, createTestDoNamespace } from './helpers';
import {
  computeUserState,
  decideNextEmail,
  dailyRoll,
  pickTipTopic,
  ONBOARDING_SEQUENCE,
  type EngineEnv,
  type UserState,
} from '../lib/engagement/email-engine';
import { TIP_TOPICS } from '../lib/engagement/email-templates';
import type { ActivityEntry } from '../lib/activity';

const DAY = 86400000;

type Db = D1Database;

function makeEnv(db: Db, doNamespace = createTestDoNamespace()): EngineEnv {
  return { DB: db, HOUSEHOLD_SYNC: doNamespace } as unknown as EngineEnv;
}

async function seedUser(
  db: Db,
  opts: {
    email?: string;
    daysAgo: number;
    householdId?: string | null;
    onboardingStep?: number;
    onboardingCompletedAt?: number | null;
    verified?: number;
    unsubscribed?: number;
  },
): Promise<string> {
  const id = 'eu-' + crypto.randomUUID();
  const created = Date.now() - opts.daysAgo * DAY;
  await db
    .prepare(
      `INSERT INTO engagement_users
        (id, email, verified, unsubscribed, unsub_token, created_at, last_active_at,
         household_id, onboarding_step, onboarding_completed_at)
       VALUES (?, ?, ?, ?, 'tok', ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      opts.email ?? (id + '@test.com'),
      opts.verified ?? 1,
      opts.unsubscribed ?? 0,
      created,
      created,
      opts.householdId ?? null,
      opts.onboardingStep ?? 0,
      opts.onboardingCompletedAt ?? null,
    )
    .run();
  return id;
}

async function seedHousehold(db: Db, daysAgo: number): Promise<string> {
  const id = 'hh-' + crypto.randomUUID();
  await db
    .prepare('INSERT INTO households (id, invite_code, created_at) VALUES (?, ?, ?)')
    .bind(id, 'ic-' + id, Date.now() - daysAgo * DAY)
    .run();
  return id;
}

async function seedPartner(
  db: Db,
  householdId: string,
  slot: number,
  goal: string | null,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO partners (id, household_id, slot, name, diet, allergies, goal, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'omnivore', '', ?, ?, ?)`,
    )
    .bind('pa-' + crypto.randomUUID(), householdId, slot, 'P' + slot, goal, Date.now(), Date.now())
    .run();
}

async function seedActivity(
  db: Db,
  householdId: string,
  actionType: string,
  createdAt: number,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO activity_log (id, household_id, action_type, target_kind, created_at)
       VALUES (?, ?, ?, 'pantry_item', ?)`,
    )
    .bind('al-' + crypto.randomUUID(), householdId, actionType, createdAt)
    .run();
}

async function markSent(
  db: Db,
  userId: string,
  emailType: string,
  createdAt: number,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO engagement_emails (id, user_id, email_type, subject, html_body, text_body, status, created_at)
       VALUES (?, ?, ?, 's', '<p></p>', 't', 'sent', ?)`,
    )
    .bind('em-' + crypto.randomUUID(), userId, emailType, createdAt)
    .run();
}

async function getOnboardingCompletedAt(db: Db, userId: string): Promise<number | null> {
  const row = await db
    .prepare('SELECT onboarding_completed_at FROM engagement_users WHERE id = ?')
    .bind(userId)
    .first<{ onboarding_completed_at: number | null }>();
  return row?.onboarding_completed_at ?? null;
}

async function getState(env: EngineEnv, db: Db, userId: string): Promise<UserState> {
  const state = await computeUserState(env, userId, db);
  expect(state).not.toBeNull();
  return state!;
}

function doNamespaceWith(entries: Partial<ActivityEntry>[]) {
  return createTestDoNamespace(async () =>
    Response.json(
      entries.map((e, i) => ({
        id: 'do-' + i,
        householdId: 'hh',
        partnerId: null,
        partnerSlot: null,
        partnerName: null,
        actionType: 'item_added',
        targetKind: 'grocery_item',
        targetId: null,
        targetName: null,
        payload: null,
        createdAt: Date.now(),
        ...e,
      })),
      { headers: { 'content-type': 'application/json' } },
    ),
  );
}

describe('Onboarding email sequence — decision engine', () => {
  it('fresh verified user with no sent emails gets the welcome email', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedUser(db, { daysAgo: 1 });
    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db);
    expect(decision?.type).toBe('welcome');
  });

  it('unverified or unsubscribed users never get email', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const u1 = await seedUser(db, { daysAgo: 1, verified: 0 });
    expect((await decideNextEmail(await getState(env, db, u1), db))?.type ?? null).toBeNull();
    const u2 = await seedUser(db, { daysAgo: 1, unsubscribed: 1 });
    expect((await decideNextEmail(await getState(env, db, u2), db))?.type ?? null).toBeNull();
  });

  it('onboarding suppresses lifecycle emails while the series is active', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    // Power-user signals that would normally trigger premium_pitch.
    const hh = await seedHousehold(db, 6);
    await seedPartner(db, hh, 1, 'lose');
    await seedUser(db, { daysAgo: 6, householdId: hh });
    for (let i = 0; i < 12; i++) {
      await seedActivity(db, hh, 'meal_generated', Date.now() - i * DAY);
    }
    const userId = await seedUser(db, { daysAgo: 6, householdId: hh });
    await markSent(db, userId, 'welcome', Date.now() - 4 * DAY);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db);

    expect(state.totalMeals).toBeGreaterThanOrEqual(10);
    expect(state.planLabel).toBeNull();
    expect(decision?.type).toBe('onboarding_partner');
    expect(decision?.type).not.toBe('premium_pitch');
  });

  it('waits 3 days between onboarding emails', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedUser(db, { daysAgo: 8 });
    await markSent(db, userId, 'welcome', Date.now() - 2 * DAY);

    const state = await getState(env, db, userId);
    expect(await decideNextEmail(state, db)).toBeNull();

    // Re-seed with a welcome sent 4 days ago.
    const db2 = createTestD1();
    const env2 = makeEnv(db2);
    const userId2 = await seedUser(db2, { daysAgo: 8 });
    await markSent(db2, userId2, 'welcome', Date.now() - 4 * DAY);
    const state2 = await getState(env2, db2, userId2);
    const decision = await decideNextEmail(state2, db2);
    expect(decision?.type).toBe('onboarding_partner');
  });

  it('skips steps the user has already completed and persists the pointer', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const hh = await seedHousehold(db, 10);
    await seedPartner(db, hh, 1, 'lose');
    await seedPartner(db, hh, 2, 'maintain');
    // Partner + grocery + pantry (post-setup) + AI meal all done…
    await seedActivity(db, hh, 'item_added', Date.now() - 9 * DAY);
    await seedActivity(db, hh, 'pantry_added', Date.now() - 8 * DAY);
    await seedActivity(db, hh, 'meal_generated', Date.now() - 7 * DAY);

    const userId = await seedUser(db, { daysAgo: 10, householdId: hh });
    await markSent(db, userId, 'welcome', Date.now() - 10 * DAY);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db);

    expect(decision?.type).toBe('onboarding_two_plates');

    const row = await db
      .prepare('SELECT onboarding_step FROM engagement_users WHERE id = ?')
      .bind(userId)
      .first<{ onboarding_step: number }>();
    expect(row?.onboarding_step).toBe(5); // pointer sits on two_plates (index 5 = step 6)
  });

  it('wizard-seeded pantry activity does not count as pantry usage', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const hh = await seedHousehold(db, 5); // setup grace = creation + 1h
    await seedPartner(db, hh, 1, 'lose');
    await seedPartner(db, hh, 2, 'gain');
    await seedActivity(db, hh, 'item_added', Date.now() - 4 * DAY);
    // Pantry adds within the setup grace window (wizard seed) — must be ignored.
    await seedActivity(db, hh, 'pantry_added', Date.now() - 5 * DAY + 30 * 1000);

    const userId = await seedUser(db, { daysAgo: 5, householdId: hh });
    await markSent(db, userId, 'welcome', Date.now() - 5 * DAY);

    const state = await getState(env, db, userId);
    expect(state.pantryAddedPostSetup).toBe(0);
    const decision = await decideNextEmail(state, db);
    expect(decision?.type).toBe('onboarding_pantry');
  });

  it('graduates when the whole sequence is done', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const hh = await seedHousehold(db, 30);
    await seedPartner(db, hh, 1, 'lose');
    await seedPartner(db, hh, 2, 'maintain');
    await seedActivity(db, hh, 'item_added', Date.now() - 20 * DAY);
    await seedActivity(db, hh, 'pantry_added', Date.now() - 19 * DAY);
    await seedActivity(db, hh, 'meal_generated', Date.now() - 18 * DAY);
    await seedActivity(db, hh, 'meal_confirmed', Date.now() - 17 * DAY);
    await seedActivity(db, hh, 'recipe_saved', Date.now() - 17 * DAY);

    const userId = await seedUser(db, {
      daysAgo: 30,
      householdId: hh,
      onboardingStep: ONBOARDING_SEQUENCE.length, // everything sent
    });
    await markSent(db, userId, 'welcome', Date.now() - 30 * DAY);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db);

    expect(decision).toBeNull();
    expect(await getOnboardingCompletedAt(db, userId)).not.toBeNull();
  });

  it('graduates early when the core loop is completed on their own', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const hh = await seedHousehold(db, 2);
    await seedPartner(db, hh, 1, 'lose');
    await seedActivity(db, hh, 'meal_generated', Date.now() - DAY);
    await seedActivity(db, hh, 'meal_confirmed', Date.now() - DAY);
    await seedActivity(db, hh, 'recipe_saved', Date.now() - DAY);

    const userId = await seedUser(db, { daysAgo: 2, householdId: hh });
    await markSent(db, userId, 'welcome', Date.now() - 2 * DAY);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db);

    expect(decision).toBeNull();
    expect(await getOnboardingCompletedAt(db, userId)).not.toBeNull();
  });

  it('window expiry graduates the user, then lifecycle emails resume', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedUser(db, { daysAgo: 40 });
    await markSent(db, userId, 'welcome', Date.now() - 40 * DAY);

    // First cycle after the window expires: graduation happens, nothing sends.
    const state = await getState(env, db, userId);
    expect(await decideNextEmail(state, db)).toBeNull();
    expect(await getOnboardingCompletedAt(db, userId)).not.toBeNull();

    // Next cycle: lifecycle tier is active. Roll fails feedback but passes tip.
    const state2 = await getState(env, db, userId);
    const roll = (key: string) => (key.includes(':feedback:') ? 99 : 0);
    const decision = await decideNextEmail(state2, db, Date.now(), roll);
    expect(decision?.type).toBe('app_tip');
  });

  it('lifecycle tier after graduation: streak email for active cookers', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const hh = await seedHousehold(db, 30);
    await seedPartner(db, hh, 1, 'lose');
    await seedPartner(db, hh, 2, 'maintain');
    const userId = await seedUser(db, {
      daysAgo: 30,
      householdId: hh,
      onboardingCompletedAt: Date.now() - 5 * DAY,
    });
    await markSent(db, userId, 'welcome', Date.now() - 30 * DAY);
    for (let i = 0; i < 4; i++) {
      await seedActivity(db, hh, 'meal_generated', Date.now() - i * DAY);
    }

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db);
    expect(decision?.type).toBe('meal_streak');
  });

  it('merges HouseholdSync DO activity into the usage state', async () => {
    const db = createTestD1();
    const env = makeEnv(db, doNamespaceWith([
      { actionType: 'item_added', createdAt: Date.now() - DAY },
      { actionType: 'item_added', createdAt: Date.now() - 2 * DAY },
      { actionType: 'pantry_added', createdAt: Date.now() - DAY },
    ]));
    const hh = await seedHousehold(db, 6);
    await seedPartner(db, hh, 1, 'lose');
    await seedPartner(db, hh, 2, 'maintain');
    const userId = await seedUser(db, { daysAgo: 6, householdId: hh });
    await markSent(db, userId, 'welcome', Date.now() - 6 * DAY);

    const state = await getState(env, db, userId);
    expect(state.groceryAdded).toBe(2);
    expect(state.pantryAddedPostSetup).toBe(1);

    const decision = await decideNextEmail(state, db);
    expect(decision?.type).toBe('onboarding_ai_meals');
  });

  it('sends at most one email per day', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedUser(db, { daysAgo: 3 });
    await markSent(db, userId, 'welcome', Date.now() - 6 * 60 * 60 * 1000);

    const state = await getState(env, db, userId);
    expect(await decideNextEmail(state, db)).toBeNull();
  });

  it('users with the legacy app_onboarding email continue the series instead of stalling', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedUser(db, { daysAgo: 10 });
    await markSent(db, userId, 'app_onboarding', Date.now() - 6 * DAY);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db);

    expect(decision?.type).toBe('onboarding_partner');
    expect(state.sentOnboardingTypes).toContain('app_onboarding');
  });

  it('sequence definition sanity: welcome first, unique types, correct order', () => {
    const types = ONBOARDING_SEQUENCE.map((s) => s.type);
    expect(types[0]).toBe('welcome');
    expect(new Set(types).size).toBe(types.length);
    expect(types).toEqual([
      'welcome',
      'onboarding_partner',
      'onboarding_shopping_list',
      'onboarding_pantry',
      'onboarding_ai_meals',
      'onboarding_two_plates',
      'onboarding_habit_loop',
    ]);
  });
});

describe('Randomized lifecycle pacing — tips & feedback', () => {
  // Roll helper: passes (0) or fails (99) selectively per email kind.
  const rollFor = (tip: number, feedback: number) => (key: string) =>
    key.includes(':feedback:') ? feedback : tip;
  const allPass = rollFor(0, 0);

  async function seedGraduatedUser(db: ReturnType<typeof createTestD1>, daysAgo: number) {
    const hh = await seedHousehold(db, daysAgo);
    // Two partners so partner_invite never pre-empts tip/feedback rules.
    await seedPartner(db, hh, 1, 'lose');
    await seedPartner(db, hh, 2, 'maintain');
    const userId = await seedUser(db, {
      daysAgo,
      householdId: hh,
      onboardingCompletedAt: Date.now() - (daysAgo - 5) * DAY,
    });
    await markSent(db, userId, 'welcome', Date.now() - daysAgo * DAY);
    return userId;
  }

  it('tip respects the 2-day minimum gap even when the roll passes', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedGraduatedUser(db, 30);
    await markSent(db, userId, 'app_tip', Date.now() - 1 * DAY);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db, Date.now(), rollFor(0, 99));
    expect(decision).toBeNull();
  });

  it('tip sends when the gap is met and the roll passes', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedGraduatedUser(db, 30);
    await markSent(db, userId, 'app_tip', Date.now() - 3 * DAY);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db, Date.now(), rollFor(0, 99));
    expect(decision?.type).toBe('app_tip');
    expect(decision?.variant).toBeTruthy();
  });

  it('tip chance is lower for users active today', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const hh = await seedHousehold(db, 30);
    await seedPartner(db, hh, 1, 'lose');
    await seedPartner(db, hh, 2, 'maintain');
    const userId = await seedUser(db, {
      daysAgo: 30, householdId: hh, onboardingCompletedAt: Date.now() - 20 * DAY,
    });
    await markSent(db, userId, 'welcome', Date.now() - 30 * DAY);
    await markSent(db, userId, 'app_tip', Date.now() - 3 * DAY);
    await seedActivity(db, hh, 'item_added', Date.now() - 60 * 60 * 1000); // active 1h ago

    const state = await getState(env, db, userId);
    expect(state.daysSinceLastActive).toBeLessThanOrEqual(1);
    // roll 20 < base 30 but >= active 15 → must NOT send
    const decision = await decideNextEmail(state, db, Date.now(), rollFor(20, 99));
    expect(decision).toBeNull();
  });

  it('tip chance is higher for quiet users', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const hh = await seedHousehold(db, 30);
    await seedPartner(db, hh, 1, 'lose');
    await seedPartner(db, hh, 2, 'maintain');
    const userId = await seedUser(db, {
      daysAgo: 30, householdId: hh, onboardingCompletedAt: Date.now() - 20 * DAY,
    });
    await markSent(db, userId, 'welcome', Date.now() - 30 * DAY);
    await markSent(db, userId, 'app_tip', Date.now() - 3 * DAY);
    await seedActivity(db, hh, 'item_added', Date.now() - 5 * DAY); // inactive 5 days (< 7, no nudge)

    const state = await getState(env, db, userId);
    expect(state.daysSinceLastActive).toBe(5);
    // roll 40 >= base 30 but < quiet 45 → must send
    const decision = await decideNextEmail(state, db, Date.now(), rollFor(40, 99));
    expect(decision?.type).toBe('app_tip');
  });

  it('tip roll failing means no tip that day', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedGraduatedUser(db, 30);
    await markSent(db, userId, 'app_tip', Date.now() - 5 * DAY);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db, Date.now(), rollFor(99, 99));
    expect(decision).toBeNull();
  });

  it('tip topic is deterministic per user-week and comes from the pool', async () => {
    const now = Date.now();
    const t1 = pickTipTopic('user-x', now);
    const t1again = pickTipTopic('user-x', now);
    expect(t1.key).toBe(t1again.key);
    expect(TIP_TOPICS.map((t) => t.key)).toContain(t1.key);
    // Different user or different week is valid pool member too
    const t2 = pickTipTopic('user-y', now + 8 * DAY);
    expect(TIP_TOPICS.map((t) => t.key)).toContain(t2.key);
  });

  it('feedback fires for eligible graduated users when the roll passes', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedGraduatedUser(db, 25);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db, Date.now(), allPass);
    expect(decision?.type).toBe('feedback_request');
    expect(decision?.contextNote).toContain('early development');
    expect(decision?.contextNote).toContain('cooktwo.com/contact');
  });

  it('feedback does not fire before 21 days since signup', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedGraduatedUser(db, 15);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db, Date.now(), allPass);
    expect(decision?.type).toBe('app_tip'); // falls through to tips
  });

  it('feedback respects the 30-day gap after a previous ask', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedGraduatedUser(db, 60);
    await markSent(db, userId, 'feedback_request', Date.now() - 10 * DAY);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db, Date.now(), allPass);
    expect(decision?.type).toBe('app_tip');

    // 35 days later, eligible again.
    const db2 = createTestD1();
    const env2 = makeEnv(db2);
    const userId2 = await seedGraduatedUser(db2, 60);
    await markSent(db2, userId2, 'feedback_request', Date.now() - 35 * DAY);
    const state2 = await getState(env2, db2, userId2);
    const decision2 = await decideNextEmail(state2, db2, Date.now(), allPass);
    expect(decision2?.type).toBe('feedback_request');
  });

  it('feedback outranks tips when both are due', async () => {
    const db = createTestD1();
    const env = makeEnv(db);
    const userId = await seedGraduatedUser(db, 30);
    await markSent(db, userId, 'app_tip', Date.now() - 5 * DAY);

    const state = await getState(env, db, userId);
    const decision = await decideNextEmail(state, db, Date.now(), allPass);
    expect(decision?.type).toBe('feedback_request');
  });

  it('dailyRoll is deterministic and bounded', () => {
    for (let i = 0; i < 50; i++) {
      const key = `key-${i}`;
      expect(dailyRoll(key)).toBe(dailyRoll(key));
      const v = dailyRoll(key);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(100);
    }
    // Distinct keys spread across the range (sanity, not a strict uniformity test)
    const values = new Set(Array.from({ length: 30 }, (_, i) => dailyRoll(`spread-${i}`)));
    expect(values.size).toBeGreaterThan(10);
  });
});
