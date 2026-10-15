import Stripe from 'stripe';
import {database} from './server';
export const appUrl=()=>process.env.NEXT_PUBLIC_APP_URL||'https://www.swissbuisness.com';
export const billingReady=()=>Boolean(process.env.STRIPE_BILLING_READY==='true'&&process.env.COMMERCIAL_READY==='true'&&process.env.LEGAL_NAME&&process.env.LEGAL_ADDRESS&&process.env.STRIPE_SECRET_KEY&&process.env.STRIPE_WEBHOOK_SECRET&&process.env.STRIPE_PRICE_MONTHLY&&process.env.STRIPE_PRICE_ANNUAL);
export const stripeClient=()=>new Stripe(process.env.STRIPE_SECRET_KEY,{maxNetworkRetries:2});
export async function syncSubscription(subscription,eventTime){
  const id=subscription.metadata?.user_id;
  if(!/^[1-9]\d*$/.test(id||'')) throw new Error('Subscription owner missing');
  const price=subscription.items.data[0]?.price;
  if(![process.env.STRIPE_PRICE_MONTHLY,process.env.STRIPE_PRICE_ANNUAL].filter(Boolean).includes(price?.id)) throw new Error('Unrecognized subscription price');
  const customer=typeof subscription.customer==='string'?subscription.customer:subscription.customer.id;
  const db=database(),{data:user,error}=await db.from('users').select('stripe_customer_id,stripe_subscription_id,stripe_event_at').eq('id',id).single();
  if(error) throw error;
  if(user.stripe_customer_id!==customer) throw new Error('Subscription customer mismatch');
  if(user.stripe_event_at>eventTime) return;
  if(user.stripe_subscription_id&&user.stripe_subscription_id!==subscription.id) return;
  const end=subscription.items.data[0]?.current_period_end||subscription.current_period_end;
  const {error:updateError}=await db.from('users').update({stripe_subscription_id:subscription.id,subscription_status:subscription.status,subscription_ends_at:end?new Date(end*1000).toISOString():null,plan:'starter',billing_cycle:price.recurring?.interval==='year'?'annual':'monthly',stripe_event_at:eventTime,updated_at:new Date().toISOString()}).eq('id',id).lte('stripe_event_at',eventTime);
  if(updateError) throw updateError;
}
export async function requireWriteAccess(userId){
  if(!billingReady()) return;
  const {data:user,error}=await database().from('users').select('subscription_status,subscription_ends_at,trial_ends_at').eq('id',userId).single();
  if(error) throw error;
  const paid=['active','trialing'].includes(user.subscription_status)&&Date.parse(user.subscription_ends_at)>Date.now();
  if(!paid&&!(user.subscription_status==='trial'&&Date.parse(user.trial_ends_at)>Date.now())) throw Object.assign(new Error('Votre période d’essai est terminée. Consultez Mon abonnement pour continuer. Vos données restent consultables et exportables.'),{status:403});
}

