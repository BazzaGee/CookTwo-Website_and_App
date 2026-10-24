/**
 * First-party funnel tracker.
 *
 * One visitor UUID (localStorage, 1 year) + one session UUID (sessionStorage)
 * join the quiz page, the VSL page, the CTA capture and the email verify
 * click. Events queue locally and flush as a JSON batch to POST
 * /api/funnel/track — fetch with keepalive while the page lives,
 * navigator.sendBeacon on pagehide.
 *
 * IDs are generated client-side so a quiz submit and a VSL heartbeat can both
 * bootstrap the same session row; the server never blocks on tracking (the
 * quiz submit itself carries its own ids), so a failed flush only costs
 * telemetry, never the funnel.
 */

export interface TrackProps {
  position_s?: number | null;
  watch_ms?: number | null;
  value?: string | null;
  meta?: Record<string, unknown> | null;
}

interface QueuedEvent extends TrackProps {
  id: string;
  name: string;
  client_ts: number;
}

interface SessionContext {
  entry: 'quiz' | 'vsl';
  vsl_mode?: 'couples' | 'solo' | null;
  vsl_video?: string | null;
  quiz_attempt_id?: string | null;
}

const ENDPOINT = '/api/funnel/track';
const VID_KEY = 'ct_vid';
const SID_KEY = 'ct_sid';
const QID_KEY = 'ct_q';
const SOURCE_KEY = 'ct_source_email';
const FLUSH_MS = 10000;
const FLUSH_AT = 10;

const queue: QueuedEvent[] = [];
let context: SessionContext | null = null;
let captureEmail: string | null = null;
let flushTimer: number | null = null;
let listenersBound = false;
let sessionStart = 0;

function uuid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
      const r = (Math.random() * 16) | 0;
      return (ch === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}

export function visitorId(): string {
  try {
    let v = localStorage.getItem(VID_KEY);
    if (!v) {
      v = uuid();
      localStorage.setItem(VID_KEY, v);
    }
    return v;
  } catch {
    return uuid();
  }
}

export function sessionId(): string {
  try {
    let v = sessionStorage.getItem(SID_KEY);
    if (!v) {
      v = uuid();
      sessionStorage.setItem(SID_KEY, v);
    }
    return v;
  } catch {
    return uuid();
  }
}

/** Adopt the server-issued session (quiz submit) or ?fs= from the redirect. */
export function adoptSessionId(id: string): void {
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(id)) return;
  try {
    sessionStorage.setItem(SID_KEY, id);
  } catch {
    /* storage blocked — the in-page flow still works */
  }
}

export function setQuizAttemptId(id: string | null): void {
  try {
    if (id) sessionStorage.setItem(QID_KEY, id);
    else sessionStorage.removeItem(QID_KEY);
  } catch {
    /* ignore */
  }
}

export function quizAttemptId(): string | null {
  try {
    return sessionStorage.getItem(QID_KEY);
  } catch {
    return null;
  }
}

/** Campaign recipient from ?e= — survives the quiz→VSL hop. */
export function setSourceEmail(email: string | null): void {
  try {
    if (email) sessionStorage.setItem(SOURCE_KEY, email);
    else sessionStorage.removeItem(SOURCE_KEY);
  } catch {
    /* ignore */
  }
}

export function sourceEmail(): string | null {
  try {
    return sessionStorage.getItem(SOURCE_KEY);
  } catch {
    return null;
  }
}

/** Typed into the VSL capture box; attached to the next flushes. */
export function setCaptureEmail(email: string | null): void {
  captureEmail = email;
}

export interface Attribution {
  utm: Record<string, string>;
  sourceEmail: string | null;
  quizAttemptId: string | null;
}

/**
 * Read ?e= / ?fs= / ?q= / UTM params once, persist them for the session, and
 * (optionally) strip the identity params from the address bar so a
 * screenshot or a share link never carries someone's email.
 */
