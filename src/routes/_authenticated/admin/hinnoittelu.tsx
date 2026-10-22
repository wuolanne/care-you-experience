import { createFileRoute } from "@tanstack/react-router";
import { PricingAdmin } from "@/features/pricing/PricingAdmin";

export const Route = createFileRoute("/_authenticated/admin/hinnoittelu")({
  component: PricingAdminPage,
});

function PricingAdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Sivuston ylläpito</p>
        <h2 className="mt-2 text-4xl">Hinnoittelu</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Hallitse TGN Kotiin- ja TGN Yrityksille -palveluiden hintoja ja kielikohtaisia tekstejä.
        </p>
      </div>
      <PricingAdmin />
    </div>
  );
}
