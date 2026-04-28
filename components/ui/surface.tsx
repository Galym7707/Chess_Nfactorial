import { cn } from "@/lib/utils";

export function Surface({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7", className)} {...props} />;
}