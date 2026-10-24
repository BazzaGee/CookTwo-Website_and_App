import type { Context } from 'hono';
import type { Env } from '../env';

/**
 * waitUntil that never throws. The production worker has an ExecutionContext;
 * vitest's `app.request()` does not, and `c.executionCtx` throws there. The
 * work still starts — the runtime just isn't asked to keep the isolate alive
 * for it. Rejections are swallowed so the floating promise can't fail a test.
 */
export function later(c: Context<{ Bindings: Env }>, promise: Promise<unknown>): void {
  try {
    c.executionCtx.waitUntil(promise);
  } catch {
    promise.catch(() => {});
  }
}
