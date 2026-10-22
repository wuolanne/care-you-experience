import { createFileRoute } from "@tanstack/react-router";
import { StaffAdmin } from "@/features/staff/StaffAdmin";

export const Route = createFileRoute("/_authenticated/admin/henkilosto")({
  component: StaffAdminPage,
});

function StaffAdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Sivuston ylläpito</p>
        <h2 className="mt-2 text-4xl">Henkilöstö</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Hallitse julkisella Lyhyesti meistä -sivulla näytettäviä henkilötietoja.
        </p>
      </div>
      <StaffAdmin />
    </div>
  );
}
