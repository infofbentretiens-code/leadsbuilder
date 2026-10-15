import {requireUser,fail} from '../../../lib/server';
export async function POST(){try{await requireUser();return Response.json({error:'Les notifications par e-mail ne sont pas encore activées.'},{status:503});}catch(error){return fail(error);}}

