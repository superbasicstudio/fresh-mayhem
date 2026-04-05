const UMAMI_HOST = 'https://analytics.superbasic.studio';
const WEBSITE_ID = '059ba9c6-53e0-4924-b1b3-d3b900d4f949';

let cached = { count: 0, ts: 0 };
const CACHE_TTL = 30_000; // 30 seconds

let tokenCache = { token: null, ts: 0 };
const TOKEN_TTL = 3600_000; // 1 hour

async function getToken() {
  if (tokenCache.token && Date.now() - tokenCache.ts < TOKEN_TTL) {
    return tokenCache.token;
  }

  const res = await fetch(`${UMAMI_HOST}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: process.env.UMAMI_USERNAME,
      password: process.env.UMAMI_PASSWORD,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  tokenCache = { token: data.token, ts: Date.now() };
  return data.token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  if (Date.now() - cached.ts < CACHE_TTL) {
    return res.json({ count: cached.count });
  }

  try {
    const token = await getToken();
    if (!token) {
      return res.status(502).json({ count: cached.count || 0 });
    }

    const response = await fetch(`${UMAMI_HOST}/api/websites/${WEBSITE_ID}/active`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(502).json({ count: cached.count || 0 });
    }

    const data = await response.json();
    cached = { count: data.visitors || 0, ts: Date.now() };
    return res.json({ count: cached.count });
  } catch {
    return res.json({ count: cached.count || 0 });
  }
}
