import {createClient} from '@supabase/supabase-js';
import {cookies} from 'next/headers';
import {SESSION_COOKIE,verifySession} from './session.mjs';
export function database() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (process.env.SUPABASE_DATA_READY !== 'true' || !url || !key || /your|placeholder|xxxxx/i.test(key)) throw Object.assign(new Error('Le service de comptes est en cours de configuration. Merci de réessayer plus tard.'),{status:503});
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
export async function requireUser() {
  const id=await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!id) throw Object.assign(new Error('Veuillez vous connecter.'),{status:401});
  return id;
}
export function checkOrigin(req) {
  const origin=req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) throw Object.assign(new Error('Requête refusée.'),{status:403});
}
export async function readJson(req) {
  checkOrigin(req);
  if (!req.headers.get('content-type')?.includes('application/json')) throw Object.assign(new Error('Requête invalide.'),{status:415});
  const body=await req.text();
  if (body.length>20000) throw Object.assign(new Error('Le contenu est trop long.'),{status:413});
  try { return JSON.parse(body); } catch { throw invalid('Requête invalide.'); }
}
export function fail(error) { const status=error.status||500; return Response.json({error:status===500?'Le service est momentanément indisponible.':error.message},{status}); }
export function text(value,max=1000) { return typeof value==='string'?value.trim().slice(0,max):''; }
export function invalid(message) { return Object.assign(new Error(message),{status:400}); }
export async function limitAuth(email, req) {
  const ip=req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  for (const [value, limit] of [['email:'+email,8],['ip:'+ip,40]]) {
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
    const bucket=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
    const {data,error}=await database().rpc('lb_auth_allowed',{bucket_key:bucket,attempt_limit:limit});
    if(error) throw error;
    if(!data) throw Object.assign(new Error('Trop de tentatives. Réessayez dans 15 minutes.'),{status:429});
  }
}

