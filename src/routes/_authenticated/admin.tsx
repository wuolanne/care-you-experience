import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Mail, Newspaper, Video, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { editorAccess } from "@/features/news/editor.functions";
import { pageHead } from "@/features/seo/head";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  head: () => pageHead({
    path: "/admin",
    title: "Hallintapaneeli | TGN Services",
    description: "TGN Servicesin ylläpidon hallintapaneeli.",
    indexable: false,
  }),
  beforeLoad: async () => {
    if (!(await editorAccess())) throw redirect({ to: "/" });
  },
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Yhteenveto", icon: LayoutDashboard },
  { to: "/admin/yhteydenotot", label: "Yhteydenotot", icon: Mail },
  { to: "/admin/videopalaverit", label: "Videopalaverit", icon: Video },
  { to: "/admin/palvelunaloitukset", label: "Palvelun aloitukset", icon: Wrench },
  { to: "/admin/uutiset", label: "Uutiset", icon: Newspaper },
] as const;

function AdminLayout() {
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth", search: { returnTo: undefined }, replace: true });
  }

  return (
    <main className="min-h-screen bg-section-grey">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="eyebrow">TGN Services</p>
            <h1 className="mt-1 text-3xl">Hallintapaneeli</h1>
          </div>
          <Button variant="outline" onClick={() => void signOut()}>
            <LogOut aria-hidden="true" />
            Kirjaudu ulos
          </Button>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[15rem_1fr]">
        <nav
          aria-label="Hallintapaneelin navigaatio"
          className="h-fit rounded-xl border bg-card p-2 shadow-sm"
        >
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-secondary text-primary" }}
                className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
