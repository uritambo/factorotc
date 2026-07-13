import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Factor OTC — Mentoria i formació financera",
  description: "Seguiment de cartera d'inversió en temps real, notícies financeres en català i mentoria personalitzada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="min-h-screen bg-[#0A0B0D] text-[#F2F2F0] font-sans antialiased">{children}</body>
    </html>
  );
}
