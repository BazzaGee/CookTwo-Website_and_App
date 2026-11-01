import type { Context } from 'hono';
import type { Env } from '../env';

/**
 * VSL streaming — serves the finale, app-offer and factor videos out of R2.
 *
 * GET/HEAD /api/vsl/:slug
 *   couples-finale     -> vsl/vsl-couples-finale-1080p.mp4
 *   solo-finale        -> vsl/vsl-solo-finale-1080p.mp4
 *   app-offer          -> vsl/vsl-09-app-offer-1080p.mp4
 *   cardiac-low-sodium -> vsl/vsl-17-cardiac-low-sodium-1080p.mp4
 *
 * Single-range support so the browser can seek and resume. Invalid or
 * multi-range headers are ignored and the full body is served — RFC 7233.
 */

const VIDEOS: Record<string, string> = {
  'couples-finale': 'vsl/vsl-couples-finale-1080p.mp4',
  'solo-finale': 'vsl/vsl-solo-finale-1080p.mp4',
  'app-offer': 'vsl/vsl-09-app-offer-1080p.mp4',
  'cardiac-low-sodium': 'vsl/vsl-17-cardiac-low-sodium-1080p.mp4',
  weight: 'vsl/vsl-10-weight-management-1080p.mp4',
  'time-poor': 'vsl/vsl-11-time-poor-1080p.mp4',
  'family-picky': 'vsl/vsl-12-family-picky-1080p.mp4',
  'gluten-free': 'vsl/vsl-13-gluten-free-1080p.mp4',
  'weight-solo': 'vsl/vsl-18-weight-management-solo-1080p.mp4',
  'time-poor-solo': 'vsl/vsl-19-time-poor-solo-1080p.mp4',
  'family-picky-solo': 'vsl/vsl-20-family-picky-solo-1080p.mp4',
  'gluten-free-solo': 'vsl/vsl-21-gluten-free-solo-1080p.mp4',
  'plant-based-solo': 'vsl/vsl-22-plant-based-split-solo-1080p.mp4',
  'keto-solo': 'vsl/vsl-23-keto-low-carb-solo-1080p.mp4',
  'multi-solo': 'vsl/vsl-24-multi-restriction-solo-1080p.mp4',
  'cardiac-solo': 'vsl/vsl-25-cardiac-low-sodium-solo-1080p.mp4',
  'app-solo': 'vsl/vsl-26-app-offer-solo-1080p.mp4',
  'plant-based': 'vsl/vsl-14-plant-based-split-1080p.mp4',
  keto: 'vsl/vsl-15-keto-low-carb-1080p.mp4',
  multi: 'vsl/vsl-16-multi-restriction-1080p.mp4',
};

function parseRangeHeader(header: string, size: number): R2Range | null {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m) return null;
  const rawStart = m[1] ?? '';
  const rawEnd = m[2] ?? '';

  if (rawStart === '' && rawEnd === '') return null;

  if (rawStart === '') {
    // suffix range: the last N bytes
    const suffix = parseInt(rawEnd, 10);
    if (!Number.isFinite(suffix) || suffix <= 0 || suffix > size) return null;
    return { suffix };
  }

  const start = parseInt(rawStart, 10);
  if (!Number.isFinite(start) || start >= size) return null;

  if (rawEnd === '') {
    return { offset: start };
  }
  const end = parseInt(rawEnd, 10);
  if (!Number.isFinite(end) || end < start || end >= size) return null;
  return { offset: start, length: end - start + 1 };
}

function headersFor(size: number, etag: string): Headers {
  return new Headers({
    'content-type': 'video/mp4',
    'accept-ranges': 'bytes',
    'content-length': String(size),
    'etag': etag,
    'cache-control': 'public, max-age=3600',
  });
}

export async function handleVslStream(c: Context<{ Bindings: Env }>): Promise<Response> {
  const slug = c.req.param('slug');
  const key = slug ? VIDEOS[slug] : undefined;
  if (!key) {
    return c.text('Not found.', 404);
  }

  const isHead = c.req.method === 'HEAD';

  let meta: R2Object | null = null;
  try {
    meta = await c.env.MEDIA.head(key);
  } catch (err) {
    console.error('vsl r2 read failed:', err);
    return c.text('Video unavailable — please try again shortly.', 503);
  }
  if (!meta) return c.text('Not found.', 404);

  if (isHead) {
    return new Response(null, { status: 200, headers: headersFor(meta.size, meta.httpEtag) });
  }

  const rangeHeader = c.req.header('range');
  const range = rangeHeader ? parseRangeHeader(rangeHeader, meta.size) : null;

  try {
    if (range) {
      const ranged = await c.env.MEDIA.get(key, { range });
      if (!ranged) return c.text('Not found.', 404);

      const win = effectiveWindow(ranged);
      const headers = headersFor(win.end - win.start + 1, ranged.httpEtag);
      headers.set('content-range', `bytes ${win.start}-${win.end}/${ranged.size}`);
      return new Response(ranged.body, { status: 206, headers });
    }

    const full = await c.env.MEDIA.get(key);
    if (!full) return c.text('Not found.', 404);
    return new Response(full.body, { status: 200, headers: headersFor(full.size, full.httpEtag) });
  } catch (err) {
    console.error('vsl r2 streaming failed:', err);
    return c.text('Video unavailable — please try again shortly.', 503);
  }
}

/**
 * The byte window behind a 206. R2 echoes back the effective range it served
 * (offset/length/suffix) — derive Content-Range from that rather than from the
 * browser's read.
 */
function effectiveWindow(ranged: R2ObjectBody): { start: number; end: number } {
  const r = ranged.range ? (ranged.range as { offset?: number; length?: number; suffix?: number }) : {};
  const size = ranged.size;

  if (typeof r.suffix === 'number') {
    const suffix = Math.min(r.suffix, size);
    return { start: size - suffix, end: size - 1 };
  }

  const start = r.offset ?? 0;
  const available = size - start;
  const length = typeof r.length === 'number' ? Math.min(r.length, available) : available;
  return { start, end: start + length - 1 };
}
