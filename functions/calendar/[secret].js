const RTDB_URL = 'https://garajeos-default-rtdb.europe-west1.firebasedatabase.app';

export async function onRequest(context) {
  const { secret } = context.params;

  if (!secret || secret.length < 10) {
    return new Response('Not found', { status: 404 });
  }

  const res = await fetch(`${RTDB_URL}/calendarExports/${encodeURIComponent(secret)}.json`, {
    cf: { cacheTtl: 0 },
  });

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
