import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eventora — Buat Undangan Digital Elegan untuk Semua Acara",
  description:
    "Buat undangan digital online untuk pernikahan, ulang tahun, khitanan, wisuda, dan acara lainnya. 12+ tema premium, RSVP digital, countdown, galeri foto, dan banyak fitur lainnya.",
  keywords: [
    "undangan digital",
    "undangan online",
    "undangan pernikahan digital",
    "buat undangan online",
    "eventora",
  ],
  openGraph: {
    title: "Eventora — Undangan Digital Premium",
    description:
      "Platform undangan digital dengan 12+ tema premium. Buat undangan untuk pernikahan, ulang tahun, khitanan dan acara lainnya dalam 5 menit.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
