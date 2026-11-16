"use client";

import { useEffect, useState } from "react";
import { LogoHorizontal } from "./Logo";

const links = [
  { href: "#firma", label: "Firma" },
  { href: "#servicios", label: "Servicios" },
  { href: "#mercado", label: "Mercado" },
  { href: "#proceso", label: "Proceso" },
  { href: "#trayectoria", label: "Trayectoria" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`nav ${solid || open ? "nav--solid" : ""}`}>
      <div className="container nav__inner">
        <a href="#inicio" className="nav__logo" aria-label="Grupo Platino, inicio">
          <LogoHorizontal className="nav__wordmark" />
        </a>
        <nav className={`nav__links ${open ? "is-open" : ""}`} aria-label="Principal">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contacto" className="btn btn--gold btn--sm" onClick={() => setOpen(false)}>
            Contacto
          </a>
        </nav>
        <button
          className="nav__toggle"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
