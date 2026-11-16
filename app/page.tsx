import Image from "next/image";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import TrackRecord, { type ConteoIndustria } from "@/components/TrackRecord";
import ContactForm from "@/components/ContactForm";
import Etiqueta from "@/components/Etiqueta";
import { LogoHorizontal, Monograma } from "@/components/Logo";
import { mercadoMX } from "@/data/mercado-mx";
import { trackRecord } from "@/data/track-record";
import { getIndicadores, getTransaccionesRecientes } from "@/lib/market";

// Liga de Calendly para agendar la primera llamada.
const CALENDLY = "https://calendly.com/jcmartorell-gplatino/grupo-platino-discovery";

// La página se regenera en el servidor cada 6 horas con datos frescos.
export const revalidate = 21600;

const servicios = [
  {
    n: "01",
    t: "Fusiones y adquisiciones",
    d: "Diseño y ejecución de estrategias de compra y venta de empresas, enfocadas en maximizar el valor y minimizar los riesgos.",
  },
  {
    n: "02",
    t: "Reestructuración y emisión de capital",
    d: "Optimización de la estructura de capital, incluyendo emisión de deuda y/o capital para fortalecer la posición financiera.",
  },
  {
    n: "03",
    t: "Levantamiento de fondos",
    d: "Acceso a capital a través de nuestra red de inversionistas, con estructuras alineadas a las metas de crecimiento.",
  },
  {
    n: "04",
    t: "Consultoría estratégica y financiera",
    d: "Decisiones estratégicas basadas en un análisis profundo del mercado y de la situación particular de cada empresa.",
  },
  {
    n: "05",
    t: "Valuación y due diligence",
    d: "Valuaciones por flujos descontados y metodologías comparables, con due diligence exhaustiva legal, operativa y financiera.",
  },
];

const fases = [
  { f: "Fase I", t: "Diagnóstico y estrategia", d: "Plan de negocios, valuación y definición de la estrategia de la transacción.", dur: "" },
  { f: "Fase II", t: "Documentación y candidatos", d: "Teaser, memorándum de información y lista de potenciales compradores o inversionistas.", dur: "" },
  { f: "Fase III", t: "Marketing confidencial", d: "Presentación a candidatos, reuniones con la dirección y gestión de expresiones de interés.", dur: "" },
  { f: "Fase IV", t: "Negociación y cierre", d: "Due diligence, manifestaciones y garantías, contratos definitivos y estructura fiscal eficiente.", dur: "" },
];

const fmtMdd = (n: number) =>
  n >= 1000
    ? `USD ${(n / 1000).toLocaleString("es-MX", { maximumFractionDigits: 1 })} mil M`
    : `USD ${n.toLocaleString("es-MX")} M`;

const fmtFecha = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) return iso;
  return new Date(Date.UTC(a, m - 1, d)).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
};

const Signo = ({ v }: { v: number }) => (
  <span className={`delta ${v > 0 ? "up" : v < 0 ? "down" : ""}`}>
    {v > 0 ? "▲" : v < 0 ? "▼" : "■"} {v > 0 ? "+" : ""}
    {v}%
  </span>
);

