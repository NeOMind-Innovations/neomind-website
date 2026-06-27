"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type TurnstileWidgetProps = {
  siteKey: string;
  onTokenChange: (token: string) => void;
  onError: (message: string) => void;
  onDevelopmentFallback: () => void;
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

const turnstileLoadError =
  "Security verification could not load. Please refresh and try again.";
const turnstileTimeoutError =
  "Security check could not load. Please refresh and try again.";
const isProduction = process.env.NODE_ENV === "production";

export function TurnstileWidget({
  siteKey,
  onTokenChange,
  onError,
  onDevelopmentFallback,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const hasTokenRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [widgetStatus, setWidgetStatus] = useState<
    "loading" | "verified" | "error" | "skipped"
  >("loading");
  const [widgetError, setWidgetError] = useState("");

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (hasTokenRef.current) {
        return;
      }

      onTokenChange("");

      if (isProduction) {
        setWidgetStatus("error");
        setWidgetError(turnstileTimeoutError);
        onError(turnstileTimeoutError);
        return;
      }

      setWidgetStatus("skipped");
      setWidgetError("");
      onDevelopmentFallback();
    }, 8_000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onDevelopmentFallback, onError, onTokenChange]);

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
      callback: (token) => {
        hasTokenRef.current = true;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setWidgetStatus("verified");
        setWidgetError("");
        onTokenChange(token);
      },
      "expired-callback": () => {
        const message =
          "Security verification expired. Please complete it again.";
        setWidgetStatus("error");
        setWidgetError(message);
        onTokenChange("");
        onError(message);
      },
      "error-callback": () => {
        setWidgetStatus("error");
        setWidgetError(turnstileLoadError);
        onTokenChange("");
        onError(turnstileLoadError);
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
          setWidgetStatus("error");
          setWidgetError(turnstileLoadError);
          onError(turnstileLoadError);
        }}
      />
      {widgetStatus === "loading" ? (
        <p className="mb-2 text-sm text-slate-600" role="status">
          Verifying security check...
        </p>
      ) : null}
      {widgetStatus === "error" ? (
        <p className="mb-2 text-sm text-red-700" role="alert">
          {widgetError}
        </p>
      ) : null}
      {widgetStatus === "skipped" ? (
        <p className="mb-2 text-sm text-slate-600" role="status">
          Security check skipped in development.
        </p>
      ) : null}
      <div
        ref={containerRef}
        className="min-h-[65px] w-full overflow-hidden"
        aria-label="Security verification"
      />
    </>
  );
}
