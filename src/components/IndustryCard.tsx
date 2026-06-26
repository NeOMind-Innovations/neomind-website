import type { LucideIcon } from "lucide-react";

type IndustryCardProps = {
  title: string;
  Icon: LucideIcon;
};

export function IndustryCard({ title, Icon }: IndustryCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-lg hover:shadow-teal-100/50">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-teal/10 text-teal">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-charcoal">{title}</h3>
    </article>
  );
}
