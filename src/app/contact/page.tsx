import type { Metadata } from "next";
import { CalendarCheck, Mail, MessageSquare, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact NeOMind for AI solutions, custom software development, SaaS product development, automation, cloud applications, and digital transformation consulting.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-light-gray px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Contact"
                title="Start a consultation with NeOMind"
                description="Tell us about the product, workflow, AI opportunity, or transformation goal you want to move forward."
              />
              <div className="mt-8 grid gap-4">
                {[
                  {
                    title: "Consultation-first",
                    text: "We begin by understanding goals, constraints, users, and the business outcome.",
                    Icon: CalendarCheck,
                  },
                  {
                    title: "AI and product clarity",
                    text: "We help shape the right plan before moving into design, architecture, or build.",
                    Icon: Sparkles,
                  },
                  {
                    title: "Professional follow-up",
                    text: "Use the form to share your needs and the team can prepare a focused next conversation.",
                    Icon: MessageSquare,
                  },
                ].map((item) => (
                  <article
                    key={item.title}
                    className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-50 text-primary-blue">
                      <item.Icon size={22} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-charcoal">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3 text-sm font-semibold text-charcoal">
                  <Mail size={18} className="text-teal" aria-hidden="true" />
                  THE NEOMIND INNOVATIONS LLP
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  AI solutions, innovative software, SaaS products, automation,
                  cloud applications, and digital transformation.
                </p>
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
