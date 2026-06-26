import type { Metadata } from "next";
import { BrainCircuit, Compass, Eye, Lightbulb, ShieldCheck, Target, Users } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about NeOMind, THE NEOMIND INNOVATIONS LLP, its mission, vision, values, and purpose as an AI technology company.",
};

const values = [
  {
    title: "Intelligence with purpose",
    description:
      "We apply AI where it improves decisions, workflows, products, and customer experiences.",
    Icon: BrainCircuit,
  },
  {
    title: "Practical innovation",
    description:
      "Our work is modern and ambitious, but always grounded in outcomes a business can use.",
    Icon: Lightbulb,
  },
  {
    title: "Trust by design",
    description:
      "We build with security, reliability, and operational clarity from the earliest architecture decisions.",
    Icon: ShieldCheck,
  },
  {
    title: "Long-term partnership",
    description:
      "NeOMind exists to help organizations keep evolving as markets, users, and technology shift.",
    Icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
                About NeOMind
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-charcoal sm:text-5xl">
                Building intelligent digital foundations for modern business.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                THE NEOMIND INNOVATIONS LLP helps businesses transform ideas
                into intelligent solutions through AI, software engineering,
                SaaS products, and digital transformation.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-blue">
                Why we exist
              </p>
              <p className="mt-4 text-2xl font-semibold leading-snug text-charcoal">
                Many companies know where they want to go digitally, but need a
                partner who can connect strategy, AI capability, and reliable
                product delivery.
              </p>
              <p className="mt-4 leading-7 text-slate-600">
                NeOMind exists to close that gap with thoughtful engineering,
                business-aware design, and platforms that can grow beyond the
                first release.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {[
              {
                title: "Our story",
                text: "NeOMind was formed to help organizations move from scattered digital ideas to structured, intelligent solutions that improve real operations.",
                Icon: Compass,
              },
              {
                title: "Vision",
                text: "To become a trusted AI and software innovation partner for businesses building smarter, more adaptive digital ecosystems.",
                Icon: Eye,
              },
              {
                title: "Mission",
                text: "To deliver secure, scalable, and user-focused AI products, cloud applications, and automation systems that create lasting business value.",
                Icon: Target,
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-primary-blue">
                  <item.Icon size={24} aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-charcoal">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Values"
              title="The principles behind every NeOMind solution"
              description="Our values shape how we discover, design, build, and improve technology with our clients."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <article
                  key={value.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal/10 text-teal">
                    <value.Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-charcoal">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
