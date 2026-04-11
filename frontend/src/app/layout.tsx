import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sakumimidb.example.com";

export const metadata: Metadata = {
  title: "SakumimiDB",
  description: "櫻坂46のWEBラジオ「さくみみ」の検索用アプリケーション",
  
  // OGP設定
  openGraph: {
    title: "SakumimiDB",
    description:
      "櫻坂46のWEBラジオ「さくみみ」の検索用アプリケーション",
    url: baseUrl,
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "SakumimiDB - 櫻坂46 さくみみ検索アプリケーション",
        type: "image/png",
      },
    ],
  },
  
  // Twitter Card設定
  twitter: {
    card: "summary_large_image",
    title: "SakumimiDB",
    description:
      "櫻坂46のWEBラジオ「さくみみ」の検索用アプリケーション。",
    images: [`${baseUrl}/logo.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
