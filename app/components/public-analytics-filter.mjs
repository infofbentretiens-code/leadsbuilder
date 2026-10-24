const publicPaths = new Set(['/', '/pricing', '/contact', '/conditions', '/confidentialite']);

export function filterPublicPageview(event, preferences = {}) {
  if (preferences.doNotTrack === '1' || preferences.globalPrivacyControl === true) return null;
  try {
    const url = new URL(event.url);
    if (url.hostname !== 'www.swissbuisness.com' && url.hostname !== 'swissbuisness.com') return null;
    const path = url.pathname.replace(/\/$/, '') || '/';
    if (event.type !== 'pageview' || !publicPaths.has(path)) return null;
    url.search = '';
    url.hash = '';
    return { ...event, url: url.toString() };
  } catch { return null; }
}
