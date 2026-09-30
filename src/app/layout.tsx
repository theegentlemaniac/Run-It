import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const displayFont = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-raw",
});

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans-raw",
});

export const metadata: Metadata = {
  title: "Run-It — Find a court. Find a game. Prove it.",
  description:
    "Discover basketball courts, schedule pickup games, and keep live score with Run-It.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${displayFont.variable} ${sansFont.variable}`}
    >
      <body className="flex min-h-full flex-col font-sans animate-fade-in">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
