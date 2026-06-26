"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, CheckCircle2, Sparkles } from "lucide-react";

const capabilities = [
  "AI strategy",
  "SaaS engineering",
  "Automation",
  "Cloud applications",
];

const workflowLayers = [
  ["Signal intake", "Business data, documents, workflows"],
  ["AI reasoning", "Models, rules, orchestration"],
  ["Product action", "Dashboards, apps, automation"],
];

const strengths = [
  "AI-first solutions",
  "Scalable architecture",
  "Secure engineering",
  "Long-term support",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(37,99,235,0.16),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(20,184,166,0.16),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_88%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1.03fr_0.97fr] lg:px-8 lg:py-24">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src="/neomind-logo.svg"
            alt="NeOMind logo"
            width={4552}
            height={1184}
            priority
            className="block h-auto w-[190px] sm:w-[250px]"
          />
          <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-deep-navy shadow-sm">
            <Sparkles size={16} className="text-teal" aria-hidden="true" />
            Premium AI technology partner
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Transforming Ideas into Intelligent Solutions
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Empowering businesses through Artificial Intelligence, innovative
            software, and digital transformation.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary-blue px-6 py-3 text-base font-semibold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-deep-navy hover:shadow-blue-300"
            >
              Build with NeOMind
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="#services"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-charcoal shadow-sm transition hover:-translate-y-0.5 hover:border-primary-blue hover:text-primary-blue hover:shadow-md"
            >
              Explore Services
            </Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm font-medium text-slate-600 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <div key={capability} className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-teal" aria-hidden="true" />
                {capability}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-blue/10 via-white to-teal/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-2xl shadow-slate-900/10 sm:p-5">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <div className="relative flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-primary-blue">
                  <BrainCircuit size={24} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal">AI Operating Layer</p>
                  <p className="text-sm text-slate-500">Strategy to deployment</p>
                </div>
              </div>
              <span className="rounded-md bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                Enterprise-ready
              </span>
            </div>

            <div className="relative mt-6 rounded-xl border border-slate-100 bg-light-gray p-5">
              <div className="absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-primary-blue/20 via-teal/60 to-purple/20" />
              <div className="relative grid grid-cols-3 gap-3">
                {["Data", "AI", "Action"].map((node, index) => (
                  <motion.div
                    key={node}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white bg-white text-sm font-bold text-deep-navy shadow-lg shadow-blue-100"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                  >
                    {node}
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 grid gap-3">
                {workflowLayers.map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-lg border border-slate-100 bg-white/90 p-4 shadow-sm"
                  >
                    <p className="font-semibold text-charcoal">{title}</p>
                    <p className="mt-1 text-sm text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
              {strengths.map((strength) => (
                <div
                  key={strength}
                  className="rounded-lg border border-slate-100 bg-white p-3 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  {strength}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
