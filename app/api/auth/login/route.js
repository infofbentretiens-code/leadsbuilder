import {compare} from 'bcryptjs';
import {cookies} from 'next/headers';
import {database,readJson,text,fail,invalid,limitAuth} from '../../../../lib/server';
import {createSession,SESSION_COOKIE,SESSION_TTL} from '../../../../lib/session.mjs';
export async function POST(req) {
  try {
    const body=await readJson(req), email=text(body.email,254).toLowerCase();
    if (!email||typeof body.password!=='string'||new TextEncoder().encode(body.password).length>72) throw invalid('Adresse e-mail ou mot de passe invalide.');
    await limitAuth(email,req);
    const {data:user,error}=await database().from('users').select('id,email,password,first_name,last_name,plan').eq('email',email).maybeSingle();
    if (error) throw new Error('Database error');
    if (!user||!await compare(body.password,user.password)) return Response.json({error:'Adresse e-mail ou mot de passe incorrect.'},{status:401});
    (await cookies()).set(SESSION_COOKIE,await createSession(user.id),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:SESSION_TTL});
    return Response.json({user:{id:user.id,email:user.email,firstName:user.first_name,lastName:user.last_name,plan:user.plan}});
  } catch(error) { return fail(error); }
}

