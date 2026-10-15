import {requireUser,fail} from '../../../lib/server';
export async function POST(){try{await requireUser();return Response.json({error:'Les paiements ne sont pas encore activés. Aucun montant ne sera prélevé.'},{status:503});}catch(error){return fail(error);}}

