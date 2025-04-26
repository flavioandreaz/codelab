import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "@/styles/globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeLab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${nunito.variable} antialiased font-sans`}>
        <h1>LAYOUT</h1>
        {children}
      </body>
    </html>
  );
}
