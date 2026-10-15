import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSession,verifySession,SESSION_TTL} from '../lib/session.mjs';
process.env.SESSION_SECRET='test-only-secret-0123456789-abcdefghijklmnopqrstuvwxyz';
test('signed sessions identify only their original account',async()=>{
  const token=await createSession(17,1000000);
  assert.equal(await verifySession(token,1000000),'17');
  const payload=btoa(JSON.stringify({sub:'18',exp:99999999})).replace(/=/g,'');
  assert.equal(await verifySession(payload+'.'+token.split('.')[1],1000000),null);
  assert.equal(await verifySession('17'),null);
  assert.equal(await verifySession('17.forged'),null);
});
test('expired and malformed sessions are refused',async()=>{
  const token=await createSession(17,1000000);
  assert.equal(await verifySession(token,1000000+SESSION_TTL*1000),null);
  for(const invalid of [undefined,'','x.y.z','!@.abcd','x'.repeat(1025)]) assert.equal(await verifySession(invalid),null);
});
test('invalid account identifiers cannot be signed',async()=>{
  for(const id of ['0','-1','abc','1.2']) await assert.rejects(createSession(id));
});
