import { DEALS_PATH, NEWS_PATH, readJson, validateDeals, validateNews } from './lib.mjs';

const errors = [
  ...validateDeals(await readJson(DEALS_PATH)).map((e) => `deals.json: ${e}`),
  ...validateNews(await readJson(NEWS_PATH)).map((e) => `news.json: ${e}`),
];

if (errors.length) {
  console.error(errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('Datos válidos (deals.json, news.json).');
