"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function ModeCard({
  title,
  eyebrow,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
      <Link href={href} className="group block h-full rounded-[2rem] border border-border bg-card/62 p-5 shadow-soft transition hover:border-primary/50 hover:bg-card">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</span>
          <Icon className="size-5 text-primary" />
        </div>
        <h3 className="mt-8 font-display text-3xl font-semibold">{title}</h3>
        <p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{description}</p>
        <span className="mt-6 inline-flex items-center text-sm font-semibold text-primary">Открыть <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" /></span>
      </Link>
    </motion.div>
  );
}
