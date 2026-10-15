import {cookies} from 'next/headers';
import {checkOrigin,fail} from '../../../../lib/server';
import {SESSION_COOKIE} from '../../../../lib/session.mjs';
export async function POST(req) { try {checkOrigin(req);(await cookies()).set(SESSION_COOKIE,'',{path:'/',maxAge:0,httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax'});return Response.json({success:true});}catch(error){return fail(error);} }

