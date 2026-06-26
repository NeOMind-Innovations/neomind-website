import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, Layers3, MessageSquareText, Plus } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore NeOMind internal flagship products and portfolio case studies including NeoLearn and NeO VoiceDesk.",
};

const caseStudies = [
  {
    title: "NeoLearn",
    category: "Intelligent learning platform",
    description:
      "A flagship internal product focused on structured digital learning, training journeys, learner engagement, and education workflows.",
    highlights: ["Digital learning foundation", "Training workflow support", "AI-ready education experience"],
    Icon: GraduationCap,
  },
  {
    title: "NeO VoiceDesk",
    category: "AI voice and helpdesk product",
    description:
      "A flagship internal product for voice-first support, conversation intelligence, assisted resolution, and helpdesk automation.",
    highlights: ["Voice support workflows", "Customer service intelligence", "Assisted support operations"],
    Icon: MessageSquareText,
  },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeading
            eyebrow="Portfolio"
            title="Flagship products and intelligent platform work"
            description="A growing showcase of NeOMind product thinking, internal innovation, and future client transformation projects."
          />
        </section>

        <section className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            {caseStudies.map((study) => (
              <article
                key={study.title}
                className="rounded-xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-primary-blue">
                    <study.Icon size={24} aria-hidden="true" />
                  </div>
                  <span className="rounded-md bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                    Internal flagship
                  </span>
                </div>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary-blue">
                  {study.category}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-charcoal">
                  {study.title}
                </h2>
                <p className="mt-4 leading-7 text-slate-600">{study.description}</p>
                <div className="mt-6 grid gap-3">
                  {study.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-md bg-light-gray px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-blue transition hover:text-deep-navy"
                >
                  Discuss similar work
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple/10 text-purple">
                <Layers3 size={24} aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-3xl font-semibold text-charcoal">
                Space for future client projects
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                As NeOMind grows its delivery portfolio, this section can expand
                into client case studies across AI, SaaS, automation, cloud, and
                digital transformation work.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {["Client AI platform", "Automation rollout", "Cloud product build"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center"
                  >
                    <Plus className="mx-auto text-teal" size={24} aria-hidden="true" />
                    <p className="mt-4 text-sm font-semibold text-charcoal">{item}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">Future case study</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
