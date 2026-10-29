import { pillars } from '../content';

export default function About() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <p className="eyebrow text-navy-700">Quiénes somos</p>
            <h2 id="nosotros-title" className="section-title mt-4">
              Visión global,
              <br />
              <span className="font-semibold">compromiso local.</span>
            </h2>
            <div className="mt-6 h-px w-16 bg-navy-800" />
          </div>
          <div className="space-y-5 text-base leading-relaxed text-navy-800/85 sm:text-lg">
            <p>
              Grupo Platino es una banca de inversión boutique ubicada en México, especializada en empresas medianas y
              estructuras familiares.
            </p>
            <p>
              Brindamos soluciones financieras personalizadas en fusiones, adquisiciones y reestructuraciones
              empresariales, con el objetivo de impulsar el crecimiento sostenible de nuestros clientes mediante
              estrategias innovadoras y asesoría estratégica.
            </p>
            <p>
              Creemos en las relaciones a largo plazo basadas en confianza y excelencia. Nuestro equipo guía a empresas
              en crecimiento con soluciones diseñadas para maximizar valor y asegurar un éxito sostenible, con el más
              alto compromiso con los estándares profesionales.
            </p>
          </div>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden bg-navy-100 sm:grid-cols-3">
          {pillars.map((p) => (
            <li key={p.title} className="bg-paper p-7">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-800/75">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
