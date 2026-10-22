import { createFileRoute } from "@tanstack/react-router";
import { AboutImageAdmin } from "@/features/content/AboutImageAdmin";

export const Route = createFileRoute("/_authenticated/admin/kuvat")({
  component: ImagesAdminPage,
});

function ImagesAdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Sivuston ylläpito</p>
        <h2 className="mt-2 text-4xl">Kuvat</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Hallitse Lyhyesti meistä -sivun yhteistä pääkuvaa ja kielikohtaisia alt-tekstejä.
        </p>
      </div>
      <AboutImageAdmin />
    </div>
  );
}
