import { createFileRoute } from "@tanstack/react-router";
import { ServiceSectionAdmin } from "@/features/service-sections/ServiceSectionAdmin";

export const Route = createFileRoute("/_authenticated/admin/asiakasedut")({
  component: CustomerBenefitsAdminPage,
});

function CustomerBenefitsAdminPage() {
  return (
    <ServiceSectionAdmin
      heading="Asiakasedut"
      description="Muokkaa palveluiden asiakasetuja kielittäin."
      initialSectionType="benefits"
      onlySection="benefits"
    />
  );
}
