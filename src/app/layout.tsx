import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { FarmerBottomNav } from "@/components/layout/FarmerBottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriConnect Maharashtra | कृषी जोड महाराष्ट्र",
  description:
    "Government of Maharashtra Agri Market Intelligence & Direct Transaction Platform. Real-time APMC mandi prices, sell/hold advisory, FPO lot pooling, digital lot passports, and 7-step escrow deal tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased text-stone-900 bg-[#faf8f5] selection:bg-emerald-200 selection:text-emerald-900 flex flex-col min-h-screen">
        <AppProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-8">{children}</main>
          <FarmerBottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
