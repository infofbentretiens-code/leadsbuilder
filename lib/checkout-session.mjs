// Reuse only a checkout with the requested price. Completed and expired
// sessions form a new generation, so restarting cannot reuse an old payment.
export async function subscriptionCheckout(stripe, params) {
  const sessions = stripe.checkout.sessions;
  const recent = await sessions.list({customer: params.customer, limit: 100});
  const own = recent.data.filter(s => s.mode === 'subscription' && s.client_reference_id === params.client_reference_id);
  let matching;
  for (const session of own.filter(s => s.status === 'open')) {
    const items = await sessions.listLineItems(session.id, {limit: 2});
    if (!matching && session.success_url === params.success_url && session.cancel_url === params.cancel_url && items.data.length === 1 && items.data[0].price?.id === params.line_items[0].price && items.data[0].quantity === 1) {
      matching = session;
    } else {
      await sessions.expire(session.id);
    }
  }
  if (matching) return matching;
  const generation = own[0]?.id || 'initial';
  return sessions.create(params, {idempotencyKey: `lb-checkout-v2-${params.client_reference_id}-${params.line_items[0].price}-${generation}`});
}
