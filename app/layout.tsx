import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://joaoromao.dev"),
  title: "João Romão — Data Analyst & Developer",
  description:
    "Portfolio of João Romão — a hybrid Data + Dev profile from Belém, Brazil. Python automation, real-time dashboards and full-stack Next.js. Open to remote / relocation.",
  keywords: [
    "João Romão",
    "Data Analyst",
    "Developer",
    "Python automation",
    "Next.js",
    "Belém",
    "remote",
  ],
  authors: [{ name: "João Romão" }],
  openGraph: {
    title: "João Romão — Data Analyst & Developer",
    description:
      "A living dashboard about me: real-time data, automation and full-stack work. Open to remote / relocation.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
