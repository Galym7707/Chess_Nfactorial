import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const sans = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Code Gambit — шахматы с анализом Stockfish",
  description:
    "Современная шахматная платформа для анализа позиций, игры против движка, партий за одной доской и онлайн-игры по ссылке.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:7860"),
};

export const viewport: Viewport = {
  themeColor: "#07110f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} cg-shell antialiased`}>
        <AppProviders>
          <Header />
          <main className="min-h-[calc(100svh-160px)]">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
