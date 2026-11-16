// Recibe el formulario de contacto y lo envía por correo con Resend (https://resend.com).
// El correo de destino vive SOLO en Vercel (variable CONTACT_TO); nunca aparece en la página.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texto(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  // Bot que llenó el campo oculto: respondemos OK sin enviar nada.
  if (texto(body.sitio, 200)) return Response.json({ ok: true });

  const nombre = texto(body.nombre, 100);
  const empresa = texto(body.empresa, 120);
  const correo = texto(body.correo, 150);
  const telefono = texto(body.telefono, 30);
  const interes = texto(body.interes, 60);
  const mensaje = texto(body.mensaje, 2000);

  if (!nombre || !correo || !interes || !mensaje) {
    return Response.json({ error: "Complete los campos marcados con *." }, { status: 400 });
  }
  if (!EMAIL.test(correo)) {
    return Response.json({ error: "Revise que el correo esté bien escrito." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) {
    console.error("Formulario de contacto: faltan RESEND_API_KEY o CONTACT_TO en Vercel.");
    return Response.json(
      { error: "El formulario no está disponible en este momento. Intente más tarde." },
      { status: 503 }
    );
  }

  const contenido = [
    `Nombre: ${nombre}`,
    `Empresa: ${empresa || "—"}`,
    `Correo: ${correo}`,
    `Teléfono: ${telefono || "—"}`,
    `Interés: ${interes}`,
    "",
    mensaje,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Sitio Grupo Platino <onboarding@resend.dev>",
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        reply_to: correo,
        subject: `Nuevo contacto web: ${interes} — ${nombre}`,
        text: contenido,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error("Resend respondió", res.status, await res.text().catch(() => ""));
      throw new Error();
    }
  } catch {
    return Response.json({ error: "No se pudo enviar el mensaje. Intente de nuevo en unos minutos." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
