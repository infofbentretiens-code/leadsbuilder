import {hash} from 'bcryptjs';
import {cookies} from 'next/headers';
import {database,readJson,text,fail,invalid,limitAuth} from '../../../../lib/server';
import {createSession,SESSION_COOKIE,SESSION_TTL,passwordVersion} from '../../../../lib/session.mjs';
export async function POST(req) {
  try {
    const body=await readJson(req), email=text(body.email,254).toLowerCase(), firstName=text(body.firstName,100), lastName=text(body.lastName,100);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!firstName||!lastName) throw invalid('Veuillez remplir les champs obligatoires.');
    if (typeof body.password!=='string'||body.password.length<12||new TextEncoder().encode(body.password).length>72) throw invalid('Choisissez un mot de passe de 12 caractères minimum (72 octets maximum).');
    await limitAuth(email,req);
    const plan='starter',passwordHash=await hash(body.password,12);
    const {data:user,error}=await database().from('users').insert({email,password:passwordHash,first_name:firstName,last_name:lastName,company:text(body.company,200),plan,subscription_status:'trial',trial_ends_at:new Date(Date.now()+14*86400000).toISOString()}).select('id,email,first_name,last_name,plan').single();
    if (error) { if(error.code==='23505') throw invalid('Impossible de créer ce compte. Si vous êtes déjà inscrit, connectez-vous.'); throw new Error('Database error'); }
    (await cookies()).set(SESSION_COOKIE,await createSession(user.id,Date.now(),await passwordVersion(passwordHash)),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:SESSION_TTL});
    return Response.json({user,message:'Compte créé.'},{status:201});
  } catch(error) { return fail(error); }
}

