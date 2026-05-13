import type { Metadata } from "next";
import { Source_Serif_4, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import { CookieBanner } from "@/components/site/CookieBanner";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
  "https://xn--planteia-40a.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Planète IA",
    template: "%s - Planète IA",
  },
  description:
    "Un regard éditorial sur l'intelligence artificielle - depuis 2026",
  applicationName: "Planète IA",
  authors: [{ name: "Planète IA" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Planète IA",
    title: "Planète IA",
    description:
      "Un regard éditorial sur l'intelligence artificielle - depuis 2026",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Planète IA",
    description:
      "Un regard éditorial sur l'intelligence artificielle - depuis 2026",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${sourceSerif.variable} ${interTight.variable} ${ibmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
