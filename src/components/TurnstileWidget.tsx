"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type TurnstileWidgetProps = {
  siteKey: string;
  onTokenChange: (token: string) => void;
  onError: () => void;
};

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      theme: "light";
      size: "flexible";
      "response-field": false;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget({
  siteKey,
  onTokenChange,
  onError,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (
      !isReady ||
      !containerRef.current ||
      !window.turnstile ||
      widgetIdRef.current
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onTokenChange,
      "expired-callback": () => {
        onTokenChange("");
        onError();
      },
      "error-callback": () => {
        onTokenChange("");
        onError();
      },
      theme: "light",
      size: "flexible",
      "response-field": false,
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [isReady, onError, onTokenChange, siteKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setIsReady(true)}
        onReady={() => setIsReady(true)}
        onError={() => {
          onTokenChange("");
          onError();
        }}
      />
      <div
        ref={containerRef}
        className="min-h-[65px] w-full overflow-hidden"
        aria-label="Security verification"
      />
    </>
  );
}
