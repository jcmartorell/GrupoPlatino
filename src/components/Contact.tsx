import { useState, type FormEvent } from 'react';
import { contact } from '../content';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Nombre: ${f.get('nombre')}`,
      `Empresa: ${f.get('empresa') || '-'}`,
      `Correo: ${f.get('correo')}`,
      '',
      `${f.get('mensaje')}`,
    ].join('\n');
    const subject = `Contacto desde gplatino.com: ${f.get('nombre')}`;
    window.location.href = `mailto:${contact.formEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    'mt-2 block w-full border border-navy-100 bg-white px-4 py-3 text-base text-navy-800 placeholder:text-navy-300 focus:border-navy-800';

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow text-navy-700">Contacto</p>
          <h2 id="contacto-title" className="section-title mt-4">
            Conversemos sobre el siguiente paso de su empresa.
          </h2>
          <p className="mt-5 max-w-md text-navy-800/80">
            Para consultas, llámenos o envíenos un correo. También puede usar el formulario.
          </p>

          <dl className="mt-10 space-y-7 text-sm">
            <div>
              <dt className="eyebrow text-navy-700">Teléfono</dt>
              <dd className="mt-2 text-lg">{contact.phone}</dd>
            </div>
            <div>
              <dt className="eyebrow text-navy-700">Correo</dt>
              <dd className="mt-2 space-y-1 text-lg">
                {contact.emails.map((m) => (
                  <p key={m}>
                    <a href={`mailto:${m}`} className="underline-offset-4 hover:underline">
                      {m}
                    </a>
                  </p>
                ))}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-navy-700">Dirección</dt>
              <dd className="mt-2 text-lg">
                <address className="not-italic leading-relaxed">
                  {contact.address.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </dd>
            </div>
          </dl>
        </div>

        <form onSubmit={onSubmit} className="border border-navy-100 bg-white p-6 sm:p-9" aria-label="Formulario de contacto">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.16em]">
              Nombre
              <input name="nombre" required autoComplete="name" className={field} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em]">
              Empresa
              <input name="empresa" autoComplete="organization" className={field} />
            </label>
          </div>
          <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em]">
            Correo electrónico
            <input name="correo" type="email" required autoComplete="email" className={field} />
          </label>
          <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em]">
            Mensaje
            <textarea name="mensaje" required rows={5} className={field} />
          </label>
          <button type="submit" className="btn mt-8 w-full bg-navy-800 text-white hover:bg-navy-700 sm:w-auto">
            Enviar mensaje
          </button>
          <p className="mt-4 text-xs text-navy-700" role="status">
            {sent
              ? 'Se abrió tu aplicación de correo para enviar el mensaje. ¡Gracias por escribirnos!'
              : 'Se abrirá tu aplicación de correo con el mensaje listo para enviar.'}
          </p>
        </form>
      </div>
    </section>
  );
}
