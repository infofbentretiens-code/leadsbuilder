import {requireUser,database,fail} from '../../../lib/server';
import {billingReady} from '../../../lib/billing';
export async function GET(){try{
  const id=await requireUser(),ready=billingReady();
  const fields='email,first_name,last_name,subscription_status,trial_ends_at'+(ready?',subscription_ends_at,stripe_customer_id,billing_cycle':'');
  const {data:user,error}=await database().from('users').select(fields).eq('id',id).single();
  if(error) throw error;
  const {stripe_customer_id,...safe}=user;
  return Response.json({...safe,hasBilling:Boolean(stripe_customer_id),billingReady:ready},{headers:{'Cache-Control':'no-store'}});
}catch(e){return fail(e);}}
