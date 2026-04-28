import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "./providers";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Slay Gambit — шахматы с анализом Stockfish",
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
      <body className="cg-shell antialiased">
        <AppProviders>
          <Header />
          <main className="min-h-[calc(100svh-160px)]">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
