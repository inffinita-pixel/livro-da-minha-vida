import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livro da Minha Vida",
  description: "Transforme memórias em capítulos de livro com cuidado e fidelidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
