import Link from "next/link";
import { Surface } from "./surface";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Surface className="text-center">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className={cn(
            "mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110",
          )}
        >
          {actionLabel}
        </Link>
      ) : null}
    </Surface>
  );
}