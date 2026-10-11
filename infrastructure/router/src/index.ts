// Cloudflare Worker — reverse-proxies custom domains to the right Pages project
// - cooktwo.com -> couples-food-system-v3.pages.dev (marketing site)
// - cooktwo.app -> cfs-app.pages.dev (PWA)
// - www.* -> 301 redirect to apex
// - PWA routes /PWA/* on cooktwo.com are proxied to the PWA origin
//
// NOTE: routing behaviour here is intentionally identical to the version that
// has been live in production since 2026-06-20. A bot/crawler filter exists in
// git history (commit 418897d) but was never deployed and MUST NOT be enabled
// as written: its UA pattern list includes 'bot', which matches Googlebot and
// Bingbot and would return 403 to search engine crawlers and deindex the site.
// See TODO below before revisiting that filter.

export interface Env {}

const APEX_REDIRECTS: Record<string, string> = {
  'www.cooktwo.com': 'https://cooktwo.com',
  'www.cooktwo.app': 'https://cooktwo.app',
};

const APEX_TARGETS: Record<string, string> = {
  'cooktwo.app': 'https://cfs-app.pages.dev',
  'cooktwo.com': 'https://couples-food-system-v3.pages.dev',
};

const PWA_ON_COM: { test: (path: string) => boolean; target: string } = {
  test: (p) => p.startsWith('/PWA') || p === '/PWA/' || p === '/PWA',
  target: 'https://cfs-app.pages.dev',
};

// TODO: if the bot filter is ever wanted, allowlist major search engines first
// (Googlebot, GoogleOther, AdsBot-Google, bingbot, Applebot, DuckDuckBot) and
// exempt them from any 'bot' substring match before enabling it in production.

function pickTarget(host: string, path: string): string | null {
  // www.* -> 301 to apex
  if (APEX_REDIRECTS[host]) {
    return null; // signal: redirect instead of proxy
  }
  // Apex on cooktwo.com with /PWA/* -> PWA origin
  if (host === 'cooktwo.com' && PWA_ON_COM.test(path)) {
    return PWA_ON_COM.target;
  }
  // Apex -> corresponding Pages project
  return APEX_TARGETS[host] || null;
}

function buildTarget(target: string, url: URL): string {
  return target + url.pathname + url.search;
}

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    // www -> apex 301 redirect
    const apex = APEX_REDIRECTS[host];
    if (apex) {
      const location = apex + url.pathname + url.search;
      return new Response(null, {
        status: 301,
        headers: {
          'location': location,
          'cache-control': 'public, max-age=3600',
        },
      });
    }

    const target = pickTarget(host, url.pathname);
    if (!target) {
      return new Response('Unknown host: ' + host, { status: 404 });
    }

    const targetUrl = buildTarget(target, url);
    const headers = new Headers(request.headers);
    headers.set('host', new URL(target).host);
    // Strip CF-internal headers that confuse the Pages origin
    headers.delete('cf-connecting-ip');
    headers.delete('cf-ipcountry');
    headers.delete('cf-ray');
    headers.delete('cf-visitor');
    // Bypass any cached copy of this upstream URL so the Pages origin is always
    // consulted. Without this the edge can serve a stale build from before a
    // deploy (observed serving a pre-change HTML for cooktwo.com/).
    headers.set('cache-control', 'no-cache');

    const init: RequestInit & { cf?: { cacheTtl?: number; cacheEverything?: boolean } } = {
      method: request.method,
      headers,
      redirect: 'manual',
      cf: {
        cacheTtl: 0,
        cacheEverything: false,
      },
    };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = request.body;
      // @ts-expect-error - duplex is in RequestInit for streaming bodies
      init.duplex = 'half';
    }

    let upstream: Response;
    try {
      upstream = await fetch(targetUrl, init);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Upstream unreachable', target: targetUrl }),
        { status: 502, headers: { 'content-type': 'application/json' } },
      );
    }

    // Build response, preserving streaming body
    const outHeaders = new Headers(upstream.headers);
    // Drop hop-by-hop / Cloudflare-specific headers
    outHeaders.delete('cf-ray');
    outHeaders.delete('cf-cache-status');

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: outHeaders,
    });
  },
};