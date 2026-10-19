// Cloudflare Pages Function — proxies /api/vsl/* to the couples-food-system-api Worker.
// Streams the quiz-end videos (R2-backed, range-aware). Same pattern as the
// waitlist/quiz proxies: strip CF edge headers so the Worker sees clean request.

const WORKER_BASE = 'https://couples-food-system-api.byte-digital.workers.dev';

function buildTarget(path, search) {
  const pathAfter = Array.isArray(path) ? path.join('/') : (path || '');
  const tail = pathAfter ? '/' + pathAfter : '';
  return WORKER_BASE + '/api/vsl' + tail + (search || '');
}

function baseHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-max-age': '86400',
  };
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
    return new Response('Upstream worker unreachable', {
      status: 502,
      headers: baseHeaders(),
    });
  }

  const responseHeaders = new Headers(res.headers);
  for (const [k, v] of Object.entries(baseHeaders())) responseHeaders.set(k, v);
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
        'access-control-allow-methods': 'GET, HEAD, OPTIONS',
        'access-control-allow-headers': 'content-type',
        'access-control-max-age': '86400',
      },
    });
  }
  return proxy(context);
}
