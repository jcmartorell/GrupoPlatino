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

export function validateDeals(data) {
  const errors = [];
  if (!data || typeof data !== 'object') return ['deals.json debe ser un objeto.'];
  if (!Number.isInteger(data.total) || data.total < 0) errors.push('"total" debe ser un entero >= 0.');
  if (!Array.isArray(data.byIndustry)) return [...errors, '"byIndustry" debe ser un arreglo de { industry, count }.'];
  const seen = new Set();
  let sum = 0;
  data.byIndustry.forEach((d, i) => {
    const at = `byIndustry[${i}]`;
    if (typeof d.industry !== 'string' || !d.industry.trim()) errors.push(`${at}.industry es obligatorio (texto).`);
    if (!Number.isInteger(d.count) || d.count < 1) errors.push(`${at}.count debe ser un entero >= 1.`);
    const key = String(d.industry).trim().toLowerCase();
    if (seen.has(key)) errors.push(`${at}.industry duplicada: ${d.industry}`);
    seen.add(key);
    sum += Number.isInteger(d.count) ? d.count : 0;
  });
  if (Number.isInteger(data.total) && data.total !== sum) {
    errors.push(`"total" (${data.total}) debe ser igual a la suma de byIndustry (${sum}).`);
  }
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
