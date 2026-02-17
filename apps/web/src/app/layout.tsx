import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LocationModal from "@/components/layout/LocationModal";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Bake N' Shake — Premium Bakery & Cafe",
    template: "%s | Bake N' Shake",
  },
  description:
    "Premium bakery and cafe chain in Bhopal, Indore & Gwalior. Order fresh cakes, cookies, pastries, shakes and more online. Delivering happiness since 2015.",
  keywords: [
    "bakery",
    "cake",
    "Bhopal",
    "Indore",
    "Gwalior",
    "online cake delivery",
    "cookies",
    "pastries",
    "Bake N Shake",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Bake N' Shake",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-body antialiased`}
      >
        <LocationModal />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
