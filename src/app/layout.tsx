import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Maa Shoolini Mela Solan 2026 | Historic 3-Day Festival",
  description: "Celebrate the historic 3-day spiritual and cultural festival of Maa Shoolini Devi in Solan, Himachal Pradesh from June 26 to June 28, 2026. Join the Shobha Yatra, cultural nights, traditional sports, and devotional community wall.",
  keywords: ["Maa Shoolini Mela", "Solan Festival 2026", "Himachal Pradesh Festivals", "Shoolini Temple", "Shobha Yatra Solan", "Himachal Culture"],
  openGraph: {
    title: "Maa Shoolini Mela Solan 2026",
    description: "Experience the grand 3-day celebration of Maa Shoolini Devi from June 26 to June 28, 2026.",
    type: "website",
    locale: "en_IN",
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
      className={`${cinzel.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="bg-stone-50 text-stone-950 font-sans antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}


