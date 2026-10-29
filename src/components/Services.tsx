import { services } from '../content';

export default function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="eyebrow text-navy-700">Servicios</p>
        <h2 id="servicios-title" className="section-title mt-4 max-w-2xl">
          Un portafolio integral para las necesidades únicas de cada cliente.
        </h2>

        <ol className="mt-14 grid gap-x-12 gap-y-0 md:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.title} className="border-t border-navy-800/20 py-8">
              <span className="text-xs font-semibold tracking-[0.28em] text-navy-300" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-navy-800/75">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
