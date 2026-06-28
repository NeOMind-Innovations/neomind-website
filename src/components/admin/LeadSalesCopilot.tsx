"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Clock3,
  Copy,
  FileText,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Send,
  Sparkles,
  Target,
} from "lucide-react";

type LeadAiInsight = {
  id: string;
  inquiry_id: string;
  lead_temperature: "hot" | "warm" | "cold";
  lead_score: number;
  summary: string;
  suggested_service: string;
  estimated_value: string;
  recommended_next_step: string;
  suggested_reply: string;
  proposal_outline: string;
  generated_at: string;
  updated_at: string;
};

type ProposalArtifact = {
  executive_summary: string;
  customer_requirements: string[];
  proposed_solution: string;
  deliverables: string[];
  timeline: string;
  commercial_section: string;
  next_steps: string[];
};

type ReplyArtifact = {
  subject: string;
  body: string;
};

type RecommendationArtifact = {
  best_communication_channel: string;
  expected_budget_range: string;
  decision_maker_level: string;
  potential_risks: string[];
  probability_of_closure: number;
  cross_sell_opportunity: string;
  confidence: number;
  buying_intent: number;
};

type CopilotMemory = {
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    message: string;
    created_at: string;
  }>;
  timeline: Array<{
    id: string;
    label: string;
    detail: string;
    created_at: string;
  }>;
  artifacts: {
    proposal: ProposalArtifact | null;
    reply: ReplyArtifact | null;
    recommendations: RecommendationArtifact | null;
  };
};

type LeadSalesCopilotProps = {
  lead: {
    id: string;
    name: string;
    company: string | null;
    service_interest: string | null;
    message: string;
    ai_insight: LeadAiInsight | null;
  };
  onInsightUpdated: (insight: LeadAiInsight) => void;
};

const emptyMemory: CopilotMemory = {
  messages: [],
  timeline: [],
  artifacts: {
    proposal: null,
    reply: null,
    recommendations: null,
  },
};

const suggestedQuestions = [
  "What should I quote?",
  "How should I approach this customer?",
  "What objections might arise?",
  "What features should I highlight?",
];

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function getScoreColor(score: number) {
  if (score >= 80) return "#16a34a";
  if (score >= 50) return "#eab308";
  return "#dc2626";
}

function getTemperatureLabel(temperature: string) {
  if (temperature === "hot") return "🔥 Hot";
  if (temperature === "cold") return "🔵 Cold";
  return "🟡 Warm";
}

function proposalToText(proposal: ProposalArtifact) {
  return [
    "EXECUTIVE SUMMARY",
    proposal.executive_summary,
    "",
    "CUSTOMER REQUIREMENTS",
    ...proposal.customer_requirements.map((item) => `• ${item}`),
    "",
    "PROPOSED SOLUTION",
    proposal.proposed_solution,
    "",
    "DELIVERABLES",
    ...proposal.deliverables.map((item) => `• ${item}`),
    "",
    "TIMELINE",
    proposal.timeline,
    "",
    "COMMERCIAL SECTION",
    proposal.commercial_section,
    "",
    "NEXT STEPS",
    ...proposal.next_steps.map((item) => `• ${item}`),
  ].join("\n");
}

