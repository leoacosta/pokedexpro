import type { Metadata, Viewport } from "next";
import { Chakra_Petch, DM_Sans, Fira_Mono } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  display: "swap",
});

const firaMono = Fira_Mono({
  variable: "--font-fira",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pokémon Team Builder",
  description: "Build and analyse your Pokémon team using PokéAPI",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} ${dmSans.variable} ${firaMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
