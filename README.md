# Grupo Platino — sitio web

Landing page de [gplatino.com](https://www.gplatino.com) en Next.js, lista para Vercel.

## Publicar en Vercel (una sola vez)

1. Entra a [vercel.com/new](https://vercel.com/new) e importa el repo `jcmartorell/GrupoPlatino`.
2. No cambies nada de la configuración (Vercel detecta Next.js solo).
3. En **Settings → Environment Variables** agrega las llaves (opcionales, ver abajo).
4. **Deploy**. Cada cambio que se suba al repo se publica automáticamente.

## Datos en vivo (variables de entorno)

| Variable | Qué muestra | Dónde se obtiene | Si falta |
|---|---|---|---|
| `BANXICO_TOKEN` | Tipo de cambio FIX y tasa objetivo | [Banxico SIE (gratis)](https://www.banxico.org.mx/SieAPIRest/service/v1/token) | Tipo de cambio del BCE; la tasa no aparece |
| `FMP_API_KEY` | Feed de transacciones M&A recientes | [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs) | El feed no aparece |
| `RESEND_API_KEY` | Envío del formulario de contacto | [Resend (gratis)](https://resend.com/api-keys) | El formulario avisa "no disponible" |
| `CONTACT_TO` | Correo(s) que reciben los mensajes del formulario | — | Igual que arriba |
| `CONTACT_FROM` | Remitente (opcional; requiere dominio verificado en Resend) | — | Usa `onboarding@resend.dev` |

> Sin dominio verificado, Resend solo entrega al correo con el que se creó la cuenta de Resend. Para enviar a cualquier correo, verifica `gplatino.com` en Resend → Domains.

Los datos se refrescan cada 6 horas. Si una API falla, la página sigue funcionando sin esa sección.

## Actualizar cifras del mercado mexicano (cada trimestre)

Edita solo los números de `data/mercado-mx.ts` con el nuevo informe de TTR Data.

## Actualizar trayectoria

Agrega la operación en `data/track-record.ts` con su `industria` (una de las 6 de la lista al inicio del archivo; "Otros" agrupa comercio, tecnología e inmobiliario). La gráfica y los contadores se recalculan solos.

## Trabajar en local

```bash
npm install
npm run dev   # http://localhost:3000
```
