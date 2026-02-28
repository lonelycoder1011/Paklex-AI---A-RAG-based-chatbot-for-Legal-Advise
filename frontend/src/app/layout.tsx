import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PakLex AI — Pakistan Legal Intelligence",
  description: "AI-powered legal assistant for Pakistan laws. Find relevant statutes, case precedents, and professional legal opinions instantly.",
  keywords: "Pakistan law, legal AI, PPC, constitution, legal assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise-overlay min-h-screen bg-[#0a0f0d]">{children}</body>
    </html>
  );
}
