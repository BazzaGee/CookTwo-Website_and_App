const API_WORKER = 'https://couples-food-system-api.byte-digital.workers.dev';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      const target = API_WORKER + url.pathname + url.search;
      const headers = new Headers(request.headers);
      headers.set('host', new URL(API_WORKER).host);
      const init = {
        method: request.method,
        headers,
        redirect: 'manual',
      };
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = request.body;
        init.duplex = 'half';
      }
      try {
        return await fetch(target, init);
      } catch {
        return new Response(JSON.stringify({ error: 'Upstream unreachable' }), {
          status: 502,
          headers: { 'content-type': 'application/json' },
        });
      }
    }

    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return response;
    }

    if (request.method === 'GET' && (request.headers.get('Accept') || '').includes('text/html')) {
      return env.ASSETS.fetch(new URL('/index.html', request.url));
    }

    return response;
  },
};
