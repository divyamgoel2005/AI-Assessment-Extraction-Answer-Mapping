import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VedaAI — AI Assessment Extraction & Answer Mapping",
  description: "AI Assessment Extraction and Student Answer Mapping Toolkit for Teachers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-orange-100 selection:text-orange-900 bg-[#ECEEF0] min-h-screen text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
