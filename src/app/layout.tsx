import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://neomind.in"),
  title: {
    default: "NeOMind | Transforming Ideas into Intelligent Solutions",
    template: "%s | NeOMind",
  },
  description:
    "NeOMind empowers businesses through Artificial Intelligence, innovative software, SaaS products, and digital transformation.",
  keywords: [
    "NeOMind",
    "THE NEOMIND INNOVATIONS LLP",
    "AI solutions",
    "custom software development",
    "SaaS product development",
    "digital transformation",
  ],
  openGraph: {
    title: "NeOMind | Transforming Ideas into Intelligent Solutions",
    description:
      "Artificial Intelligence, innovative software, and digital transformation for modern businesses.",
    siteName: "NeOMind",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
