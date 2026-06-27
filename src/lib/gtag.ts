export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export const isGoogleAnalyticsEnabled =
  process.env.NODE_ENV === "production" && Boolean(GA_MEASUREMENT_ID);

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageView(url: string) {
  if (!isGoogleAnalyticsEnabled || !window.gtag) {
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}
