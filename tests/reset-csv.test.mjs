import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newResetToken,resetDigest,validPassword} from '../lib/reset.mjs';
import {csvCell,contactsCsv} from '../lib/csv.mjs';
test('reset links are unpredictable and only digests are stored',()=>{const a=newResetToken(),b=newResetToken();assert.match(a.token,/^[a-f0-9]{64}$/);assert.notEqual(a.token,b.token);assert.notEqual(a.digest,a.token);assert.equal(resetDigest(a.token),a.digest);});
test('password limits use bytes so bcrypt never silently truncates passwords',()=>{assert.equal(validPassword('12345678901'),false);assert.equal(validPassword('123456789012'),true);assert.equal(validPassword('é'.repeat(37)),false);assert.equal(validPassword('a'.repeat(73)),false);assert.equal(validPassword(null),false);});
test('CSV preserves accents, delimiters, quotes and newlines while blocking formulas',()=>{assert.equal(csvCell('Élodie; "test"\nContact'),'"Élodie; ""test""\nContact"');for(const value of ['=HYPERLINK("https://example.com")',' +1','-10','@sum(A1)','\tcmd'])assert.ok(csvCell(value).startsWith('"\''));const csv=contactsCsv([{nom:'Élodie',email:'e@example.com',notes:'a;b'}]);assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"Élodie"'));assert.ok(csv.includes('"a;b"'));});
