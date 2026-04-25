import { Suspense } from "react";
import { PricingPageClient } from "@/components/pricing/pricing-page-client";

export default function PricingPage() {
  return (
    <Suspense fallback={<section className="px-4 py-16 text-center text-muted-foreground">Загрузка pricing...</section>}>
      <PricingPageClient />
    </Suspense>
  );
}