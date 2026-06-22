// Cloudflare Worker — reverse-proxies custom domains to the right Pages project
// - cooktwo.com -> couples-food-system-v3.pages.dev (marketing site)
// - cooktwo.app -> cfs-app.pages.dev (PWA)
// - www.* -> 301 redirect to apex
// - PWA routes /PWA/* on cooktwo.com are proxied to the PWA origin

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

    const init: RequestInit = {
      method: request.method,
      headers,
      redirect: 'manual',
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
