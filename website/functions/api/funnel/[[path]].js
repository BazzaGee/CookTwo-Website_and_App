// Cloudflare Pages Function — proxies /api/funnel/* to the couples-food-system-api Worker.
// Same pattern as functions/api/quiz/[[path]].js.
//
// POST /api/funnel/track — the client tracker's batched events. Also stamps
// the Cloudflare country onto the proxied request so the worker can store it
// without ever touching an IP address.

const WORKER_BASE = 'https://couples-food-system-api.byte-digital.workers.dev';

function buildTarget(path, search) {
  const pathAfter = Array.isArray(path) ? path.join('/') : (path || '');
  const tail = pathAfter ? '/' + pathAfter : '';
  return WORKER_BASE + '/api/funnel' + tail + (search || '');
}

async function proxy(context) {
  const { request, params } = context;
  const url = new URL(request.url);
  const target = buildTarget(params.path, url.search);

  const headers = new Headers(request.headers);
  headers.set('host', new URL(WORKER_BASE).host);
  headers.delete('cf-connecting-ip');
  headers.delete('cf-ipcountry');
  headers.delete('cf-ray');
  headers.delete('cf-visitor');
  const country = request.cf && request.cf.country;
  if (country) headers.set('x-funnel-country', country);

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
    init.duplex = 'half';
  }

  let res;
  try {
    res = await fetch(target, init);
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Upstream worker unreachable' }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }

  const responseHeaders = new Headers(res.headers);
  responseHeaders.set('cache-control', 'no-store');
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
        'access-control-max-age': '86400',
      },
    });
  }
  return proxy(context);
}
