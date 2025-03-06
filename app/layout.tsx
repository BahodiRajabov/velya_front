import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Velya - AI-Powered Instagram DM Management",
  description: "Handle high volumes of Instagram DMs with real AI assistance. Convert conversations into qualified leads automatically at velya.io",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta name="facebook-domain-verification" content="gfcqk37gsma4iaekkkir5ujv43k7jo" />
      </head>
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable}`,
          "min-h-screen bg-base-100 font-sans antialiased"
        )}
      >
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
