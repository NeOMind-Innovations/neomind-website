import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type ProductCardProps = {
  name: string;
  description: string;
  accent: "blue" | "purple";
  Icon: LucideIcon;
};

export function ProductCard({
  name,
  description,
  accent,
  Icon,
}: ProductCardProps) {
  const accentClass =
    accent === "purple"
      ? "bg-purple/10 text-purple ring-purple/15"
      : "bg-blue-50 text-primary-blue ring-primary-blue/15";

  return (
    <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-100/70">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-blue via-teal to-purple" />
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-md ring-8 ${accentClass}`}
      >
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-charcoal">{name}</h3>
      <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
      <Link
        href="/contact"
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-primary-blue transition hover:border-primary-blue hover:bg-blue-50 hover:text-deep-navy"
      >
        Discuss this product
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
