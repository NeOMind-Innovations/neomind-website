import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-deep-navy px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,0.22),transparent_28%),radial-gradient(circle_at_88%_30%,rgba(124,58,237,0.22),transparent_26%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
            Ready for intelligent growth
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Turn your next idea into a secure, scalable digital product.
          </h2>
          <p className="mt-4 text-base leading-7 text-blue-100">
            From AI strategy to cloud-native product engineering, NeOMind helps
            teams build systems that are useful on day one and adaptable over
            time.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-base font-semibold text-deep-navy shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-light-gray"
        >
          Start the Conversation
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
