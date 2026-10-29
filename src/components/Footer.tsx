import { asset } from '../lib/asset';

export default function Footer() {
  return (
    <footer className="bg-navy-950 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 sm:flex-row sm:items-center sm:px-8">
        <img src={asset('logo-horizontal-white.png')} alt="Grupo Platino" width={1748} height={551} className="h-10 w-auto" />
        <p className="text-xs leading-relaxed text-white/60">
          © {new Date().getFullYear()} Grupo Platino. Todos los derechos reservados.
          <br />
          Coahuila 117, Depto 205, Roma Norte, Cuauhtémoc, Ciudad de México.
        </p>
      </div>
    </footer>
  );
}
