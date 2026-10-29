#!/usr/bin/env node
// Uso: node scripts/add-deal.mjs --client "Empresa" --sector "Sector" --date 2026-10 \
//        [--type "Fusión / Adquisición"] [--description "Texto"] [--id slug] [--url https://...]
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

const slugify = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const args = parseArgs(process.argv.slice(2));
const client = (args.client ?? '').trim();
const sector = (args.sector ?? '').trim();
const date = (args.date ?? '').trim();

if (!client || !sector || !date) {
  console.error('Faltan datos: --client, --sector y --date (AAAA-MM) son obligatorios.');
  process.exit(1);
}

const deal = {
  id: (args.id || `${slugify(client)}-${date}`).trim(),
  client,
  sector,
  type: (args.type || 'Fusiones y adquisiciones').trim(),
  date,
  description:
    (args.description || '').trim() ||
    `Asesoría financiera y estratégica a ${client} en una transacción de fusiones y adquisiciones.`,
};
if (args.url) deal.url = args.url.trim();

const data = await readJson(DEALS_PATH, { deals: [] });
data.deals.push(deal);
data.deals.sort((a, b) => b.date.localeCompare(a.date));

const errors = validateDeals(data);
if (errors.length) {
  console.error(errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
await writeJson(DEALS_PATH, data);
console.log(`Transacción agregada: ${deal.client} (${deal.date}).`);
