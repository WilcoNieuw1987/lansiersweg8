// Herbouwt index.html uit index.template.html en HERGEBRUIKT de bestaande
// versleutelde Prive-data uit de huidige index.html. Zo kun je de publieke
// inhoud aanpassen zonder je wachtwoord opnieuw in te voeren.
//   Gebruik:  node tools/rebuild.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const cur = readFileSync('index.html', 'utf8');
const m = cur.match(/window\.LW8_ENC\s*=\s*(\{[\s\S]*?\});/);
if (!m) { console.error('FOUT: geen bestaande versleutelde data in index.html gevonden.'); process.exit(1); }

const tpl = readFileSync('index.template.html', 'utf8');
writeFileSync('index.html', tpl.replace('/*ENC_BLOB*/', m[1]));
console.log('OK: index.html herbouwd; bestaande versleutelde Prive-tab behouden.');
