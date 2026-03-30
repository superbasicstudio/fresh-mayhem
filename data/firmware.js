// Central firmware version  -  auto-fetched from GitHub, cached in sessionStorage
const FALLBACK_VERSION = '2.3.2';
const CACHE_KEY = 'fm-mayhem-latest';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour
const REPO = 'portapack-mayhem/mayhem-firmware';

export function getFirmwareVersion() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.version;
  } catch {}
  return FALLBACK_VERSION;
}

export function getFirmwareUrl() {
  return `https://github.com/${REPO}/releases`;
}

let fetchPromise = null;

export function fetchLatestFirmware(onUpdate) {
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data?.tag_name) {
        const version = data.tag_name.replace(/^v/, '');
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ version, ts: Date.now() }));
        } catch {}
        if (onUpdate) onUpdate(version);
        return version;
      }
      return FALLBACK_VERSION;
    })
    .catch(() => FALLBACK_VERSION);
  return fetchPromise;
}
