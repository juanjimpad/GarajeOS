const RTDB_URL = 'https://garajeos-default-rtdb.europe-west1.firebasedatabase.app';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/calendar/')) {
      const secret = url.pathname.replace('/calendar/', '').split('/')[0];

      if (!secret || secret.length < 10) {
        return new Response('Not found', { status: 404 });
      }

      const res = await fetch(
        `${RTDB_URL}/calendarExports/${encodeURIComponent(secret)}.json`
      );

      if (!res.ok) {
        return new Response('Not found', { status: 404 });
      }

      const data = await res.json();

      if (!data || typeof data !== 'string') {
        return new Response('Not found', { status: 404 });
      }

      return new Response(data, {
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': 'attachment; filename="garajeos.ics"',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
