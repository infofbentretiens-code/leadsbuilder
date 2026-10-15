import test from 'node:test';
import assert from 'node:assert/strict';
import {issuePasswordLink,passwordLinkOwner,verifyPasswordLink} from '../lib/password-link.mjs';
process.env.SESSION_SECRET='test-secret-only-012345678901234567890123456789';
const now=1800000000000,oldHash='bcrypt-old-hash';
test('reset link expires after one hour and rejects changed passwords',()=>{
 const token=issuePasswordLink(42,oldHash,now);
 assert.equal(passwordLinkOwner(token),'42');
 assert.equal(verifyPasswordLink(token,oldHash,now),true);
 assert.equal(verifyPasswordLink(token,oldHash,now+3600000),false);
 assert.equal(verifyPasswordLink(token,'new-password-hash',now),false);
});
test('reset link cannot be reassigned or forged',()=>{
 const token=issuePasswordLink(42,oldHash,now);
 const [payload,sig]=token.split('.');
 const claims=JSON.parse(Buffer.from(payload,'base64url').toString());
 const forged=Buffer.from(JSON.stringify({...claims,id:'43'})).toString('base64url')+'.'+sig;
 assert.equal(verifyPasswordLink(forged,oldHash,now),false);
 assert.equal(verifyPasswordLink(token+'x',oldHash,now),false);
 assert.equal(passwordLinkOwner('malformed'),null);
 assert.notEqual(issuePasswordLink(42,oldHash,now),token);
});
