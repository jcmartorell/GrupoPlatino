import { calendlyUrl } from '../content';
import CalendlyEmbed from './Calendly';

export default function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow text-navy-700">Contacto</p>
            <h2 id="contacto-title" className="section-title mt-4 max-w-2xl">
              Conversemos sobre el siguiente paso de su empresa.
            </h2>
            <p className="mt-5 max-w-xl text-navy-800/80">
              Agende una llamada de descubrimiento: elija el día y la hora que mejor le convenga.
            </p>
          </div>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn shrink-0 bg-navy-800 text-white hover:bg-navy-700"
          >
            Agendar llamada
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>

        <div id="agendar" className="mt-12">
          <CalendlyEmbed />
        </div>
      </div>
    </section>
  );
}
