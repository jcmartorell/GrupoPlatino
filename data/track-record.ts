// CONFIDENCIAL: este archivo solo se usa en el servidor para calcular conteos.
// Los nombres NUNCA se muestran ni se envían al navegador.
import "server-only";

// Transacciones cerradas (fuente: Presentación corporativa GP 2026, láminas 17-19).
// Se omiten las operaciones "pendientes a cierre". "PF" = inversionista privado.
// "sector" = giro específico de la empresa; "industria" = agrupación que usa la gráfica.

export type Industria = "Salud y farmacéutico" | "Manufactura industrial" | "Servicios y educación" | "Alimentos y restaurantes" | "Automotriz" | "Otros";

export type Transaccion = {
  empresa: string;
  anio: number;
  comprador: string;
  sector: string;
  industria: Industria;
};

export const trackRecord: Transaccion[] = [
  { empresa: "Casa Gallardo", anio: 1979, comprador: "Inversionista privado", sector: "Tienda departamental", industria: "Otros" },
  { empresa: "Chencito", anio: 1981, comprador: "Inversionista privado", sector: "Fábrica de bañeras", industria: "Manufactura industrial" },
  { empresa: "Fries & Fries International de México", anio: 1981, comprador: "Mallinckrodt Chemical (EUA)", sector: "Sabores y aromas", industria: "Alimentos y restaurantes" },
  { empresa: "Cintas y Telas Elásticas", anio: 1982, comprador: "Grupo Promojol", sector: "Cintas elásticas", industria: "Manufactura industrial" },
  { empresa: "Shermor", anio: 1983, comprador: "Inversionista privado", sector: "Inmobiliaria", industria: "Otros" },
  { empresa: "Almacenes García", anio: 1984, comprador: "Tiendas La Parisina", sector: "Tiendas de ropa", industria: "Otros" },
  { empresa: "Auto Color Gallery", anio: 1984, comprador: "Inversionista privado", sector: "Taller automotriz", industria: "Automotriz" },
  { empresa: "Macim", anio: 1984, comprador: "Pillsbury Corporation (EUA)", sector: "Galletas y cosméticos", industria: "Alimentos y restaurantes" },
  { empresa: "De Visy Internacional", anio: 1985, comprador: "Grupo Noyformas", sector: "Decoración de envases", industria: "Manufactura industrial" },
  { empresa: "Decoraciones en Cristal Arozamena", anio: 1985, comprador: "Inversionista privado", sector: "Decoración de envases", industria: "Manufactura industrial" },
  { empresa: "National Rent a Car México", anio: 1985, comprador: "Inversionista privado", sector: "Renta de autos", industria: "Automotriz" },
  { empresa: "Plastiforme", anio: 1985, comprador: "Industrias Resistol", sector: "Acrílicos y casetas telefónicas", industria: "Manufactura industrial" },
  { empresa: "Interlingua", anio: 1986, comprador: "Grupo Promojol", sector: "Escuelas de idiomas", industria: "Servicios y educación" },
  { empresa: "La Nueva Adriática", anio: 1986, comprador: "Inversionista privado", sector: "Fábrica de mallas", industria: "Manufactura industrial" },
  { empresa: "Casa Giffenig", anio: 1987, comprador: "Inversionista privado", sector: "Comercializadora HORECA", industria: "Alimentos y restaurantes" },
  { empresa: "Hulera", anio: 1988, comprador: "Inversionista privado", sector: "Llantas", industria: "Automotriz" },
  { empresa: "Insecticidas y Fungicidas del Bajío", anio: 1988, comprador: "Inversionista privado", sector: "Agroquímicos", industria: "Manufactura industrial" },
  { empresa: "Polial", anio: 1989, comprador: "Inversionista privado", sector: "Serigrafía", industria: "Manufactura industrial" },
  { empresa: "Chromaspectrum", anio: 1989, comprador: "Inversionista privado", sector: "Laboratorio fotográfico", industria: "Servicios y educación" },
  { empresa: "Farm", anio: 1989, comprador: "Promeco (Alemania)", sector: "Medicina veterinaria", industria: "Salud y farmacéutico" },
  { empresa: "Restaurante Capistrano", anio: 1989, comprador: "Restaurantes La Mansión", sector: "Restaurantes", industria: "Alimentos y restaurantes" },
  { empresa: "Frenos Lusac", anio: 1990, comprador: "Echlin Inc. (EUA)", sector: "Refacciones automotrices", industria: "Automotriz" },
  { empresa: "Foto Roma, Foto Tlalpan, Lomas Fotográfico", anio: 1992, comprador: "Chromaspectrum", sector: "Revelado fotográfico", industria: "Servicios y educación" },
  { empresa: "Ediciones P.L.M.", anio: 1993, comprador: "Medical Economics (EUA)", sector: "Editorial científica", industria: "Servicios y educación" },
  { empresa: "Spectrum", anio: 1993, comprador: "Universal Foods (EUA)", sector: "Aditivos alimenticios", industria: "Alimentos y restaurantes" },
  { empresa: "Starco", anio: 1993, comprador: "Inversionista privado", sector: "Iluminación", industria: "Manufactura industrial" },
  { empresa: "Grupo Pega", anio: 1994, comprador: "Inversionista privado", sector: "Pegamentos", industria: "Manufactura industrial" },
  { empresa: "Domino's Pizza en BCN", anio: 1995, comprador: "Inversionista privado", sector: "Restaurantes", industria: "Alimentos y restaurantes" },
  { empresa: "Marketing Services Mexicana", anio: 1995, comprador: "Medical Economics (EUA)", sector: "Servicios farmacéuticos", industria: "Salud y farmacéutico" },
  { empresa: "Granitos de Baja California", anio: 1997, comprador: "Inversionista privado (EUA)", sector: "Laminación de granito", industria: "Manufactura industrial" },
  { empresa: "Grupo Pega", anio: 1997, comprador: "Devcon (EUA)", sector: "Pegamentos", industria: "Manufactura industrial" },
  { empresa: "Línea Beberdem (Searle de México)", anio: 1997, comprador: "Johnson & Johnson (EUA)", sector: "Medicamentos", industria: "Salud y farmacéutico" },
  { empresa: "Mexicana de Resinas", anio: 1997, comprador: "Alpha / Owens Corning", sector: "Resinas", industria: "Manufactura industrial" },
  { empresa: "Automotriz Sol", anio: 1998, comprador: "Inversionista privado", sector: "Agencia automotriz", industria: "Automotriz" },
  { empresa: "Drogueros", anio: 1998, comprador: "Grupo Casa Autrey", sector: "Distribución farmacéutica", industria: "Salud y farmacéutico" },
  { empresa: "Farmacéutica", anio: 1998, comprador: "Arturo Ibarrola", sector: "Material de curación", industria: "Salud y farmacéutico" },
  { empresa: "Grupo Hecai", anio: 1998, comprador: "Elektra", sector: "Tiendas de ropa", industria: "Otros" },
  { empresa: "Farmacias VYR", anio: 1999, comprador: "Drogueros", sector: "Farmacias", industria: "Salud y farmacéutico" },
  { empresa: "Latex", anio: 1999, comprador: "Vopak (Holanda)", sector: "Terminales de almacenamiento", industria: "Servicios y educación" },
  { empresa: "Farmacias", anio: 2000, comprador: "COFAR", sector: "Farmacias", industria: "Salud y farmacéutico" },
  { empresa: "Senoko", anio: 2000, comprador: "Novartis / Gerber", sector: "Farmacéutico", industria: "Salud y farmacéutico" },
  { empresa: "Cuinba", anio: 2007, comprador: "Empresa de EUA", sector: "Piel automotriz", industria: "Automotriz" },
  { empresa: "Farmacias Plus del Golfo", anio: 2008, comprador: "Farmacias del Ahorro", sector: "Farmacias", industria: "Salud y farmacéutico" },
  { empresa: "Farmacias del Ahorro", anio: 2010, comprador: "Inversionista privado", sector: "Farmacias", industria: "Salud y farmacéutico" },
  { empresa: "Universidad Latinoamericana de Quintana Roo", anio: 2010, comprador: "Tresalia", sector: "Educación", industria: "Servicios y educación" },
  { empresa: "IPM", anio: 2011, comprador: "Inversionista privado", sector: "Guarderías", industria: "Servicios y educación" },
  { empresa: "Dankel Medical", anio: 2012, comprador: "SI Group", sector: "Farmacéutico", industria: "Salud y farmacéutico" },
  { empresa: "DSS", anio: 2014, comprador: "Hildebrando", sector: "Tecnologías de información", industria: "Otros" },
  { empresa: "Grupo Sahuayo", anio: 2015, comprador: "Axis", sector: "Distribución", industria: "Otros" },
  { empresa: "Farmatodo", anio: 2016, comprador: "Inversionista privado", sector: "Farmacias", industria: "Salud y farmacéutico" },
  { empresa: "Farmacias de México", anio: 2016, comprador: "GRFP", sector: "Farmacias", industria: "Salud y farmacéutico" },
  { empresa: "Farmacias GEMS", anio: 2016, comprador: "GRFP", sector: "Farmacias", industria: "Salud y farmacéutico" },
  { empresa: "Farmacias C&M", anio: 2016, comprador: "GRFP", sector: "Farmacias", industria: "Salud y farmacéutico" },
  { empresa: "Farmacias San Francisco de Asís", anio: 2016, comprador: "GRFP", sector: "Farmacias", industria: "Salud y farmacéutico" },
  { empresa: "Farmacias Santa Cruz", anio: 2016, comprador: "GRFP", sector: "Farmacias", industria: "Salud y farmacéutico" },
  { empresa: "Biodist", anio: 2017, comprador: "Inversionista privado", sector: "Sector salud", industria: "Salud y farmacéutico" },
  { empresa: "Grupo Tecnodiagnóstica", anio: 2017, comprador: "GRFP", sector: "Sector salud", industria: "Salud y farmacéutico" },
  { empresa: "Papel y Color", anio: 2018, comprador: "Inversionista privado", sector: "Imprenta", industria: "Manufactura industrial" },
  { empresa: "Comando", anio: 2018, comprador: "Empresa de EUA", sector: "Asesoría en siniestros", industria: "Servicios y educación" },
  { empresa: "Wee Company", anio: 2020, comprador: "Grupo Platino", sector: "Insurtech", industria: "Otros" },
  { empresa: "IPM", anio: 2021, comprador: "Gueca Capital", sector: "Guarderías", industria: "Servicios y educación" },
  { empresa: "Wee Company", anio: 2023, comprador: "Global Excel Management", sector: "Insurtech", industria: "Otros" },
  { empresa: "Tecnodiagnóstica", anio: 2024, comprador: "Dicipa", sector: "Sector salud", industria: "Salud y farmacéutico" },
  { empresa: "Clínica Animal del Puente", anio: 2026, comprador: "Confidencial", sector: "Salud animal", industria: "Salud y farmacéutico" },
  { empresa: "Fidem", anio: 2026, comprador: "Confidencial", sector: "Tecnologías de información", industria: "Otros" },
];
