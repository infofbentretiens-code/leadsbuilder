import {hash} from 'bcryptjs';
import {cookies} from 'next/headers';
import {database,readJson,fail,invalid,limitAuth} from '../../../../lib/server';
import {resetDigest,validPassword} from '../../../../lib/reset.mjs';
import {SESSION_COOKIE} from '../../../../lib/session.mjs';
import {passwordLinkOwner,verifyPasswordLink} from '../../../../lib/password-link.mjs';
export async function POST(req){try{
  const {token,password}=await readJson(req);
  const id=passwordLinkOwner(token);
  if(!id) throw invalid('Lien invalide ou expiré. Demandez un nouveau lien.');
  if(!validPassword(password)) throw invalid('Choisissez au moins 12 caractères (72 octets maximum).');
  await limitAuth('reset-token:'+resetDigest(token),req);
  const db=database();
  const {data:user,error:readError}=await db.from('users').select('password').eq('id',id).maybeSingle();
  if(readError) throw readError;
  if(!user||!verifyPasswordLink(token,user.password)) throw invalid('Lien invalide, expiré ou déjà utilisé. Demandez un nouveau lien.');
  // Compare and update atomically: two requests cannot consume the same link.
  const {data,error}=await db.from('users').update({password:await hash(password,12),updated_at:new Date().toISOString()}).eq('id',id).eq('password',user.password).select('id');
  if(error) throw error;
  if(!data?.length) throw invalid('Lien déjà utilisé. Demandez un nouveau lien.');
  (await cookies()).delete(SESSION_COOKIE);
  return Response.json({message:'Mot de passe modifié. Vous pouvez vous connecter.'},{headers:{'Cache-Control':'no-store'}});
}catch(error){return fail(error);}}
