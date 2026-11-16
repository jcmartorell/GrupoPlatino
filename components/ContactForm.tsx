"use client";

import { useState } from "react";

const intereses = [
  "Vender mi empresa",
  "Comprar una empresa",
  "Levantar capital",
  "Reestructura financiera",
  "Valuación",
  "Otro",
];

type Estado = "idle" | "enviando" | "ok" | "error";

export default function ContactForm() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensajeError, setMensajeError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form).entries());
    setEstado("enviando");
    setMensajeError("");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "No se pudo enviar el mensaje.");
      setEstado("ok");
      form.reset();
    } catch (err) {
      setEstado("error");
      setMensajeError(err instanceof Error ? err.message : "No se pudo enviar el mensaje.");
    }
  }

  if (estado === "ok") {
    return (
      <div className="form form--ok" role="status">
        <h3>Gracias, recibimos su mensaje.</h3>
        <p>Le contactaremos a la brevedad.</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEstado("idle")}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__row">
        <label className="field">
          <span>Nombre *</span>
          <input id="cf-nombre" name="nombre" type="text" required maxLength={100} autoComplete="name" />
        </label>
        <label className="field">
          <span>Empresa</span>
          <input id="cf-empresa" name="empresa" type="text" maxLength={120} autoComplete="organization" />
        </label>
      </div>
      <div className="form__row">
        <label className="field">
          <span>Correo *</span>
          <input id="cf-correo" name="correo" type="email" required maxLength={150} autoComplete="email" />
        </label>
        <label className="field">
          <span>Teléfono</span>
          <input id="cf-telefono" name="telefono" type="tel" maxLength={30} autoComplete="tel" />
        </label>
      </div>
      <label className="field">
        <span>¿En qué podemos ayudarle? *</span>
        <select id="cf-interes" name="interes" required defaultValue="">
          <option value="" disabled>
            Seleccione una opción
          </option>
          {intereses.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Mensaje *</span>
        <textarea id="cf-mensaje" name="mensaje" required rows={4} maxLength={2000} />
      </label>
      {/* Campo trampa para bots: las personas no lo ven */}
      <input className="form__hp" name="sitio" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="form__foot">
        <button type="submit" className="btn btn--gold" disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
        </button>
        <span className="form__note">Su información es confidencial.</span>
      </div>
      {estado === "error" && (
        <p className="form__error" role="alert">
          {mensajeError}
        </p>
      )}
    </form>
  );
}
