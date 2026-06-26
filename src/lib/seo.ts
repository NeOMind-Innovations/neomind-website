import type { Metadata } from "next";

export const siteUrl = "https://neomindinnovations.in";
export const siteName = "NeOMind";
export const companyName = "THE NEOMIND INNOVATIONS LLP";
export const defaultTitle =
  "NeOMind | Transforming Ideas into Intelligent Solutions";
export const defaultDescription =
  "NeOMind empowers businesses through Artificial Intelligence, innovative software, SaaS products, and digital transformation.";
export const seoKeywords = [
  "NeOMind",
  "THE NEOMIND INNOVATIONS LLP",
  "AI solutions",
  "custom software development",
  "mobile app development",
  "SaaS product development",
  "AI helpdesk solutions",
  "business automation",
  "cloud applications",
  "digital transformation",
];
export const ogImage = "/og-image.png";
export const twitterImage = "/twitter-image.png";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} social sharing image`,
        },
      ],
    },
    twitter: {
      title: `${title} | ${siteName}`,
      description,
      images: [twitterImage],
    },
  };
}
