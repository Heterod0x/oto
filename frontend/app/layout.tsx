import { BottomNavigation } from "@/app/components/bottom-navigation";
import { WalletProvider } from "@/app/contexts/wallet-context";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import InstallPrompt from "./components/install-prompt";
import { ThemeProvider } from "./components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "音声録音アプリ",
  description: "音声を録音して分析するアプリケーション",
  manifest: "/manifest.json",
  generator: "v0.dev",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Oto App",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1 pb-16">{children}</main>
              <BottomNavigation />
              <InstallPrompt />
            </div>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
