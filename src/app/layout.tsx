import type { Metadata } from "next";
import { Source_Serif_4, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import { CookieBanner } from "@/components/site/CookieBanner";
import { GoogleAnalytics } from "@/components/site/GoogleAnalytics";
import { AnalyticsTracker } from "@/components/site/AnalyticsTracker";
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

const SITE_TITLE = "Planète IA - L'actualité et l'analyse de l'IA";
const SITE_DESCRIPTION =
  "Décryptages, analyses et actualités sur l'intelligence artificielle : modèles, outils, marché et impacts. Un regard éditorial indépendant.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s - Planète IA",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Planète IA",
  authors: [{ name: "Planète IA" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Planète IA",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
      <body
        className="min-h-full flex flex-col bg-paper text-ink overflow-x-hidden"
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        <AnalyticsTracker />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
