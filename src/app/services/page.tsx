import type { Metadata } from "next";
import {
  AppWindow,
  BrainCircuit,
  Cloud,
  Headphones,
  Network,
  Rocket,
  Smartphone,
  Workflow,
} from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore NeOMind services including AI solutions, custom software, mobile apps, SaaS product development, AI helpdesk, automation, cloud apps, and digital transformation.",
};

const services = [
  {
    title: "AI Solutions",
    description:
      "Model-driven workflows, decision intelligence, predictive features, document intelligence, and AI-assisted operations.",
    points: ["AI discovery and roadmap", "Workflow intelligence", "Custom AI integrations"],
    Icon: BrainCircuit,
  },
  {
    title: "Custom Software Development",
    description:
      "Secure business applications, dashboards, portals, and operational systems tailored to your workflows.",
    points: ["Web applications", "Internal tools", "API and system integration"],
    Icon: AppWindow,
  },
  {
    title: "Mobile App Development",
    description:
      "Mobile-first experiences for customers, employees, and field teams with clean UX and scalable backends.",
    points: ["Customer apps", "Team productivity apps", "Mobile product MVPs"],
    Icon: Smartphone,
  },
  {
    title: "SaaS Product Development",
    description:
      "Full product engineering for SaaS platforms, from MVP definition to scalable multi-tenant architecture.",
    points: ["MVP planning", "Subscription workflows", "Scalable platform design"],
    Icon: Rocket,
  },
  {
    title: "AI Helpdesk Solutions",
    description:
      "Support automation and customer service intelligence for faster response, routing, and resolution.",
    points: ["Conversational AI", "Ticket intelligence", "Assisted agent workflows"],
    Icon: Headphones,
  },
  {
    title: "Business Automation",
    description:
      "Process automation that removes repetitive manual work and improves operational visibility.",
    points: ["Approval workflows", "Data automation", "Operational dashboards"],
    Icon: Workflow,
  },
  {
    title: "Cloud Applications",
    description:
      "Cloud-native applications built for reliability, performance, maintainability, and future growth.",
    points: ["Cloud architecture", "Backend systems", "Performance optimization"],
    Icon: Cloud,
  },
  {
    title: "Digital Transformation",
    description:
      "Modernization programs that connect business goals with the right digital platforms and delivery plan.",
    points: ["Technology roadmap", "Legacy modernization", "Product-led transformation"],
    Icon: Network,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeading
            eyebrow="Services"
            title="AI, software, and transformation services built for outcomes"
            description="NeOMind helps teams define, design, and deliver intelligent systems that improve products, operations, and customer experiences."
          />
        </section>

        <section className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-50 text-primary-blue">
                    <service.Icon size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-charcoal">
                      {service.title}
                    </h2>
                    <p className="mt-3 leading-7 text-slate-600">
                      {service.description}
                    </p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      {service.points.map((point) => (
                        <div
                          key={point}
                          className="rounded-md bg-light-gray px-3 py-2 text-sm font-medium text-slate-700"
                        >
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
