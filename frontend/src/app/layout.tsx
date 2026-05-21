import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 👇 Importamos a nossa Navbar
import Navbar from "@/components/Navbar"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vasco Analytics",
  description: "Análise de dados completa do Vasco da Gama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black">
        {/* 👇 Injetamos a Navbar aqui para ficar fixa no topo */}
        <Navbar />
        
        {/* O conteúdo das páginas vai renderizar aqui dentro */}
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}