import {
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Rocket,
  ShoppingBag,
} from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IndustryCard } from "@/components/IndustryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "NeOMind supports education, healthcare, retail, manufacturing, government, real estate, finance, and startups with AI and software solutions.",
  path: "/industries",
});

const industries = [
  {
    title: "Education",
    Icon: GraduationCap,
    description:
      "Learning platforms, training workflows, content systems, assessments, and AI-supported education experiences.",
  },
  {
    title: "Healthcare",
    Icon: HeartPulse,
    description:
      "Operational tools, patient engagement workflows, support automation, and secure digital health platforms.",
  },
  {
    title: "Retail",
    Icon: ShoppingBag,
    description:
      "Commerce workflows, customer support, inventory visibility, loyalty systems, and digital storefronts.",
  },
  {
    title: "Manufacturing",
    Icon: Factory,
    description:
      "Process automation, production dashboards, field operations, and data-driven workflow improvements.",
  },
  {
    title: "Government",
    Icon: Building2,
    description:
      "Citizen service portals, administrative automation, document workflows, and reliable public digital services.",
  },
  {
    title: "Real Estate",
    Icon: Home,
    description:
      "Lead workflows, property platforms, customer communication, and operational systems for real estate teams.",
  },
  {
    title: "Finance",
    Icon: Landmark,
    description:
      "Secure applications, workflow automation, customer service intelligence, and data-driven financial operations.",
  },
  {
    title: "Startups",
    Icon: Rocket,
    description:
      "MVP planning, SaaS platforms, product engineering, and scalable foundations for early growth.",
  },
];

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeading
            eyebrow="Industries"
            title="AI and software solutions for sectors ready to modernize"
            description="NeOMind works with service-driven and growth-focused teams that need better platforms, automation, and customer experiences."
          />
        </section>

        <section className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => (
              <div key={industry.title} className="grid gap-4">
                <IndustryCard title={industry.title} Icon={industry.Icon} />
                <p className="rounded-xl border border-slate-200 bg-light-gray p-5 text-sm leading-6 text-slate-600">
                  {industry.description}
                </p>
              </div>
            ))}
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
