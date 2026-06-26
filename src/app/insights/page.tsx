import Link from "next/link";
import { ArrowRight, BookOpenText, BrainCircuit, Clock, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeading } from "@/components/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights",
  description:
    "NeOMind Insights is a coming-soon destination for AI, SaaS, automation, cloud, and digital transformation thinking.",
  path: "/insights",
});

const upcomingTopics = [
  "AI adoption strategy",
  "SaaS product engineering",
  "Automation playbooks",
  "Cloud application patterns",
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(20,184,166,0.14),transparent_26%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Insights"
                title="AI, software, and transformation thinking is coming soon"
                description="NeOMind Insights will share practical perspectives on building intelligent products, automating workflows, and modernizing business platforms."
              />
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-deep-navy"
              >
                Discuss a topic with NeOMind
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-primary-blue">
                    <BookOpenText size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal">Editorial roadmap</p>
                    <p className="text-sm text-slate-500">Coming soon</p>
                  </div>
                </div>
                <Clock size={22} className="text-teal" aria-hidden="true" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {upcomingTopics.map((topic, index) => {
                  const Icon = index % 2 === 0 ? BrainCircuit : Sparkles;

                  return (
                    <div
                      key={topic}
                      className="rounded-xl border border-slate-200 bg-light-gray p-4"
                    >
                      <Icon size={20} className="text-primary-blue" aria-hidden="true" />
                      <p className="mt-3 text-sm font-semibold text-charcoal">
                        {topic}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