export default async function Home() {
  const [{ tipoCambio, tasa }, deals] = await Promise.all([getIndicadores(), getTransaccionesRecientes(8)]);

  const anioInicio = Math.min(...trackRecord.map((t) => t.anio));
  const anios = new Date().getFullYear() - anioInicio;
  const totalTx = trackRecord.length;
  const totalSectores = new Set(trackRecord.map((t) => t.sector)).size;
  const internacionales = trackRecord.filter((t) => /\((EUA|Alemania|Holanda)\)|EUA/.test(t.comprador)).length;

  // Solo conteos por industria; "Otros" siempre al final
  const conteo = new Map<string, number>();
  for (const t of trackRecord) conteo.set(t.industria, (conteo.get(t.industria) ?? 0) + 1);
  const porIndustria: ConteoIndustria[] = [...conteo.entries()]
    .map(([nombre, n]) => ({ nombre, n }))
    .sort((a, b) => (a.nombre === "Otros" ? 1 : 0) - (b.nombre === "Otros" ? 1 : 0) || b.n - a.n);

  const m = mercadoMX;
  const maxSeg = Math.max(...m.segmentos.map((s) => s.operaciones));

  // Elementos de la cinta (solo los que tienen dato)
  const cinta: { k: string; v: string; s?: string }[] = [];
  if (tipoCambio)
    cinta.push({
      k: "USD/MXN",
      v: tipoCambio.valor.toLocaleString("es-MX", { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
      s: `${tipoCambio.fuente} · ${tipoCambio.fecha}`,
    });
  if (tasa)
    cinta.push({
      k: "Tasa objetivo Banxico",
      v: `${tasa.valor.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
      s: tasa.fecha,
    });
  cinta.push({ k: "M&A México", v: fmtMdd(m.acumulado.importeMdd), s: m.periodo });
  cinta.push({ k: "Operaciones México", v: m.acumulado.operaciones.toLocaleString("es-MX"), s: `${m.acumulado.varOperaciones}% a/a` });
  cinta.push({ k: "Private Equity México", v: `${m.segmentos[2].operaciones} op.`, s: fmtMdd(m.segmentos[2].importeMdd) });
  cinta.push({ k: "Venture Capital México", v: `${m.segmentos[1].operaciones} op.`, s: fmtMdd(m.segmentos[1].importeMdd) });

  return (
    <>
      <Nav />
      <Reveal />

      <main id="inicio">
        {/* ================= HERO ================= */}
        <section className="hero">
          <Image src="/img/hero.webp" alt="" fill priority sizes="100vw" className="hero__img" />
          <div className="hero__veil" />
          <div className="hero__shard hero__shard--gold" />
          <div className="hero__shard hero__shard--navy" />

          <div className="container hero__content">
            <Etiqueta className="hero__etiqueta" items={["Banca de inversión boutique", "México", `Desde ${anioInicio}`]} />
            <h1 className="hero__title">
              Más de 40 años liderando fusiones y adquisiciones
              <br />
              para empresas <em>privadas y familiares</em>
            </h1>
            <p className="hero__lead">
              Asesoramos a empresas del Middle Market y familias empresarias en fusiones, adquisiciones,
              reestructuras y levantamiento de capital, de la estrategia al cierre.
            </p>
            <div className="hero__cta">
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn btn--gold">
                Agenda una conversación confidencial
              </a>
              <a href="#mercado" className="btn btn--ghost">
                Ver el mercado hoy
              </a>
            </div>
          </div>

          {/* Cinta de mercado en movimiento */}
          <div className="ticker" aria-label="Indicadores de mercado">
            <div className="ticker__track">
              {[0, 1].map((dup) => (
                <ul key={dup} className="ticker__group" aria-hidden={dup === 1}>
                  {cinta.map((c) => (
                    <li key={c.k} className="ticker__item">
                      <span className="ticker__k">{c.k}</span>
                      <span className="ticker__v tabular">{c.v}</span>
                      {c.s && <span className="ticker__s">{c.s}</span>}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CIFRAS ================= */}
        <section className="stats">
          <div className="container stats__grid">
            <div className="stat" data-reveal>
              <span className="stat__n">
                <Counter to={anios} />
              </span>
              <span className="stat__l">años asesorando transacciones</span>
            </div>
            <div className="stat" data-reveal>
              <span className="stat__n">
                <Counter to={totalTx} suffix="+" />
              </span>
              <span className="stat__l">transacciones cerradas</span>
            </div>
            <div className="stat" data-reveal>
              <span className="stat__n">
                <Counter to={totalSectores} />
              </span>
              <span className="stat__l">giros de negocio distintos</span>
            </div>
            <div className="stat" data-reveal>
              <span className="stat__n">
                <Counter to={internacionales} />
              </span>
              <span className="stat__l">operaciones con compradores internacionales</span>
            </div>
          </div>
        </section>

        {/* ================= FIRMA ================= */}
        <section id="firma" className="section firma">
          <div className="container firma__grid">
            <div className="firma__text" data-reveal>
              <Etiqueta items={["Quiénes somos"]} />
              <h2 className="sec-title">Visión global, compromiso local</h2>
              <div className="divider" />
              <p>
                Somos una banca de inversión boutique especializada en M&amp;A e inversiones patrimoniales.
                Combinamos una comprensión profunda del mercado mexicano con una red de inversionistas locales e
                internacionales.
              </p>
              <p>
                Nuestro propósito es salvaguardar el patrimonio empresarial y familiar mediante estrategias
                específicas de compra y venta, reestructura y financiamiento de empresas en marcha. Vamos más allá
                de la transacción: entendemos las aspiraciones de cada empresario.
              </p>
            </div>
            <div className="firma__media" data-reveal>
              <div className="photo photo--tall">
                <Image src="/img/oficina.webp" alt="Equipo de trabajo en oficina" fill sizes="(max-width: 900px) 100vw, 45vw" />
              </div>
              <div className="firma__badge">
                <Monograma className="firma__mono" />
                <span>
                  Confidencialidad
                  <br />
                  en cada etapa
                </span>
              </div>
            </div>
          </div>

          <div className="container pilares">
            {[
              { t: "Enfoque personalizado", d: "Cada cliente es único. Adaptamos cada solución a sus necesidades y a su estructura familiar." },
              { t: "Red global", d: "Contactos e inversionistas en México y el extranjero que abren puertas y oportunidades únicas." },
              { t: "Excelencia y ética", d: "Transparencia en cada decisión y los más altos estándares profesionales." },
            ].map((p, i) => (
              <article className="pilar" key={p.t} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ================= SERVICIOS ================= */}
        <section id="servicios" className="section servicios">
          <div className="container">
            <div className="sec-head" data-reveal>
              <div>
                <Etiqueta items={["Servicios"]} />
                <h2 className="sec-title">Un portafolio integral para cada etapa del capital</h2>
              </div>
              <p className="sec-intro">
                Acompañamos a empresarios y accionistas en cada decisión sobre el capital de su empresa.
              </p>
            </div>
            <ul className="svc__list">
              {servicios.map((s) => (
                <li key={s.n} className="svc" data-reveal>
                  <h3 className="svc__t">{s.t}</h3>
                  <p className="svc__d">{s.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= MERCADO ================= */}
        <section id="mercado" className="section mercado">
          <div className="mercado__shard" />
          <div className="container">
            <div className="sec-head" data-reveal>
              <div>
                <Etiqueta items={["Inteligencia de mercado"]} />
                <h2 className="sec-title">El mercado de M&amp;A en México, en cifras</h2>
              </div>
              <p className="sec-intro">
                {m.periodo}. Datos de {m.fuente}, actualizados trimestralmente.
              </p>
            </div>

            <div className="kpis">
              <div className="kpi kpi--hero" data-reveal>
                <span className="kpi__l">Valor transaccionado (millones de dólares)</span>
                <span className="kpi__n">
                  <Counter to={m.acumulado.importeMdd} />
                  <span className="kpi__u">MDD</span>
                </span>
                <Signo v={m.acumulado.varImporte} />
                <span className="kpi__s">vs. mismo periodo {m.anioAnterior.anio}</span>
              </div>
              <div className="kpi" data-reveal>
                <span className="kpi__l">Operaciones</span>
                <span className="kpi__n">
                  <Counter to={m.acumulado.operaciones} />
                </span>
                <Signo v={m.acumulado.varOperaciones} />
              </div>
              <div className="kpi" data-reveal>
                <span className="kpi__l">Inversión desde {m.inbound.pais}</span>
                <span className="kpi__n">
                  <Counter to={m.inbound.operaciones} />
                  <span className="kpi__u">operaciones</span>
                </span>
                <span className="kpi__s">{fmtMdd(m.inbound.importeMdd)} · principal inversionista extranjero</span>
              </div>
              <div className="kpi" data-reveal>
                <span className="kpi__l">Año completo {m.anioAnterior.anio}</span>
                <span className="kpi__n">
                  <Counter to={m.anioAnterior.importeMdd} />
                  <span className="kpi__u">MDD</span>
                </span>
                <span className="kpi__s">{m.anioAnterior.operaciones} operaciones</span>
              </div>
            </div>

            <div className="mercado__grid">
              <div className="panel" data-reveal>
                <h3 className="panel__t">Por tipo de operación</h3>
                <ul className="bars">
                  {m.segmentos.map((s) => (
                    <li key={s.nombre} className="bars__row">
                      <div className="bars__top">
                        <span>{s.nombre}</span>
                        <span className="tabular">
                          {s.operaciones} op. · {fmtMdd(s.importeMdd)}
                        </span>
                      </div>
                      <div className="bars__track">
                        <span className="bars__fill" style={{ ["--w" as string]: `${(s.operaciones / maxSeg) * 100}%` }} />
                      </div>
                      <Signo v={s.variacion} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel" data-reveal>
                <h3 className="panel__t">Sectores más activos</h3>
                <ul className="sectores">
                  {m.sectores.map((s, i) => (
                    <li key={s.nombre}>
                      <span className="sectores__rank">0{i + 1}</span>
                      <span className="sectores__name">{s.nombre}</span>
                      <span className="sectores__n tabular">{s.operaciones} op.</span>
                      <Signo v={s.variacion} />
                    </li>
                  ))}
                </ul>
                <p className="panel__note">
                  Fuente:{" "}
                  <a href={m.fuenteUrl} target="_blank" rel="noopener noreferrer">
                    {m.fuente}, {m.periodo}
                  </a>
                </p>
              </div>
            </div>

            {deals && (
              <div className="feed" data-reveal>
                <div className="feed__head">
                  <h3 className="panel__t">
                    <span className="live-dot" /> Transacciones recientes en el mundo
                  </h3>
                  <span className="feed__src">Anuncios ante la SEC · Financial Modeling Prep</span>
                </div>
                <ul className="feed__list">
                  {deals.map((d, i) => (
                    <li key={`${d.comprador}-${d.objetivo}-${i}`} className="feed__item">
                      <span className="feed__date tabular">{fmtFecha(d.fecha)}</span>
                      <span className="feed__deal">
                        <strong>{d.comprador}</strong>
                        <span className="feed__arrow">adquiere</span>
                        <strong>{d.objetivo}</strong>
                      </span>
                      {d.link && (
                        <a className="feed__link" href={d.link} target="_blank" rel="noopener noreferrer" aria-label="Ver documento">
                          ↗
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* ================= PROCESO ================= */}
        <section id="proceso" className="section proceso">
          <div className="container">
            <div className="sec-head" data-reveal>
              <div>
                <Etiqueta items={["Cómo trabajamos"]} />
                <h2 className="sec-title">Un proceso secuencial y confidencial</h2>
              </div>
              <p className="sec-intro">Cuatro fases, de la estrategia al cierre de la transacción.</p>
            </div>
            <ol className="fases">
              {fases.map((f, i) => (
                <li key={f.f} className="fase" data-reveal style={{ transitionDelay: `${i * 100}ms` }}>
                  <span className="fase__f">{f.f}</span>
                  <h3 className="fase__t">{f.t}</h3>
                  <p className="fase__d">{f.d}</p>
                  {f.dur && <span className="fase__dur">{f.dur}</span>}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= TRAYECTORIA ================= */}
        <section id="trayectoria" className="section trayectoria">
          <div className="container">
            <div className="sec-head" data-reveal>
              <div>
                <Etiqueta items={["Trayectoria"]} />
                <h2 className="sec-title">Operaciones cerradas por industria</h2>
              </div>
              <p className="sec-intro">Transacciones asesoradas por Grupo Platino desde {anioInicio}.</p>
            </div>
            <div data-reveal>
              <TrackRecord industrias={porIndustria} />
            </div>
          </div>
        </section>

        {/* ================= CONTACTO ================= */}
        <section id="contacto" className="section contacto">
          <div className="contacto__bg">
            <Image src="/img/analisis.webp" alt="" fill sizes="100vw" />
          </div>
          <div className="container contacto__grid">
            <div data-reveal>
              <Etiqueta items={["Contacto"]} />
              <h2 className="sec-title">¿Evalúa vender, comprar o capitalizar su empresa?</h2>
              <p className="contacto__lead">
                La primera conversación es confidencial y sin compromiso. Agende una llamada directamente o déjenos
                sus datos y le responderemos a la brevedad.
              </p>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn btn--gold contacto__cal">
                Agendar una llamada
              </a>
              <a
                className="contacto__in"
                href="https://www.linkedin.com/company/grupo-platino/about/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Síguenos en LinkedIn ↗
              </a>
            </div>
            <div data-reveal>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <LogoHorizontal className="footer__logo" />
          <p>
            © {new Date().getFullYear()} Grupo Platino. Todos los derechos reservados.
            <br />
            <span className="footer__fine">
              Las cifras de mercado son informativas y provienen de fuentes públicas citadas; no constituyen
              recomendación de inversión.
            </span>
          </p>
        </div>
      </footer>
    </>
  );
}
