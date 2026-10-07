import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./home-redesign.css";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEUSTAND — Rückbau · Wohnungsaufbereitung · Objektservice",
  description:
    "NEUSTAND steht für Rückbau, Wohnungsaufbereitung und Objektservice.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>{children}</body>
    </html>
  );
}
