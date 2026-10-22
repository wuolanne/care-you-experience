import { createFileRoute } from "@tanstack/react-router";
import { ServiceSectionAdmin } from "@/features/service-sections/ServiceSectionAdmin";

export const Route = createFileRoute("/_authenticated/admin/palvelut")({
  component: ServicesAdminPage,
});

function ServicesAdminPage() {
  return (
    <ServiceSectionAdmin
      heading="Palvelusisällöt"
      description="Muokkaa TGN Kotiin- ja TGN Yrityksille -palvelukortteja kielittäin."
    />
  );
}
