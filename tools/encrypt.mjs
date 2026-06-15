// Versleutelt tools/financien.content.html met het wachtwoord uit SITE_PW
// en bouwt index.html uit index.template.html.
//   Gebruik:  SITE_PW='jouwwachtwoord' node tools/encrypt.mjs
import { webcrypto as crypto } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const password = process.env.SITE_PW;
if (!password) { console.error('FOUT: zet eerst een wachtwoord, bijv.  SITE_PW=geheim node tools/encrypt.mjs'); process.exit(1); }

const plaintext = readFileSync('tools/app.content.html', 'utf8');
const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const iter = 250000;

const km = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
  km, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));

const b64 = (buf) => Buffer.from(buf).toString('base64');
const blob = { salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ct)), iter };

const tpl = readFileSync('index.template.html', 'utf8');
writeFileSync('index.html', tpl.replace('/*ENC_BLOB*/', JSON.stringify(blob)));
console.log('OK: index.html gebouwd met versleutelde Privé-tab.');
