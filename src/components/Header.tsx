import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

function BrandMark() {
  return (
    <Link href="/" className="flex items-center" aria-label="NeOMind home">
      <Image
        src="/neomind-logo.svg"
        alt="NeOMind logo"
        width={4552}
        height={1184}
        priority
        className="h-auto w-[150px] sm:w-[170px]"
      />
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6 lg:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-primary-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-md bg-primary-blue px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200/70 transition hover:-translate-y-0.5 hover:bg-deep-navy hover:shadow-blue-300/60 lg:inline-flex"
        >
          Start a Project
        </Link>

        <details className="relative lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-slate-200 text-charcoal transition hover:border-primary-blue hover:text-primary-blue">
            <Menu size={20} aria-hidden="true" />
            <span className="sr-only">Open navigation</span>
          </summary>
          <div className="absolute right-0 mt-3 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-light-gray hover:text-primary-blue"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 flex items-center justify-center rounded-md bg-primary-blue px-4 py-2.5 text-sm font-semibold text-white"
            >
              Start a Project
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
