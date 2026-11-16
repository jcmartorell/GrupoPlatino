// Etiqueta de sección con la barra vertical del logotipo "GRUPO | PLATINO".
// Un elemento: barra + texto. Varios: separados por la barra, igual que el logo.

export default function Etiqueta({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <p className={`etiqueta ${items.length > 1 ? "etiqueta--multi" : ""} ${className}`}>
      {items.map((t, i) => (
        <span key={t} className="etiqueta__item">
          {(i > 0 || items.length === 1) && <span className="etiqueta__bar" aria-hidden="true" />}
          {t}
        </span>
      ))}
    </p>
  );
}
