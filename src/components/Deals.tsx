import { useEffect, useState } from 'react';
import { useDeals, type DealStats } from '../lib/data';

function IndustryBars({ stats }: { stats: DealStats }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const max = Math.max(...stats.byIndustry.map((d) => d.count), 1);

  return (
    <ul className="space-y-5" aria-label="Transacciones por industria">
      {stats.byIndustry.map((d) => {
        const pct = stats.total > 0 ? Math.round((d.count / stats.total) * 100) : 0;
        return (
          <li key={d.industry}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="font-semibold uppercase tracking-[0.14em] text-white">{d.industry}</span>
              <span className="tabular-nums text-platinum">
                <strong className="font-semibold text-white">{d.count}</strong>
                <span className="ml-2 text-white/55">({pct}%)</span>
              </span>
            </div>
            <div className="mt-2 h-2.5 bg-white/10" aria-hidden="true">
              <div
                className="h-full bg-gradient-to-r from-navy-300 to-platinum transition-[width] duration-1000 ease-out"
                style={{ width: shown ? `${(d.count / max) * 100}%` : '0%' }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function Deals() {
  const deals = useDeals();

  return (
    <section id="transacciones" aria-labelledby="transacciones-title" className="bg-navy-900 py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="eyebrow text-platinum">Transacciones</p>
        <h2 id="transacciones-title" className="section-title mt-4 max-w-2xl">
          Hemos acompañado a empresas en distintos sectores a alcanzar sus metas.
        </h2>
        <p className="mt-5 max-w-2xl text-white/70">
          Nuestra experiencia en cifras. Por confidencialidad, presentamos el resumen de operaciones por industria.
        </p>

        <div className="mt-12" aria-live="polite">
          {deals.status === 'loading' && <p className="text-white/60">Cargando transacciones…</p>}
          {deals.status === 'error' && (
            <p className="border border-white/20 p-6 text-white/80">
              No pudimos cargar las cifras en este momento. Inténtalo de nuevo más tarde.
            </p>
          )}
          {deals.status === 'ready' && (
            <div className="grid gap-12 border border-white/20 bg-white/[0.04] p-8 sm:p-12 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-20">
              <div className="flex flex-col justify-center border-b border-white/15 pb-10 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-12">
                <p className="text-7xl font-light leading-none tracking-tight tabular-nums sm:text-8xl">{deals.data.total}</p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-platinum">
                  Transacciones realizadas
                </p>
              </div>
              <div>
                <h3 className="mb-7 text-xs font-semibold uppercase tracking-[0.24em] text-platinum">Por industria</h3>
                <IndustryBars stats={deals.data} />
              </div>
            </div>
          )}
          {deals.status === 'ready' && deals.data.pendingConfirmation && (
            <p className="mt-4 text-xs text-white/55" role="note">
              Cifras ilustrativas, pendientes de confirmación.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
