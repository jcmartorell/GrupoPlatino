import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DEALS_PATH = path.join(ROOT, 'public/data/deals.json');
export const NEWS_PATH = path.join(ROOT, 'public/data/news.json');

export async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT' && fallback !== undefined) return fallback;
    throw err;
  }
}

export async function writeJson(file, data) {
  await writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export function validateDeals(data) {
  const errors = [];
  if (!data || !Array.isArray(data.deals)) return ['deals.json debe tener una propiedad "deals" (arreglo).'];
  const ids = new Set();
  data.deals.forEach((d, i) => {
    const at = `deals[${i}]`;
    for (const k of ['id', 'client', 'sector', 'type', 'date', 'description']) {
      if (typeof d[k] !== 'string' || !d[k].trim()) errors.push(`${at}.${k} es obligatorio (texto).`);
    }
    if (d.date && !MONTH_RE.test(d.date)) errors.push(`${at}.date debe tener formato AAAA-MM (ej. 2026-09).`);
    if (d.id && ids.has(d.id)) errors.push(`${at}.id duplicado: ${d.id}`);
    ids.add(d.id);
  });
  return errors;
}

export function validateNews(data) {
  const errors = [];
  if (!data || !Array.isArray(data.items)) return ['news.json debe tener una propiedad "items" (arreglo).'];
  if (data.items.length > 12) errors.push('news.json no debe tener más de 12 items.');
  data.items.forEach((n, i) => {
    const at = `items[${i}]`;
    for (const k of ['title', 'source', 'date', 'url']) {
      if (typeof n[k] !== 'string' || !n[k].trim()) errors.push(`${at}.${k} es obligatorio (texto).`);
    }
    if (n.url && !/^https?:\/\//.test(n.url)) errors.push(`${at}.url debe ser http(s).`);
    if (n.date && Number.isNaN(Date.parse(n.date))) errors.push(`${at}.date no es una fecha válida.`);
  });
  return errors;
}
