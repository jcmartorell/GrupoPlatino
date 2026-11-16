import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Montserrat: tipografía oficial de la marca (logotipo y manual de identidad).
const montserrat = localFont({
  src: "./fonts/Montserrat-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-brand",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const descripcion =
  "Banca de inversión boutique en México especializada en fusiones y adquisiciones, reestructuras y levantamiento de capital para el Middle Market y empresas familiares. Desde 1979.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gplatino.com"),
  title: "Grupo Platino | Banca de inversión boutique · M&A en México",
  description: descripcion,
  openGraph: {
    title: "Grupo Platino",
    description: descripcion,
    url: "https://www.gplatino.com",
    siteName: "Grupo Platino",
    locale: "es_MX",
    type: "website",
    images: [{ url: "/img/hero.webp", width: 2000, height: 1126 }],
  },
  twitter: { card: "summary_large_image", title: "Grupo Platino", description: descripcion },
};

export const viewport: Viewport = { themeColor: "#14273F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={montserrat.variable}>
      <head>
        {/* Marca que hay JS para activar animaciones; sin JS todo se ve normal */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
