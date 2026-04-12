import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CarScout - Your Canadian Used Car Buying Companion",
    template: "%s | CarScout",
  },
  description:
    "Save, compare, and research used cars from AutoTrader, Kijiji, Facebook Marketplace and more. The complete guide to buying a used car in Canada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
