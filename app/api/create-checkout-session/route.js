import {requireUser,readJson,fail,database,invalid} from '../../../lib/server';
import {billingReady,stripeClient,appUrl} from '../../../lib/billing';
export async function POST(req){try{
  const id=await requireUser(),body=await readJson(req);
  if(!billingReady()) return Response.json({error:'Les paiements sont en cours de configuration. Aucun montant ne sera prélevé.'},{status:503});
  if(!['monthly','annual'].includes(body.billing)) throw invalid('Choisissez une période de facturation.');
  const db=database(),{data:user,error}=await db.from('users').select('email,stripe_customer_id,stripe_subscription_id').eq('id',id).single();
  if(error) throw error;
  const stripe=stripeClient();
  const priceId=body.billing==='annual'?process.env.STRIPE_PRICE_ANNUAL:process.env.STRIPE_PRICE_MONTHLY;
  const price=await stripe.prices.retrieve(priceId);
  if(!price.active||price.currency!=='chf'||price.unit_amount!==(body.billing==='annual'?29000:2900)||price.recurring?.interval!==(body.billing==='annual'?'year':'month')||price.recurring?.interval_count!==1) throw new Error('Billing price configuration mismatch');
  if(user.stripe_subscription_id){const sub=await stripe.subscriptions.retrieve(user.stripe_subscription_id);if(!['canceled','incomplete_expired'].includes(sub.status)) throw invalid('Un abonnement existe déjà. Utilisez Gérer mon abonnement.');}
  let customer=user.stripe_customer_id;
  if(!customer){const c=await stripe.customers.create({email:user.email,metadata:{user_id:String(id)}},{idempotencyKey:'lb-customer-'+id});customer=c.id;const {error:e}=await db.from('users').update({stripe_customer_id:customer}).eq('id',id);if(e) throw e;}
  if(user.stripe_subscription_id){const {error:e}=await db.from('users').update({stripe_subscription_id:null}).eq('id',id);if(e) throw e;}
  // Reuse one open checkout per customer, including when changing the selected cycle.
  const open=await stripe.checkout.sessions.list({customer,status:'open',limit:10});
  const existing=open.data.find(s=>s.mode==='subscription'&&s.client_reference_id===String(id));
  if(existing) return Response.json({url:existing.url});
  const session=await stripe.checkout.sessions.create({customer,mode:'subscription',locale:'fr',line_items:[{price:priceId,quantity:1}],client_reference_id:String(id),subscription_data:{metadata:{user_id:String(id)}},success_url:appUrl()+'/account?payment=success',cancel_url:appUrl()+'/account?payment=cancelled'}, {idempotencyKey:`lb-checkout-${id}-${Math.floor(Date.now()/1800000)}`});
  return Response.json({url:session.url});
}catch(error){return fail(error);}}

