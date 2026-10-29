import { asset } from '../lib/asset';
import { formatMonth, useDeals } from '../lib/data';

export default function Hero() {
  const deals = useDeals();
  const latest = deals.status === 'ready' ? deals.data[0] : undefined;

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white"
    >
      <img
        src={asset('monogram-white.png')}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[7%] top-1/2 -z-10 hidden h-[78%] -translate-y-1/2 opacity-[0.07] md:block"
      />
      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-16 pt-32 sm:px-8">
        <p className="eyebrow text-platinum">Banca de inversión boutique · México</p>
        <h1 id="hero-title" className="mt-6 max-w-3xl text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Soluciones financieras para empresas que quieren <span className="font-semibold">crecer con visión</span>.
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          Asesoramos a empresas medianas y estructuras familiares en fusiones, adquisiciones y reestructuraciones.
          Visión global, compromiso local.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href="#contacto" className="btn bg-white text-navy-800 hover:bg-platinum">
            Agenda una conversación
          </a>
          <a href="#transacciones" className="btn border border-white/40 text-white hover:border-white hover:bg-white/10">
            Ver transacciones
          </a>
        </div>

        {latest && (
          <a
            href="#transacciones"
            className="mt-16 flex max-w-xl flex-col gap-1 border-l-2 border-platinum/70 pl-5 transition-colors hover:border-white"
          >
            <span className="eyebrow text-platinum">Última transacción</span>
            <span className="text-lg font-semibold">{latest.client}</span>
            <span className="text-sm text-white/65">
              {latest.type} · {formatMonth(latest.date)}
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
