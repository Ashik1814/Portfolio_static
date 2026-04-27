import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AetherCanvas from "@/components/aether-background";

/**
 * Inter — A high-contrast, modern Sans-Serif font perfect for
 * cinematic tech aesthetics and UI/UX portfolios.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * SEO Metadata — Perfect Meta Tags for Title, Description, OpenGraph, and Twitter.
 * Optimised for a UI/UX Designer & Front-End Developer portfolio.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://alexchen.dev"),
  title: "Alex Chen — UI/UX Designer & Front-End Developer Portfolio",
  description:
    "Crafting digital experiences. Portfolio of Alex Chen — Senior UI/UX Designer and Front-End Developer specializing in interactive interfaces, design systems, and immersive 3D web.",
  keywords: [
    "UI/UX Designer",
    "Front-End Developer",
    "Portfolio",
    "React",
    "Next.js",
    "TypeScript",
    "Three.js",
    "Design Systems",
    "Web Development",
    "Alex Chen",
  ],
  authors: [{ name: "Alex Chen", url: "https://alexchen.dev" }],
  creator: "Alex Chen",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alexchen.dev",
    siteName: "Alex Chen Portfolio",
    title: "Alex Chen — UI/UX Designer & Front-End Developer",
    description:
      "Crafting digital experiences. Specializing in interactive interfaces, design systems, and immersive 3D web.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alex Chen — UI/UX Designer & Front-End Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Chen — UI/UX Designer & Front-End Developer",
    description:
      "Crafting digital experiences. Specializing in interactive interfaces, design systems, and immersive 3D web.",
    images: ["/og-image.png"],
    creator: "@alexchen",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased text-white`}
      >
        {/* Global Aether Flow Three.js Background */}
        <AetherCanvas />
        <div className="relative z-0 flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
