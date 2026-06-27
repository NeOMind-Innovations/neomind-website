"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const isProduction = process.env.NODE_ENV === "production";

const serviceOptions = [
  "AI Solutions",
  "Custom Software Development",
  "Mobile App Development",
  "SaaS Product Development",
  "AI Helpdesk Solutions",
  "Business Automation",
  "Cloud Applications",
  "Digital Transformation",
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  message: string;
};

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  serviceInterest: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [turnstileDevFallback, setTurnstileDevFallback] = useState(false);

  const isFormValid = useMemo(
    () =>
      formState.name.trim().length > 0 &&
      emailPattern.test(formState.email.trim()) &&
      formState.serviceInterest.trim().length > 0 &&
      formState.message.trim().length > 0,
    [formState],
  );
  const isTurnstileRequired =
    isProduction || Boolean(turnstileSiteKey && !turnstileDevFallback);
  const isSubmitDisabled =
    !isFormValid ||
    isSubmitting ||
    (isTurnstileRequired && !turnstileToken);

  function updateField(field: keyof FormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setStatusMessage("");
    }
  }

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
    if (token) {
      setTurnstileDevFallback(false);
      setStatus("idle");
      setStatusMessage("");
    }
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken("");
  }, []);

  const handleTurnstileDevelopmentFallback = useCallback(() => {
    setTurnstileToken("");
    setTurnstileDevFallback(true);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      setStatus("error");
      setStatusMessage(
        "Please complete all required fields with a valid email address.",
      );
      return;
    }

    if (isTurnstileRequired && !turnstileToken) {
      setStatus("error");
      setStatusMessage(
        "Please complete the security verification before submitting.",
      );
      return;
    }

    if (!turnstileSiteKey && isProduction) {
      setStatus("error");
      setStatusMessage(
        "Security verification is unavailable. Please try again later.",
      );
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          turnstileToken,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to submit your inquiry.");
      }

      setFormState(initialFormState);
      setTurnstileToken("");
      setTurnstileDevFallback(false);
      setTurnstileResetKey((current) => current + 1);
      setStatus("success");
      setStatusMessage(
        result.message ?? "Your inquiry has been received. NeOMind will follow up soon.",
      );
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your inquiry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-7"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-charcoal">
          Name
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
            placeholder="Your name"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-charcoal">
          Email
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
            placeholder="you@company.com"
            required
          />
        </label>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-charcoal">
          Phone
          <input
            type="tel"
            name="phone"
            value={formState.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
            placeholder="+91 98765 43210"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-charcoal">
          Company
          <input
            type="text"
            name="company"
            value={formState.company}
            onChange={(event) => updateField("company", event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
            placeholder="Company name"
          />
        </label>
      </div>
      <label className="mt-5 grid gap-2 text-sm font-medium text-charcoal">
        Service interest
        <select
          name="serviceInterest"
          value={formState.serviceInterest}
          onChange={(event) => updateField("serviceInterest", event.target.value)}
          className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
          required
        >
          <option value="">Select a service</option>
          {serviceOptions.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-5 grid gap-2 text-sm font-medium text-charcoal">
        What can we build together?
        <textarea
          name="message"
          rows={5}
          value={formState.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
          placeholder="Tell us about your product, workflow, or transformation goal."
          required
        />
      </label>
      {turnstileSiteKey ? (
        <div className="mt-5">
          <TurnstileWidget
            key={turnstileResetKey}
            siteKey={turnstileSiteKey}
            onTokenChange={handleTurnstileToken}
            onError={handleTurnstileError}
            onDevelopmentFallback={handleTurnstileDevelopmentFallback}
          />
        </div>
      ) : !isProduction ? (
        <p className="mt-5 text-xs text-slate-500" role="note">
          Security verification is disabled locally because
          NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured.
        </p>
      ) : (
        <p className="mt-5 text-sm text-red-700" role="alert">
          Security verification is unavailable. Please try again later.
        </p>
      )}
      {statusMessage ? (
        <div
          className={`mt-5 rounded-md border px-4 py-3 text-sm ${
            status === "success"
              ? "border-teal/30 bg-teal/10 text-teal"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role={status === "error" ? "alert" : "status"}
        >
          {statusMessage}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="mt-6 w-full rounded-md bg-primary-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-deep-navy hover:shadow-blue-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:hover:translate-y-0"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
