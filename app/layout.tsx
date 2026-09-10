import type { Metadata } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import "./globals.css";
import { AveraProviders } from "@/lib/query";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/Toast";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
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
      className={`${manrope.variable} ${dmSans.variable}`}
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
