const encoder = new TextEncoder();
export const SESSION_COOKIE = 'lb_session';
export const SESSION_TTL = 60 * 60 * 24;
export async function passwordVersion(hash){return encode(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(hash))));}
function encode(bytes) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function decode(value) { return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)); }
function secret() {
  const value = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value || value.length < 32 || /your|placeholder|xxxxx/i.test(value)) throw new Error('Session non configurée');
  return value;
}
async function key() { return crypto.subtle.importKey('raw', encoder.encode(secret()), {name:'HMAC', hash:'SHA-256'}, false, ['sign','verify']); }
export async function createSession(userId, now = Date.now(), version = 0) {
  if (!/^[1-9]\d*$/.test(String(userId))) throw new Error('Identifiant invalide');
  const payload = encode(encoder.encode(JSON.stringify({sub:String(userId),v:version,exp:Math.floor(now/1000)+SESSION_TTL})));
  return payload + '.' + encode(new Uint8Array(await crypto.subtle.sign('HMAC', await key(), encoder.encode(payload))));
}
export async function verifySession(token, now = Date.now()) {
  return (await verifySessionClaims(token,now))?.sub || null;
}
export async function verifySessionClaims(token, now = Date.now()) {
  try {
    if (typeof token !== 'string' || token.length > 1024) return null;
    const parts = token.split('.');
    if (parts.length !== 2 || !await crypto.subtle.verify('HMAC', await key(), decode(parts[1]), encoder.encode(parts[0]))) return null;
    const payload = JSON.parse(new TextDecoder().decode(decode(parts[0])));
    return /^[1-9]\d*$/.test(payload.sub) && Number.isSafeInteger(payload.exp) && payload.exp > Math.floor(now/1000) ? {...payload,v:payload.v||0} : null;
  } catch { return null; }
}

