#!/usr/bin/env node
// Actualiza public/data/news.json con noticias recientes de M&A (RSS / Google News RSS).
// Sin API keys obligatorias. Si existe OPENAI_API_KEY o ANTHROPIC_API_KEY, agrega un resumen
// de una línea a las noticias nuevas; si no, funciona igual sin resumen.
import { NEWS_PATH, ROOT, readJson, writeJson, validateNews } from './lib.mjs';
import path from 'node:path';

const config = await readJson(path.join(ROOT, 'scripts/news-config.json'));
const MAX_ITEMS = config.maxItems ?? 12;
const MAX_AGE_MS = (config.maxAgeDays ?? 60) * 86_400_000;
const UA = 'Mozilla/5.0 (compatible; GrupoPlatinoNewsBot/1.0; +https://www.gplatino.com)';

const MA_RE =
  /fusi[oó]n|fusiona|adquis|adquier|adquiri|\bm&a\b|\bm&amp;a\b|compra de|compr[óo] |venta de|vende |vendi[óo]|capital privado|private equity|banca de inversi|oferta p[úu]blica|\bopa\b|joint venture|desinversi|consolidaci[oó]n|buyout|acquisition|merger|acquire/i;

const decodeEntities = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const stripHtml = (s) => decodeEntities(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1] : '';
}

function parseFeed(xml, feedLabel) {
  const items = [];
  for (const [, block] of xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/gi)) {
    let title = stripHtml(tag(block, 'title'));
    const link = decodeEntities(tag(block, 'link')).trim();
    const pub = tag(block, 'pubDate').trim();
    let source = stripHtml(tag(block, 'source'));
    const description = stripHtml(tag(block, 'description'));
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3)).trim();
    else if (!source) {
      const m = title.match(/^(.*) - ([^-]{2,60})$/);
      if (m) [, title, source] = m;
    }
    const time = Date.parse(pub);
    if (!title || !link || Number.isNaN(time)) continue;
    items.push({
      title,
      source: source || feedLabel,
      date: new Date(time).toISOString().slice(0, 10),
      url: link,
      snippet: description && description !== title && !description.startsWith(title) ? description : '',
      time,
    });
  }
  return items;
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/rss+xml, text/xml, */*' }, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function googleNewsUrl(query) {
  const { hl, gl, ceid } = config.language;
  const q = encodeURIComponent(`${query} when:${config.maxAgeDays ?? 60}d`);
  return `https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

const normTitle = (t) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

function similar(a, b) {
  const A = new Set(normTitle(a).split(' ').filter((w) => w.length > 3));
  const B = new Set(normTitle(b).split(' ').filter((w) => w.length > 3));
  if (!A.size || !B.size) return false;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter) >= 0.55;
}

function dedupe(items) {
  const out = [];
  for (const item of items) {
    const dup = out.some((o) => o.url === item.url || normTitle(o.title) === normTitle(item.title) || similar(o.title, item.title));
    if (!dup) out.push(item);
  }
  return out;
}

async function summarize(item) {
  const prompt =
    'Escribe un resumen de UNA oración (máx. 200 caracteres) en español de México, tono neutral y profesional, ' +
    'basado únicamente en este titular de noticia de M&A. No inventes cifras, nombres ni datos que no estén en el texto.\n\n' +
    `Titular: ${item.title}\nFuente: ${item.source}${item.snippet ? `\nExtracto: ${item.snippet}` : ''}`;
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', max_tokens: 120, messages: [{ role: 'user', content: prompt }] }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
    return (await res.json()).choices?.[0]?.message?.content?.trim() ?? '';
  }
  if (process.env.ANTHROPIC_API_KEY) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest', max_tokens: 120, messages: [{ role: 'user', content: prompt }] }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`Anthropic HTTP ${res.status}`);
    return (await res.json()).content?.[0]?.text?.trim() ?? '';
  }
  return '';
}

const feeds = [
  ...config.queries.map((q) => ({ label: 'Google Noticias', url: googleNewsUrl(q), filter: false })),
  ...(config.extraFeeds ?? []).map((f) => ({ label: f.name, url: f.url, filter: true })),
];

const existing = await readJson(NEWS_PATH, { items: [] });
const fetched = [];
let okFeeds = 0;

for (const feed of feeds) {
  try {
    const items = parseFeed(await fetchText(feed.url), feed.label);
    fetched.push(...items.filter((i) => !feed.filter || MA_RE.test(`${i.title} ${i.snippet}`)));
    okFeeds++;
  } catch (err) {
    console.warn(`Aviso: no se pudo leer ${feed.url}: ${err.message}`);
  }
}

if (okFeeds === 0) {
  console.error('Ningún feed respondió; news.json no se modificó.');
  process.exit(1);
}

const now = Date.now();
const exclude = (config.excludeKeywords ?? []).map((k) => k.toLowerCase());
const candidates = fetched
  .filter((i) => i.time <= now + 86_400_000 && now - i.time <= MAX_AGE_MS)
  .filter((i) => MA_RE.test(`${i.title} ${i.snippet}`))
  .filter((i) => !exclude.some((k) => i.title.toLowerCase().includes(k)))
  .sort((a, b) => b.time - a.time);

const previous = (existing.items ?? []).map((i) => ({ ...i, time: Date.parse(i.date) }));
const merged = dedupe([...candidates, ...previous]).sort((a, b) => b.time - a.time).slice(0, MAX_ITEMS);

const prevByUrl = new Map(previous.map((i) => [i.url, i]));
const llmEnabled = Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
const items = [];
for (const item of merged) {
  const { time, snippet, ...rest } = item;
  const out = { title: rest.title, source: rest.source, date: rest.date, url: rest.url };
  const prev = prevByUrl.get(item.url);
  if (prev?.summary) out.summary = prev.summary;
  else if (llmEnabled) {
    try {
      const s = await summarize(item);
      if (s) out.summary = s;
    } catch (err) {
      console.warn(`Aviso: no se pudo resumir "${item.title}": ${err.message}`);
    }
  }
  items.push(out);
}

const next = { updatedAt: new Date().toISOString().slice(0, 10), items };
const errors = validateNews(next);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
await writeJson(NEWS_PATH, next);
console.log(`news.json actualizado: ${items.length} noticias (${okFeeds}/${feeds.length} feeds, resumen LLM: ${llmEnabled ? 'sí' : 'no'}).`);
