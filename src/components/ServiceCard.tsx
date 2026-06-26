import type { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

export function ServiceCard({ title, description, Icon }: ServiceCardProps) {
  return (
    <article className="group h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/70">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-primary-blue transition group-hover:bg-primary-blue group-hover:text-white">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-charcoal">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-6 h-px w-full bg-gradient-to-r from-primary-blue/30 via-teal/30 to-transparent" />
    </article>
  );
}
