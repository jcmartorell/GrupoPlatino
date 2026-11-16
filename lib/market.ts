// Datos en vivo. Se ejecuta SOLO en el servidor (las llaves nunca llegan al navegador).
// Cada función regresa null si algo falla, para que la página nunca se rompa.

import "server-only";

const REVALIDAR = 60 * 60 * 6; // 6 horas
const TIMEOUT_MS = 8000;

export type Indicador = { valor: number; fecha: string; fuente: string };

export type Transaccion = {
  comprador: string;
  objetivo: string;
  fecha: string;
  link?: string;
};

async function getJSON(url: string, headers?: Record<string, string>): Promise<unknown> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", ...headers },
      next: { revalidate: REVALIDAR },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function aNumero(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// ---------- Banxico SIE ----------
// SF43718 = Tipo de cambio FIX (pesos por dólar)
// SF61745 = Tasa objetivo de Banxico (%)
type BanxicoResp = {
  bmx?: { series?: { idSerie?: string; datos?: { fecha?: string; dato?: string }[] }[] };
};

async function banxico(): Promise<{ fix: Indicador | null; tasa: Indicador | null }> {
  const token = process.env.BANXICO_TOKEN;
  if (!token) return { fix: null, tasa: null };

  const data = (await getJSON(
    "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718,SF61745/datos/oportuno",
    { "Bmx-Token": token }
  )) as BanxicoResp | null;

  const series = data?.bmx?.series ?? [];
  const leer = (id: string): Indicador | null => {
    const d = series.find((s) => s.idSerie === id)?.datos?.[0];
    const valor = aNumero(d?.dato);
    if (valor === null || !d?.fecha) return null;
    return { valor, fecha: d.fecha, fuente: "Banxico" };
  };
  return { fix: leer("SF43718"), tasa: leer("SF61745") };
}

// ---------- Respaldo de tipo de cambio sin llave (BCE vía Frankfurter) ----------
type FrankfurterResp = { date?: string; rates?: { MXN?: number } };

async function frankfurter(): Promise<Indicador | null> {
  const data = (await getJSON(
    "https://api.frankfurter.app/latest?from=USD&to=MXN"
  )) as FrankfurterResp | null;
  const valor = aNumero(data?.rates?.MXN);
  if (valor === null || !data?.date) return null;
  // Frankfurter da AAAA-MM-DD; lo pasamos a DD/MM/AAAA como Banxico
  const [a, m, d] = data.date.split("-");
  return { valor, fecha: `${d}/${m}/${a}`, fuente: "BCE" };
}

export async function getIndicadores() {
  const { fix, tasa } = await banxico();
  const tipoCambio = fix ?? (await frankfurter());
  return { tipoCambio, tasa };
}

// ---------- Financial Modeling Prep: M&A recientes ----------
type FmpItem = {
  companyName?: string;
  targetedCompanyName?: string;
  transactionDate?: string;
  link?: string;
  url?: string;
};

export async function getTransaccionesRecientes(limite = 8): Promise<Transaccion[] | null> {
  const key = process.env.FMP_API_KEY;
  if (!key) return null;

  const data = await getJSON(
    `https://financialmodelingprep.com/stable/mergers-acquisitions-latest?page=0&limit=40&apikey=${encodeURIComponent(key)}`
  );
  if (!Array.isArray(data)) return null;

  const vistos = new Set<string>();
  const lista: Transaccion[] = [];
  for (const raw of data as FmpItem[]) {
    const comprador = raw.companyName?.trim();
    const objetivo = raw.targetedCompanyName?.trim();
    const fecha = raw.transactionDate?.slice(0, 10);
    if (!comprador || !objetivo || !fecha) continue;
    const clave = `${comprador}|${objetivo}`;
    if (vistos.has(clave)) continue; // el feed repite anuncios
    vistos.add(clave);
    const link = raw.link ?? raw.url;
    lista.push({ comprador, objetivo, fecha, link: link?.startsWith("http") ? link : undefined });
    if (lista.length >= limite) break;
  }
  return lista.length ? lista : null;
}