function replyToText(reply: ReplyArtifact) {
  return `Subject: ${reply.subject}\n\n${reply.body}`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading AI Sales Copilot">
      <div className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5">
      <div className="flex items-center gap-2">
        <span className="text-primary-blue">{icon}</span>
        <h3 className="text-sm font-bold text-charcoal dark:text-white">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

export function LeadSalesCopilot({
  lead,
  onInsightUpdated,
}: LeadSalesCopilotProps) {
  const [memory, setMemory] = useState<CopilotMemory>(emptyMemory);
  const [isLoadingMemory, setIsLoadingMemory] = useState(true);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const loadMemory = useCallback(async () => {
    setIsLoadingMemory(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/leads/copilot?inquiryId=${encodeURIComponent(lead.id)}`,
        { cache: "no-store" },
      );
      const result = (await response.json()) as {
        memory?: CopilotMemory;
        error?: string;
      };

      if (!response.ok || !result.memory) {
        throw new Error(result.error ?? "Unable to load copilot memory.");
      }

      setMemory(result.memory);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load copilot memory.",
      );
    } finally {
      setIsLoadingMemory(false);
    }
  }, [lead.id]);

  useEffect(() => {
    setMemory(emptyMemory);
    setChatInput("");
    void loadMemory();
  }, [loadMemory]);

  async function runAction(
    action: "chat" | "proposal" | "reply" | "recommendations",
    message?: string,
  ) {
    if (activeAction) return;

    setActiveAction(action);
    setError("");

    try {
      const response = await fetch("/api/admin/leads/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: lead.id,
          action,
          message,
        }),
      });
      const result = (await response.json()) as {
        memory?: CopilotMemory;
        error?: string;
      };

      if (!response.ok || !result.memory) {
        throw new Error(result.error ?? "AI Sales Copilot request failed.");
      }

      setMemory(result.memory);
      if (action === "chat") setChatInput("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "AI Sales Copilot request failed.",
      );
    } finally {
      setActiveAction(null);
    }
  }

  async function generateInsight() {
    if (activeAction) return;

    setActiveAction("insight");
    setError("");

    try {
      const response = await fetch("/api/admin/leads/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId: lead.id }),
      });
      const result = (await response.json()) as {
        insight?: LeadAiInsight;
        error?: string;
      };

      if (!response.ok || !result.insight) {
        throw new Error(result.error ?? "AI insight generation failed.");
      }

      onInsightUpdated(result.insight);
      await loadMemory();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "AI insight generation failed.",
      );
    } finally {
      setActiveAction(null);
    }
  }

  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setError("Copy failed. Please select and copy the text manually.");
    }
  }

  function submitChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = chatInput.trim();
    if (question) void runAction("chat", question);
  }

  const insight = lead.ai_insight;
  const recommendations = memory.artifacts.recommendations;
  const score = clampPercentage(insight?.lead_score ?? 0);
  const scoreColor = getScoreColor(score);
  const confidence =
    recommendations?.confidence ?? (insight ? Math.min(92, 68 + score / 4) : 0);
  const buyingIntent = recommendations?.buying_intent ?? score;
  const proposal = memory.artifacts.proposal;
  const reply = memory.artifacts.reply;
  const isBusy = activeAction !== null;
  const insightCompleteness = useMemo(
    () =>
      insight
        ? [
            insight.summary,
            insight.suggested_service,
            insight.estimated_value,
            insight.recommended_next_step,
          ].filter(Boolean).length
        : 0,
    [insight],
  );

  return (
    <section className="mt-7 space-y-5 rounded-2xl border border-violet-200 bg-slate-50 p-4 dark:border-violet-900 dark:bg-slate-950 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles
              size={19}
              className="text-violet-600"
              aria-hidden="true"
            />
            <h2 className="text-base font-bold text-charcoal dark:text-white">
              AI Sales Copilot
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Qualification, recommendations, proposals, replies, and contextual
            sales guidance.
          </p>
        </div>
        <button
          type="button"
          onClick={generateInsight}
          disabled={isBusy}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-wait disabled:bg-violet-300"
        >
          {activeAction === "insight" ? (
            <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles size={15} aria-hidden="true" />
          )}
          {insight ? "Refresh Lead Insight" : "Generate Lead Insight"}
        </button>
      </div>

      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {isLoadingMemory ? <LoadingSkeleton /> : null}

      {insight ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div
                className="grid h-20 w-20 shrink-0 place-items-center rounded-full p-2"
                style={{
                  background: `conic-gradient(${scoreColor} ${score * 3.6}deg, #e2e8f0 0deg)`,
                }}
                aria-label={`Lead score ${score} out of 100`}
              >
                <div className="grid h-full w-full place-items-center rounded-full bg-white dark:bg-slate-900">
                  <span className="text-xl font-bold text-charcoal dark:text-white">
                    {score}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Lead Score
                </p>
                <p className="mt-1 text-sm font-semibold text-charcoal dark:text-white">
                  {score >= 80
                    ? "Strong opportunity"
                    : score >= 50
                      ? "Needs qualification"
                      : "Early-stage lead"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Lead Temperature
              </p>
              <p className="mt-3 text-2xl font-bold capitalize text-charcoal dark:text-white">
                {getTemperatureLabel(insight.lead_temperature)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Based on inquiry quality and current CRM context.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:col-span-2 xl:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Estimated Project Value
              </p>
              <p className="mt-3 text-xl font-bold text-charcoal dark:text-white">
                {insight.estimated_value}
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Confidence: {Math.round(confidence)}%
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Buying Intent
                </p>
                <span className="text-sm font-bold text-charcoal dark:text-white">
                  {buyingIntent}%
                </span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-blue to-violet-600 transition-all"
                  style={{ width: `${buyingIntent}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-4 shadow-sm dark:border-blue-900 dark:from-blue-950 dark:to-violet-950">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-blue">
                Recommended Service
              </p>
              <p className="mt-2 text-lg font-bold text-deep-navy dark:text-blue-200">
                ⭐ {insight.suggested_service}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Recommended Next Step
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-emerald-950 dark:text-emerald-100">
              {insight.recommended_next_step}
            </p>
          </div>

          <p className="text-xs text-slate-400">
            Insight completeness: {insightCompleteness}/4 signals
          </p>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-violet-300 bg-white px-5 py-8 text-center text-sm text-slate-600 dark:border-violet-800 dark:bg-slate-900 dark:text-slate-300">
          AI insight not generated yet.
        </div>
      )}

      <SectionCard
        title="Smart Recommendations"
        icon={<Target size={17} aria-hidden="true" />}
      >
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => void runAction("recommendations")}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-lg border border-primary-blue px-3 py-2 text-xs font-semibold text-primary-blue transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-blue-950"
          >
            {activeAction === "recommendations" ? (
              <LoaderCircle
                size={14}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Sparkles size={14} aria-hidden="true" />
            )}
            {recommendations ? "Refresh Recommendations" : "Generate Recommendations"}
          </button>
        </div>
        {recommendations ? (
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="font-semibold text-slate-500">Best channel</dt>
              <dd className="mt-1 text-charcoal dark:text-white">
                {recommendations.best_communication_channel}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="font-semibold text-slate-500">Expected budget</dt>
              <dd className="mt-1 text-charcoal dark:text-white">
                {recommendations.expected_budget_range}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="font-semibold text-slate-500">Decision maker</dt>
              <dd className="mt-1 text-charcoal dark:text-white">
                {recommendations.decision_maker_level}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="font-semibold text-slate-500">
                Closure probability
              </dt>
              <dd className="mt-1 text-lg font-bold text-charcoal dark:text-white">
                {recommendations.probability_of_closure}%
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800 sm:col-span-2">
              <dt className="font-semibold text-slate-500">Potential risks</dt>
              <dd className="mt-2">
                <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
                  {recommendations.potential_risks.map((risk) => (
                    <li key={risk}>{risk}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800 sm:col-span-2">
              <dt className="font-semibold text-slate-500">
                Cross-sell opportunity
              </dt>
              <dd className="mt-1 text-charcoal dark:text-white">
                {recommendations.cross_sell_opportunity}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Generate recommendations for channel, budget, decision authority,
            risks, closure probability, and cross-sell opportunities.
          </p>
        )}
      </SectionCard>

      <SectionCard
        title="Proposal Generator"
        icon={<FileText size={17} aria-hidden="true" />}
      >
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void runAction("proposal")}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-lg bg-deep-navy px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-blue disabled:cursor-wait disabled:opacity-60"
          >
            {activeAction === "proposal" ? (
              <LoaderCircle
                size={14}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Sparkles size={14} aria-hidden="true" />
            )}
            {proposal ? "Regenerate Proposal" : "Generate Proposal"}
          </button>
          {proposal ? (
            <button
              type="button"
              onClick={() =>
                void copyText("proposal", proposalToText(proposal))
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:border-primary-blue hover:text-primary-blue dark:border-slate-600 dark:text-slate-200"
            >
              <Copy size={14} aria-hidden="true" />
              {copied === "proposal" ? "Copied" : "Copy Proposal"}
            </button>
          ) : null}
        </div>
        {proposal ? (
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-charcoal dark:text-white">
                Executive Summary
              </h4>
              <p className="mt-1 whitespace-pre-wrap leading-6 text-slate-600 dark:text-slate-300">
                {proposal.executive_summary}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal dark:text-white">
                Customer Requirements
              </h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
                {proposal.customer_requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal dark:text-white">
                Proposed Solution
              </h4>
              <p className="mt-1 whitespace-pre-wrap leading-6 text-slate-600 dark:text-slate-300">
                {proposal.proposed_solution}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal dark:text-white">
                Deliverables
              </h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
                {proposal.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <h4 className="font-semibold text-charcoal dark:text-white">
                  Timeline
                </h4>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {proposal.timeline}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <h4 className="font-semibold text-charcoal dark:text-white">
                  Commercial Section
                </h4>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {proposal.commercial_section}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal dark:text-white">
                Next Steps
              </h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
                {proposal.next_steps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Reply Generator"
        icon={<Mail size={17} aria-hidden="true" />}
      >
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void runAction("reply")}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-blue px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-deep-navy disabled:cursor-wait disabled:opacity-60"
          >
            {activeAction === "reply" ? (
              <LoaderCircle
                size={14}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Sparkles size={14} aria-hidden="true" />
            )}
            {reply ? "Regenerate Reply" : "Generate Reply"}
          </button>
          {reply ? (
            <button
              type="button"
              onClick={() => void copyText("reply", replyToText(reply))}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:border-primary-blue hover:text-primary-blue dark:border-slate-600 dark:text-slate-200"
            >
              <Copy size={14} aria-hidden="true" />
              {copied === "reply" ? "Copied" : "Copy Reply"}
            </button>
          ) : null}
        </div>
        {reply ? (
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
            <p className="font-semibold text-charcoal dark:text-white">
              Subject: {reply.subject}
            </p>
            <p className="mt-3 whitespace-pre-wrap leading-6 text-slate-600 dark:text-slate-300">
              {reply.body}
            </p>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        title="AI Sales Assistant"
        icon={<MessageSquareText size={17} aria-hidden="true" />}
      >
        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
          {memory.messages.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              Ask a lead-specific sales question to begin.
            </p>
          ) : (
            memory.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-xl px-3 py-2.5 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-primary-blue text-white"
                    : "bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>
            ))
          )}
          {activeAction === "chat" ? (
            <div className="flex max-w-[90%] items-center gap-2 rounded-xl bg-white px-3 py-3 text-sm text-slate-500 shadow-sm dark:bg-slate-900">
              <LoaderCircle
                size={15}
                className="animate-spin"
                aria-hidden="true"
              />
              Thinking through this lead...
            </div>
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => setChatInput(question)}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-600 transition hover:border-primary-blue hover:text-primary-blue dark:border-slate-600 dark:text-slate-300"
            >
              {question}
            </button>
          ))}
        </div>
        <form onSubmit={submitChat} className="mt-3 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            placeholder="Ask about pricing, approach, objections..."
            maxLength={4000}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-blue focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={isBusy || !chatInput.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-deep-navy text-white transition hover:bg-primary-blue disabled:cursor-not-allowed disabled:bg-slate-300"
            aria-label="Send message"
          >
            <Send size={17} aria-hidden="true" />
          </button>
        </form>
      </SectionCard>

      <SectionCard
        title="CRM Timeline"
        icon={<Clock3 size={17} aria-hidden="true" />}
      >
        <ol className="mt-4 space-y-4">
          {memory.timeline.map((event, index) => (
            <li key={event.id} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-blue ring-4 ring-blue-100 dark:ring-blue-950" />
                {index < memory.timeline.length - 1 ? (
                  <span className="mt-1 h-full w-px bg-slate-200 dark:bg-slate-700" />
                ) : null}
              </div>
              <div className="pb-2">
                <p className="text-sm font-semibold text-charcoal dark:text-white">
                  {event.label}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">{event.detail}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(event.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </SectionCard>
    </section>
  );
}
