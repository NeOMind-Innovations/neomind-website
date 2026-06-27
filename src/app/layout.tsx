import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import {
  absoluteUrl,
  companyName,
  defaultDescription,
  defaultTitle,
  ogImage,
  seoKeywords,
  siteName,
  siteUrl,
  twitterImage,
} from "@/lib/seo";
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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: companyName,
      alternateName: siteName,
      url: siteUrl,
      logo: absoluteUrl("/neomind-logo.png"),
      description: defaultDescription,
      foundingOrganization: {
        "@type": "Organization",
        name: companyName,
      },
      sameAs: [],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "business inquiries",
          areaServed: "IN",
          availableLanguage: ["en"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: siteName,
      url: siteUrl,
      description: defaultDescription,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareCompany",
      "@id": absoluteUrl("/#software-company"),
      name: companyName,
      alternateName: siteName,
      url: siteUrl,
      logo: absoluteUrl("/neomind-logo.png"),
      description: defaultDescription,
      areaServed: ["India", "Global"],
      serviceType: [
        "AI Solutions",
        "SaaS Product Development",
        "Business Automation",
        "Cloud Applications",
        "Mobile App Development",
        "Custom Software Development",
        "Digital Transformation",
      ],
      knowsAbout: [
        "AI",
        "SaaS",
        "Automation",
        "Cloud Applications",
        "Mobile Apps",
        "Custom Software",
        "Digital Transformation",
      ],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: seoKeywords,
  authors: [{ name: companyName, url: siteUrl }],
  creator: siteName,
  publisher: companyName,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "NeOMind social sharing image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    creator: "@neomind",
    images: [twitterImage],
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <GoogleAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
