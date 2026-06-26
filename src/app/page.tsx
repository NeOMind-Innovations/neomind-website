import {
  AppWindow,
  Bot,
  BrainCircuit,
  Building2,
  Code2,
  Cloud,
  Database,
  GraduationCap,
  Headphones,
  HeartPulse,
  Landmark,
  LineChart,
  MessageSquareText,
  Network,
  Rocket,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Workflow,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { IndustryCard } from "@/components/IndustryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";

const services = [
  {
    title: "AI Solutions",
    description:
      "Practical AI systems for prediction, automation, content intelligence, and decision support.",
    Icon: BrainCircuit,
  },
  {
    title: "Custom Software Development",
    description:
      "Robust web platforms, internal tools, and business applications shaped around your operations.",
    Icon: AppWindow,
  },
  {
    title: "Mobile App Development",
    description:
      "Modern mobile experiences for customers, teams, and field operations across devices.",
    Icon: Smartphone,
  },
  {
    title: "SaaS Product Development",
    description:
      "From MVP to multi-tenant platforms with secure architecture and scalable product flows.",
    Icon: Rocket,
  },
  {
    title: "AI Helpdesk Solutions",
    description:
      "Conversational support, ticket intelligence, and assisted resolution for service teams.",
    Icon: Headphones,
  },
  {
    title: "Business Automation",
    description:
      "Workflow automation that removes manual handoffs and speeds up repeatable processes.",
    Icon: Workflow,
  },
  {
    title: "Cloud Applications",
    description:
      "Reliable cloud-native applications designed for performance, resilience, and growth.",
    Icon: Cloud,
  },
  {
    title: "Digital Transformation",
    description:
      "Strategy, modernization, and delivery support for companies evolving their digital core.",
    Icon: Network,
  },
];

const products = [
  {
    name: "NeoLearn",
    description:
      "An intelligent learning product for structured digital education, training workflows, and learner engagement.",
    accent: "blue" as const,
    Icon: GraduationCap,
    features: ["Structured learning paths", "Training operations", "AI-ready knowledge delivery"],
  },
  {
    name: "NeO VoiceDesk",
    description:
      "An AI-enabled voice and helpdesk product for smarter customer conversations and support operations.",
    accent: "purple" as const,
    Icon: MessageSquareText,
    features: ["Voice support workflows", "Conversation intelligence", "Helpdesk automation"],
  },
];

const industries = [
  { title: "Education and Learning", Icon: GraduationCap },
  { title: "Customer Support", Icon: Headphones },
  { title: "Healthcare Operations", Icon: HeartPulse },
  { title: "Finance and Services", Icon: Landmark },
  { title: "Retail and Commerce", Icon: ShoppingBag },
  { title: "Enterprise Workflows", Icon: Building2 },
];

const reasons = [
  {
    title: "AI-first engineering",
    description:
      "We pair modern software craft with applied AI thinking, so every solution is designed for intelligence, not just digitization.",
    Icon: Bot,
  },
  {
    title: "Business-aware delivery",
    description:
      "Our work starts with the operational outcome, then moves through product strategy, architecture, build, and launch.",
    Icon: LineChart,
  },
  {
    title: "Secure scalable foundations",
    description:
      "Cloud-ready architecture, clean interfaces, and reliable delivery practices keep products prepared for growth.",
    Icon: ShieldCheck,
  },
  {
    title: "Long-term product mindset",
    description:
      "NeOMind builds platforms that can evolve as your users, market, and automation opportunities change.",
    Icon: Settings2,
  },
];

const trustStack = [
  { title: "Next.js", Icon: AppWindow },
  { title: "TypeScript", Icon: Code2 },
  { title: "OpenAI", Icon: BrainCircuit },
  { title: "PostgreSQL", Icon: Database },
  { title: "Supabase", Icon: Database },
  { title: "Cloud", Icon: Cloud },
  { title: "Mobile Apps", Icon: Smartphone },
  { title: "AI Automation", Icon: Workflow },
];

const strengths = [
  {
    title: "AI-first solutions",
    description:
      "AI is considered from discovery through delivery, so automation and intelligence are part of the product architecture.",
    Icon: Bot,
  },
  {
    title: "Scalable architecture",
    description:
      "Systems are designed with modular interfaces, cloud readiness, and maintainable foundations for future growth.",
    Icon: Network,
  },
  {
    title: "Secure engineering",
    description:
      "Delivery emphasizes reliable patterns, clean data handling, and sensible security decisions from the start.",
    Icon: ShieldCheck,
  },
  {
    title: "Long-term support",
    description:
      "NeOMind builds with evolution in mind, supporting improvements as teams, workflows, and products mature.",
    Icon: Settings2,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />

        <section id="services" className="bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Services"
              title="AI, software, and transformation services for ambitious teams"
              description="NeOMind helps businesses modernize workflows, launch digital products, and apply AI where it creates measurable value."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <FadeIn key={service.title}>
                  <ServiceCard {...service} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="bg-white px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Products"
              title="Purpose-built products from the NeOMind lab"
              description="Our product portfolio focuses on intelligent education, communication, and service experiences."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {products.map((product) => (
                <FadeIn key={product.name}>
                  <article className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-100/70 sm:p-8">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-blue via-teal to-purple" />
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
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
                        <h3 className="mt-6 text-3xl font-semibold text-charcoal">
                          {product.name}
                        </h3>
                        <p className="mt-4 max-w-xl leading-7 text-slate-600">
                          {product.description}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-light-gray p-4 sm:min-w-48">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                          Product focus
                        </p>
                        <div className="mt-4 grid gap-3">
                          {product.features.map((feature) => (
                            <div
                              key={feature}
                              className="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                            >
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Technology Trust"
              title="Built with modern, reliable technology foundations"
              description="NeOMind aligns product delivery with proven frameworks, typed engineering, cloud platforms, and AI automation capabilities."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trustStack.map((item) => (
                <FadeIn key={item.title}>
                  <article className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-blue/30 hover:shadow-xl hover:shadow-blue-100/60">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-50 text-primary-blue">
                      <item.Icon size={22} aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-charcoal">{item.title}</h3>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section
          id="industries"
          className="border-y border-slate-200 bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeading
              align="left"
              eyebrow="Industries"
              title="Digital foundations for service-driven industries"
              description="We work across sectors where intelligent platforms, automation, and better customer experiences can shift the business forward."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {industries.map((industry) => (
                <FadeIn key={industry.title}>
                  <IndustryCard {...industry} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="why-neomind" className="bg-white px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Why NeOMind"
              title="A partner for practical innovation"
              description="THE NEOMIND INNOVATIONS LLP combines strategic clarity, product execution, and AI capability to help organizations build with confidence."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {reasons.map((reason) => (
                <FadeIn key={reason.title}>
                  <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-purple/30 hover:shadow-xl hover:shadow-purple-100/50">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-purple/10 text-purple">
                        <reason.Icon size={24} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-charcoal">
                          {reason.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-charcoal px-5 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Strengths"
              title="Enterprise-ready qualities without empty claims"
              description="A qualitative view of how NeOMind approaches every solution, from discovery through long-term evolution."
              tone="dark"
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {strengths.map((strength) => (
                <FadeIn key={strength.title}>
                  <article className="h-full rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:bg-white/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-primary-blue">
                      <strength.Icon size={24} aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {strength.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {strength.description}
                    </p>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <CTASection />

        <section id="contact" className="bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Contact"
                title="Let us shape your next intelligent solution"
                description="Share what you are building, automating, or modernizing. NeOMind can help turn the idea into a clear product and delivery plan."
              />
              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
                  Company
                </p>
                <p className="mt-3 text-lg font-semibold text-charcoal">
                  THE NEOMIND INNOVATIONS LLP
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Artificial Intelligence, innovative software, SaaS products,
                  helpdesk intelligence, automation, and cloud applications.
                </p>
                <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="rounded-md bg-light-gray p-4">
                    <p className="font-semibold text-charcoal">Typical focus</p>
                    <p className="mt-1">AI, SaaS, cloud, automation</p>
                  </div>
                  <div className="rounded-md bg-light-gray p-4">
                    <p className="font-semibold text-charcoal">Engagement</p>
                    <p className="mt-1">Strategy, build, launch, scale</p>
                  </div>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
