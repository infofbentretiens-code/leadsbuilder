import {randomBytes,createHash} from 'node:crypto';
export const resetDigest=token=>createHash('sha256').update(token).digest('hex');
export function newResetToken(){const token=randomBytes(32).toString('hex');return {token,digest:resetDigest(token)};}
export function validPassword(password){return typeof password==='string'&&password.length>=12&&Buffer.byteLength(password,'utf8')<=72;}
export const RESET_MESSAGE='Si un compte correspond à cette adresse, un lien valable une heure vous sera envoyé. Vérifiez aussi vos courriers indésirables.';
