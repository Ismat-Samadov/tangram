import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tangram — Ancient Puzzle, Modern Style",
  description:
    "A beautiful neon-themed Tangram puzzle game. Arrange 7 geometric pieces to match the target silhouette. Multiple difficulty levels, smooth animations, touch-friendly.",
  keywords: ["tangram", "puzzle", "game", "geometric", "brain teaser"],
  openGraph: {
    title: "Tangram Puzzle Game",
    description: "Ancient puzzle, modern style. Play the classic 7-piece tangram game.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="h-full bg-gray-950 antialiased">
        {children}
      </body>
    </html>
  );
}
