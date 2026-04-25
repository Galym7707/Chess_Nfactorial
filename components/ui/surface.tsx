import { cn } from "@/lib/utils";

export function Surface({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-panel rounded-[2rem] p-5 md:p-7", className)} {...props} />;
}