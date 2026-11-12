import { useEffect, useState } from 'react';

export interface Deal {
  id: string;
  client: string;
  sector: string;
  type: string;
  date: string;
  description: string;
  url?: string;
}

export interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  summary?: string;
}

interface DealsFile {
  deals: Deal[];
}
interface NewsFile {
  updatedAt?: string;
  items: NewsItem[];
}

type State<T> = { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: T };

function useJson<T>(file: string): State<T> {
  const [state, setState] = useState<State<T>>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}data/${file}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<T>;
      })
      .then((data) => setState({ status: 'ready', data }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error' });
      });
    return () => controller.abort();
  }, [file]);
  return state;
}

export function useDeals() {
  const state = useJson<DealsFile>('deals.json');
  if (state.status !== 'ready') return state;
  const deals = [...state.data.deals].sort((a, b) => b.date.localeCompare(a.date));
  return { status: 'ready' as const, data: deals };
}

export function useNews() {
  return useJson<NewsFile>('news.json');
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function formatMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  if (!y || !m) return ym;
  return capitalize(new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, 1)));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);
}
