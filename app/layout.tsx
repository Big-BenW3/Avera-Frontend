import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AveraProviders } from "@/lib/query";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/Toast";

// Fonts are self-hosted from /public/fonts (woff2) so the production build has
// zero network dependency on Google Fonts at build time — the `next/font/google`
// loader is flaky under CI/offline and crashes the webpack build. Local fonts are
// baked in at compile time and preloaded, which is also faster in production.

// Display / headings — a warm, editorial serif. Instrument Serif ships a
// single weight (400); the "600" look comes from size and colour, not bold.
const instrumentSerif = localFont({
  src: "../public/fonts/InstrumentSerif-latin.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-instrument",
  preload: true,
});

// Body / UI — geometric humanist sans. Variable font: one file, weights 200-800.
const plusJakarta = localFont({
  src: "../public/fonts/PlusJakartaSans-latin.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-jakarta",
  preload: true,
});

// Monospace / labels — used sparingly for eyebrows, metrics and timestamps.
// DM Mono ships as static instances, so we register both weights we use.
const dmMono = localFont({
  src: [
    { path: "../public/fonts/DMMono-400-latin.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/DMMono-500-latin.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-dm",
  preload: true,
});

export const metadata: Metadata = {
  title: "Avera — Find your people. Build what matters.",
  description: "A purpose-led home for ideas, collaboration, and launches.",
};

const themeInit = `(function(){try{var t=localStorage.getItem('avera-theme');if(t==='dark'){document.documentElement.dataset.theme='dark';}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${plusJakarta.variable} ${dmMono.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <AveraProviders>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </AveraProviders>
      </body>
    </html>
  );
}
