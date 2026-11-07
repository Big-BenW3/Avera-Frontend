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

// Body & Display — Inter Variable 400-700. Clean, technical, high-density sans.
const inter = localFont({
  src: "../public/fonts/Inter-var.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

// Monospace / labels / code — DM Mono latin 400 & 500.
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
  title: "Avera — The Engineering & Product Platform for Builders",
  description: "Spaces, live roadmaps, Git-integrated tasks, and real-time collaboration for technical teams.",
};

const themeInit = `(function(){try{var t=localStorage.getItem('avera-theme');if(t!=='light'){document.documentElement.dataset.theme='dark';}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${dmMono.variable}`}
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
