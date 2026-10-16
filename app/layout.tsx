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

// Display / headings — Newsreader. A variable serif with a real optical-size
// axis, so the 72px hero and the 20px card title come from the same family but
// render differently: large sizes get tighter spacing and finer hairlines, small
// sizes get sturdier stems. Instrument Serif (previous) shipped weight 400
// only and had no italic, which is why headings read thin and the hero <em>
// was faux-italic.
const newsreader = localFont({
  src: [
    { path: "../public/fonts/Newsreader-var.woff2", weight: "300 600", style: "normal" },
    { path: "../public/fonts/Newsreader-var-italic.woff2", weight: "300 500", style: "italic" },
  ],
  display: "swap",
  variable: "--font-newsreader",
  preload: true,
});

// Body / UI — Inter. Variable 400-700. Replaces Plus Jakarta Sans, whose very
// geometric bowls and wide apertures read soft and slightly clumsy at the 11-13px
// sizes this UI uses most.
const inter = localFont({
  src: "../public/fonts/Inter-var.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
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
      className={`${newsreader.variable} ${inter.variable} ${dmMono.variable}`}
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
