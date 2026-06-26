import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  Headphones,
  MessageSquareText,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeading } from "@/components/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Products",
  description:
    "Explore NeOMind flagship products NeoLearn and NeO VoiceDesk for intelligent learning and AI-enabled voice helpdesk operations.",
  path: "/products",
});

const products = [
  {
    name: "NeoLearn",
    description:
      "An intelligent learning product for digital education, training workflows, learner engagement, and structured knowledge delivery.",
    accent: "blue" as const,
    Icon: GraduationCap,
    signal: "Learning intelligence",
    features: [
      "Structured learning paths",
      "Training operations",
      "Assessment workflows",
      "AI-ready content experiences",
    ],
    outcomes: [
      "Organized digital learning programs",
      "Better visibility for training teams",
      "Reusable knowledge delivery foundations",
    ],
    supportingIcons: [BookOpenCheck, Workflow, ShieldCheck],
  },
  {
    name: "NeO VoiceDesk",
    description:
      "An AI-enabled voice and helpdesk product for smarter customer conversations, assisted resolution, and support operations.",
    accent: "purple" as const,
    Icon: MessageSquareText,
    signal: "Support intelligence",
    features: [
      "Voice-first support",
      "Conversation intelligence",
      "Agent assistance",
      "Helpdesk automation",
    ],
    outcomes: [
      "Cleaner customer support workflows",
      "More consistent service experiences",
      "Automation-ready helpdesk operations",
    ],
    supportingIcons: [Headphones, MessageSquareText, Workflow],
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeading
            eyebrow="Products"
            title="Flagship NeOMind products for intelligent business workflows"
            description="Our product portfolio brings AI, automation, and thoughtful software design into high-value business use cases."
          />
        </section>

        <section className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8">
            {products.map((product) => (
              <FadeIn key={product.name}>
                <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-blue via-teal to-purple" />
                  <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div>
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-lg ${
                          product.accent === "purple"
                            ? "bg-purple/10 text-purple"
                            : "bg-blue-50 text-primary-blue"
                        }`}
                      >
                        <product.Icon size={28} aria-hidden="true" />
                      </div>
                      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-teal">
                        {product.signal}
                      </p>
                      <h2 className="mt-3 text-3xl font-semibold text-charcoal sm:text-4xl">
                        {product.name}
                      </h2>
                      <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                        {product.description}
                      </p>
                      <Link
                        href="/contact"
                        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-deep-navy"
                      >
                        Request a product consultation
                        <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                    <div className="grid gap-5">
                      <div className="rounded-xl border border-slate-200 bg-light-gray p-5">
                        <h3 className="font-semibold text-charcoal">
                          Feature highlights
                        </h3>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {product.features.map((feature) => (
                            <div
                              key={feature}
                              className="rounded-md bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
                            >
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {product.outcomes.map((outcome, index) => {
                          const Icon = product.supportingIcons[index];

                          return (
                            <div
                              key={outcome}
                              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                              <Icon className="text-primary-blue" size={22} aria-hidden="true" />
                              <p className="mt-3 text-sm font-medium leading-6 text-slate-700">
                                {outcome}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
