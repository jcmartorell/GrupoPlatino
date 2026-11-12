import { formatDate, useNews } from '../lib/data';

export default function News() {
  const news = useNews();

  return (
    <section id="noticias" aria-labelledby="noticias-title" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-navy-700">Noticias de M&amp;A</p>
            <h2 id="noticias-title" className="section-title mt-4 max-w-xl">
              El pulso de las fusiones y adquisiciones en México y Latinoamérica.
            </h2>
          </div>
          {news.status === 'ready' && news.data.updatedAt && (
            <p className="text-xs uppercase tracking-[0.18em] text-navy-700">
              Actualizado: <time dateTime={news.data.updatedAt}>{formatDate(news.data.updatedAt)}</time>
            </p>
          )}
        </div>

        <div className="mt-12" aria-live="polite">
          {news.status === 'loading' && <p className="text-navy-700">Cargando noticias…</p>}
          {news.status === 'error' && <p className="text-navy-700">No pudimos cargar las noticias en este momento.</p>}
          {news.status === 'ready' && news.data.items.length === 0 && (
            <p className="text-navy-700">Pronto publicaremos las noticias más recientes del sector.</p>
          )}
          {news.status === 'ready' && news.data.items.length > 0 && (
            <ul className="divide-y divide-navy-100 border-y border-navy-100">
              {news.data.items.map((n) => (
                <li key={n.url}>
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid gap-2 py-6 sm:grid-cols-[11rem_1fr] sm:gap-8"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700">
                      <span className="block">{n.source}</span>
                      <time dateTime={n.date} className="mt-1 block font-normal text-navy-300">
                        {formatDate(n.date)}
                      </time>
                    </p>
                    <div>
                      <h3 className="text-lg font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">
                        {n.title}
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </h3>
                      {n.summary && <p className="mt-2 text-sm leading-relaxed text-navy-800/75">{n.summary}</p>}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
