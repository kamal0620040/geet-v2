import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://geet.vercel.app"),
  title: {
    default: "Geet — Neon Music Player",
    template: "%s · Geet",
  },
  description:
    "Geet is a neon music player with a live visualizer. Stream and search songs, playlists, and artists, tune the equalizer, and enjoy ambient gradients.",
  applicationName: "Geet",
  keywords: [
    "music player",
    "neon",
    "visualizer",
    "equalizer",
    "streaming music",
    "music search",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://geet.vercel.app",
    siteName: "Geet",
    title: "Geet — Neon Music Player",
    description:
      "Stream and search music with a live neon visualizer and equalizer.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geet — Neon Music Player",
    description:
      "Stream and search music with a live neon visualizer and equalizer.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
