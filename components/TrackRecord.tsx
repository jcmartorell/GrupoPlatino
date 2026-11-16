// Gráfica de operaciones cerradas por industria.
// Recibe SOLO los conteos (nunca nombres de empresas ni compradores).

export type ConteoIndustria = { nombre: string; n: number };

export default function TrackRecord({ industrias }: { industrias: ConteoIndustria[] }) {
  const max = Math.max(...industrias.map((i) => i.n), 1);

  return (
    <div className="tr">
      <ul className="tr__chart" aria-label="Operaciones por industria">
        {industrias.map((i) => (
          <li key={i.nombre} className="tr__row">
            <span className="tr__row-name">{i.nombre}</span>
            <span className="tr__row-track">
              <span className="tr__row-fill" style={{ ["--w" as string]: `${(i.n / max) * 100}%` }} />
            </span>
            <span className="tr__row-n tabular">{i.n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