export function readAttribution(opts: { strip?: boolean } = {}): Attribution {
  const utm: Record<string, string> = {};
  let e: string | null = null;
  let fs: string | null = null;
  let q: string | null = null;
  try {
    const p = new URLSearchParams(window.location.search);
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'via']) {
      const v = p.get(k);
      if (v) utm[k] = v.slice(0, 200);
    }
    e = (p.get('e') || '').trim().toLowerCase().slice(0, 320) || null;
    fs = (p.get('fs') || '').trim() || null;
    q = (p.get('q') || '').trim() || null;
  } catch {
    /* no location — fine */
  }
  if (e) setSourceEmail(e);
  if (fs) adoptSessionId(fs);
  if (q) setQuizAttemptId(q);
  if (opts.strip && (e || fs || q)) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('e');
      url.searchParams.delete('fs');
      url.searchParams.delete('q');
      window.history.replaceState(null, '', url.toString());
    } catch {
      /* ignore */
    }
  }
  return { utm, sourceEmail: e, quizAttemptId: q };
}

export function isInternal(): boolean {
  try {
    return (
      new URLSearchParams(window.location.search).get('internal') === '1' ||
      document.cookie.indexOf('ga_internal=1') !== -1
    );
  } catch {
    return false;
  }
}

function bindUnloadListeners(): void {
  if (listenersBound) return;
  listenersBound = true;
  let exitTracked = false;
  const exit = () => {
    // The event latches (one exit per session) but flushing may happen on
    // every tab-hide — the video keeps playing in the background.
    if (!exitTracked && sessionStart) {
      exitTracked = true;
      track('page_exit', { meta: { wall_ms: Date.now() - sessionStart } });
    }
    flush(true);
  };
  window.addEventListener('pagehide', exit);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') exit();
  });
}

function payload(): Record<string, unknown> {
  const q = quizAttemptId();
  const body: Record<string, unknown> = {
    session_id: sessionId(),
    visitor_id: visitorId(),
    landing_path: window.location.pathname,
    referrer: document.referrer || null,
    timezone: null,
    user_agent: navigator.userAgent,
    internal: isInternal(),
    source_email: sourceEmail(),
    events: queue,
  };
  try {
    body.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    /* ignore */
  }
  if (captureEmail) body.capture_email = captureEmail;
  if (context) {
    body.entry = context.entry;
    if (context.vsl_mode) body.vsl_mode = context.vsl_mode;
    if (context.vsl_video) body.vsl_video = context.vsl_video;
    if (context.quiz_attempt_id || q) body.quiz_attempt_id = context.quiz_attempt_id || q;
  }
  return body;
}

function attachUtm(body: Record<string, unknown>): void {
  try {
    const p = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'via']) {
      const v = p.get(k);
      if (v) utm[k] = v.slice(0, 200);
    }
    if (Object.keys(utm).length) body.utm = utm;
  } catch {
    /* ignore */
  }
}

export function flush(useBeacon = false): void {
  if (queue.length === 0) return;
  const events = queue.splice(0, queue.length);
  const body = payload();
  body.events = events;
  attachUtm(body);
  const json = JSON.stringify(body);

  if (useBeacon && 'sendBeacon' in navigator) {
    const ok = navigator.sendBeacon(ENDPOINT, new Blob([json], { type: 'application/json' }));
    if (!ok) queue.unshift(...(events as QueuedEvent[]));
    return;
  }
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: json,
    keepalive: true,
  }).catch(() => {
    // Best-effort: put the batch back if the page is still around.
    queue.unshift(...(events as QueuedEvent[]));
  });
}

function scheduleFlush(): void {
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    flush();
  }, FLUSH_MS);
}

export function track(name: string, props: TrackProps = {}): void {
  queue.push({
    id: uuid(),
    name,
    client_ts: Date.now(),
    position_s: typeof props.position_s === 'number' ? Math.round(props.position_s * 100) / 100 : null,
    watch_ms: typeof props.watch_ms === 'number' ? Math.round(props.watch_ms) : null,
    value: props.value || null,
    meta: props.meta || null,
  });
  if (queue.length >= FLUSH_AT) {
    flush();
    return;
  }
  scheduleFlush();
}

/** Open a session on this page and fire session_start. */
export function startSession(opts: SessionContext): void {
  context = opts;
  sessionStart = Date.now();
  bindUnloadListeners();
  track('session_start', {
    value: opts.vsl_video || opts.entry,
  });
}
