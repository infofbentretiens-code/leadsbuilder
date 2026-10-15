import {database,readJson,text,fail,invalid,limitAuth} from '../../../../lib/server';
import {mailReady,sendMail} from '../../../../lib/mail';
import {RESET_MESSAGE} from '../../../../lib/reset.mjs';
import {issuePasswordLink} from '../../../../lib/password-link.mjs';
import {appUrl} from '../../../../lib/app-url.mjs';
export async function POST(req){try{
  const body=await readJson(req),email=text(body.email,254).toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(email)) throw invalid('Saisissez une adresse e-mail valide.');
  await limitAuth('reset:'+email,req);
  if(!mailReady()) throw Object.assign(new Error('La récupération par e-mail est en cours de configuration. Contactez info.fbentretiens@gmail.com.'),{status:503});
  const db=database(),{data:user,error}=await db.from('users').select('id,password').eq('email',email).maybeSingle();
  if(error) throw error;
  if(user){
    const token=issuePasswordLink(user.id,user.password);
    const url=new URL('/auth/reset-password',appUrl());url.hash=new URLSearchParams({token}).toString();
    try {await sendMail(email,'Réinitialiser votre mot de passe LeadsBuilder',`Vous avez demandé un nouveau mot de passe. Ce lien est valable une heure et une seule fois :\n\n${url}\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez ce message.`);}
    catch {console.error('Password reset delivery failed.'); /* Never disclose whether the account exists. */}
  }
  return Response.json({message:RESET_MESSAGE},{headers:{'Cache-Control':'no-store'}});
}catch(error){return fail(error);}}
