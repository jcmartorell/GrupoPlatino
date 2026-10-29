import { useEffect, useState } from 'react';
import { asset } from '../lib/asset';

const links = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#transacciones', label: 'Transacciones' },
  { href: '#noticias', label: 'Noticias' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-white/95 shadow-[0_1px_0_rgba(37,49,79,0.08)] backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <a href="#inicio" aria-label="Grupo Platino, ir al inicio" className="block">
          <img
            src={asset(solid ? 'logo-horizontal-navy.png' : 'logo-horizontal-white.png')}
            alt="Grupo Platino"
            width={1748}
            height={551}
            className="h-9 w-auto sm:h-11"
          />
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                    solid ? 'text-navy-800 hover:text-navy-700' : 'text-white/85 hover:text-white'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={`-mr-2 p-2 md:hidden ${solid ? 'text-navy-800' : 'text-white'}`}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Menú móvil" className="border-t border-navy-100 bg-white md:hidden">
          <ul className="mx-auto max-w-6xl px-5 py-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-navy-100/70 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-navy-800 last:border-0"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
