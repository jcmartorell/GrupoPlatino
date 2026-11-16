// Datos del mercado transaccional mexicano.
// Fuente: TTR Data. ACTUALIZAR cada trimestre editando solo los números de este archivo.

export const mercadoMX = {
  fuente: "TTR Data",
  fuenteUrl:
    "https://blog.ttrdata.com/informe-trimestral-sobre-el-mercado-transaccional-mexicano-3t26/",
  periodo: "Acumulado al 3T 2026",

  acumulado: {
    operaciones: 200,
    importeMdd: 14549, // millones de dólares
    varOperaciones: -12, // % vs. mismo periodo 2025
    varImporte: -25,
  },

  anioAnterior: {
    anio: 2025,
    operaciones: 307,
    importeMdd: 32500,
    fuenteUrl:
      "https://www.ttrdata.com/en/publications/market-reports/monthly-report-mexico/Mexico-Annual-Report-2025/2346",
  },

  // Tipos de operación (acumulado 3T26)
  segmentos: [
    { nombre: "Adquisición de activos", operaciones: 49, importeMdd: 2803, variacion: 17 },
    { nombre: "Venture Capital", operaciones: 45, importeMdd: 1246, variacion: -21 },
    { nombre: "Private Equity", operaciones: 18, importeMdd: 3379, variacion: -25 },
  ],

  // Sectores más activos por número de operaciones
  sectores: [
    { nombre: "Inmobiliario", operaciones: 31, variacion: 48 },
    { nombre: "Software para industrias específicas", operaciones: 29, variacion: 0 },
  ],

  // Inversión extranjera en México
  inbound: { pais: "Estados Unidos", operaciones: 48, importeMdd: 5287 },
} as const;
