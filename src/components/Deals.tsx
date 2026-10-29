import { formatMonth, useDeals, type Deal } from '../lib/data';

function Tombstone({ deal, featured }: { deal: Deal; featured: boolean }) {
  return (
    <article
      className={`flex flex-col justify-between border border-white/20 bg-white/[0.04] p-8 text-center ${
        featured ? 'min-h-[22rem] sm:col-span-2 lg:col-span-3 lg:min-h-[18rem]' : 'min-h-[20rem]'
      }`}
    >
      <div>
        {featured && <p className="eyebrow mb-6 text-platinum">Última transacción</p>}
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-navy-300">{deal.sector}</p>
        <div className="mx-auto my-5 h-px w-10 bg-platinum/60" />
        <h3 className={`font-semibold leading-snug ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{deal.client}</h3>
      </div>
      <div className="mt-8">
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/70">{deal.description}</p>
        <div className="mx-auto my-5 h-px w-10 bg-platinum/60" />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-platinum">{deal.type}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/60">
          <time dateTime={deal.date}>{formatMonth(deal.date)}</time>
        </p>
        {deal.url && (
          <a href={deal.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] underline underline-offset-4">
            Ver detalle
          </a>
        )}
      </div>
    </article>
  );
}

export default function Deals() {
  const deals = useDeals();

  return (
    <section id="transacciones" aria-labelledby="transacciones-title" className="bg-navy-900 py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="eyebrow text-platinum">Transacciones recientes</p>
        <h2 id="transacciones-title" className="section-title mt-4 max-w-2xl">
          Hemos acompañado a empresas en distintos sectores a alcanzar sus metas.
        </h2>
        <p className="mt-5 max-w-2xl text-white/70">
          Estas operaciones reflejan nuestro enfoque: cercanía con el cliente, rigor técnico y confidencialidad.
        </p>

        <div className="mt-12" aria-live="polite">
          {deals.status === 'loading' && <p className="text-white/60">Cargando transacciones…</p>}
          {deals.status === 'error' && (
            <p className="border border-white/20 p-6 text-white/80">
              No pudimos cargar las transacciones en este momento. Escríbenos a contacto@gplatino.com.
            </p>
          )}
          {deals.status === 'ready' && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {deals.data.map((d, i) => (
                <Tombstone key={d.id} deal={d} featured={i === 0} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
