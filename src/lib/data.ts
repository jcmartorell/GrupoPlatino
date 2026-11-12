import { useEffect, useState } from 'react';

export interface IndustryCount {
  industry: string;
  count: number;
}

export interface DealStats {
  total: number;
  byIndustry: IndustryCount[];
  pendingConfirmation: boolean;
  updatedAt?: string;
}

export interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  summary?: string;
}

interface DealsFile {
  total: number;
  byIndustry: IndustryCount[];
  pendingConfirmation?: boolean;
  updatedAt?: string;
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

export function useDeals(): State<DealStats> {
  const state = useJson<DealsFile>('deals.json');
  if (state.status !== 'ready') return state;
  const { total, byIndustry, pendingConfirmation, updatedAt } = state.data;
  return {
    status: 'ready',
    data: {
      total,
      byIndustry: [...byIndustry].sort((a, b) => b.count - a.count),
      pendingConfirmation: Boolean(pendingConfirmation),
      updatedAt,
    },
  };
}

export function useNews() {
  return useJson<NewsFile>('news.json');
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);
}
