import type { Metadata } from "next";
import "./globals.css";

const faviconSvg = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏷️</text></svg>";

export const metadata: Metadata = {
  title: "🏷️",
  description: "",
  icons: {
    icon: faviconSvg,
    shortcut: faviconSvg,
    apple: faviconSvg,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
