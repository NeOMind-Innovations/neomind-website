import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="inline-flex rounded-md bg-white px-3 py-2 shadow-lg shadow-black/10">
            <Image
              src="/neomind-logo.svg"
              alt="NeOMind logo"
              width={4552}
              height={1184}
              className="h-auto w-[165px]"
            />
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Transforming Ideas into Intelligent Solutions for businesses ready
            to move faster with AI, software, and digital transformation.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
            Explore
          </p>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
            Company
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            THE NEOMIND INNOVATIONS LLP
          </p>
          <p className="mt-3 text-sm text-slate-400">
            AI solutions. SaaS products. Digital platforms.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright 2026 NeOMind. All rights reserved.</p>
          <p>Built for intelligent business transformation.</p>
        </div>
      </div>
    </footer>
  );
}
