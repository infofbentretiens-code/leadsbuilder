import test from 'node:test';
import assert from 'node:assert/strict';
import {subscriptionCheckout} from '../lib/checkout-session.mjs';

const params = price => ({customer:'cus_test',mode:'subscription',client_reference_id:'1',line_items:[{price,quantity:1}]});
function fixture(data, prices = {}) {
  const expired=[], created=[];
  const sessions={
    list:async()=>({data}),
    listLineItems:async id=>({data:[{price:{id:prices[id]},quantity:1}]}),
    expire:async id=>expired.push(id),
    create:async (body,options)=>{created.push({body,options});return {id:'cs_new',url:'https://checkout.example/new'};}
  };
  return {stripe:{checkout:{sessions}},expired,created};
}
const own=(id,status)=>({id,status,mode:'subscription',client_reference_id:'1',url:'https://checkout.example/'+id});

test('retrying an open checkout reuses its URL without creating a second subscription',async()=>{
  const f=fixture([own('cs_open','open')],{cs_open:'monthly'});
  assert.equal((await subscriptionCheckout(f.stripe,params('monthly'))).id,'cs_open');
  assert.equal(f.created.length,0);
});

test('switching to annual expires the abandoned monthly checkout and uses the annual price',async()=>{
  const f=fixture([own('cs_month','open')],{cs_month:'monthly'});
  await subscriptionCheckout(f.stripe,params('annual'));
  assert.deepEqual(f.expired,['cs_month']);
  assert.equal(f.created[0].body.line_items[0].price,'annual');
});

test('restarting after a completed checkout gets a new idempotency generation, even within the same minute',async()=>{
  const first=fixture([]), restart=fixture([own('cs_paid','complete')]);
  await subscriptionCheckout(first.stripe,params('monthly'));
  await subscriptionCheckout(restart.stripe,params('monthly'));
  assert.notEqual(first.created[0].options.idempotencyKey,restart.created[0].options.idempotencyKey);
});

test('an expired checkout is not reused and another application session is not expired',async()=>{
  const other={...own('cs_other','open'),client_reference_id:'2'};
  const f=fixture([own('cs_expired','expired'),other]);
  await subscriptionCheckout(f.stripe,params('annual'));
  assert.deepEqual(f.expired,[]);
  assert.equal(f.created.length,1);
});
