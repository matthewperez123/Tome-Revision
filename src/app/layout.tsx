import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Literata, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";

// RUBRIC type system: Fraunces for display/headings, Literata for literary
// reading content, Inter for UI/sans, JetBrains Mono for code/numerals.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
  title: {
    default: "Tome — Read the books that shaped the world",
    template: "%s | Tome",
  },
  description:
    "The gamified platform for the canon of world literature — public-domain classics with AI-guided reading and end-of-chapter Trials.",
  keywords: [
    "classical literature",
    "reading app",
    "public domain books",
    "gamified reading",
  ],
  authors: [{ name: "Tome" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tome",
    title: "Tome — Read the books that shaped the world",
    description:
      "The gamified platform for classical literature. Guided by Virgil.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tome — your digital reading companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tome — Read the books that shaped the world",
    description:
      "The gamified platform for classical literature. Guided by Virgil.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${literata.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="tome-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
