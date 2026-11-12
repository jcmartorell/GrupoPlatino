#!/usr/bin/env node
// Registra una transacción nueva en forma agregada (sin nombres de clientes).
// Uso: node scripts/add-deal.mjs --industry "Salud" [--count 1]
import { DEALS_PATH, readJson, writeJson, validateDeals } from './lib.mjs';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    out[argv[i].slice(2)] = argv[i + 1] ?? '';
    i++;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const industry = (args.industry ?? '').trim();
const count = args.count === undefined || args.count === '' ? 1 : Number(args.count);

if (!industry || !Number.isInteger(count) || count < 1) {
  console.error('Uso: --industry "Nombre de industria" [--count N] (N entero >= 1).');
  process.exit(1);
}

const data = await readJson(DEALS_PATH, { total: 0, byIndustry: [] });
const existing = data.byIndustry.find((d) => d.industry.trim().toLowerCase() === industry.toLowerCase());
if (existing) existing.count += count;
else data.byIndustry.push({ industry, count });
data.total += count;
data.byIndustry.sort((a, b) => b.count - a.count || a.industry.localeCompare(b.industry, 'es'));
data.updatedAt = new Date().toISOString().slice(0, 10);

const errors = validateDeals(data);
if (errors.length) {
  console.error(errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
await writeJson(DEALS_PATH, data);
console.log(`Transacción registrada: ${industry} (+${count}). Total: ${data.total}.`);
