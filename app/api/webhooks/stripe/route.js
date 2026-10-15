import {stripeClient,syncSubscription} from '../../../../lib/billing';
export async function POST(req){
  if(!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET) return Response.json({error:'Paiements non configurés.'},{status:503});
  const stripe=stripeClient();let event;
  try{event=stripe.webhooks.constructEvent(await req.text(),req.headers.get('stripe-signature'),process.env.STRIPE_WEBHOOK_SECRET);}catch{return Response.json({error:'Signature invalide.'},{status:400});}
  try{
    const obj=event.data.object;
    if(event.type.startsWith('customer.subscription.')){
      // Unrelated subscriptions on the same Stripe account do not belong to this app.
      if(obj.metadata?.user_id) await syncSubscription(await stripe.subscriptions.retrieve(obj.id),event.created);
    }else if(event.type==='checkout.session.completed'&&obj.mode==='subscription'&&obj.subscription){
      const sub=await stripe.subscriptions.retrieve(obj.subscription);
      if(sub.metadata?.user_id) await syncSubscription(sub,event.created);
    }
    return Response.json({received:true});
  }catch{return Response.json({error:'Synchronisation à réessayer.'},{status:500});}
}
