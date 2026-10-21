import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminDashboardQuery } from "@/features/admin/queries";
import { formatEmailStatus, formatFinnishDateTime } from "@/features/admin/model";

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminDashboardQuery),
  component: AdminDashboard,
});

const statCards = [
  ["contacts", "Yhteydenotot", "/admin/yhteydenotot"],
  ["bookings", "Videopalaverit", "/admin/videopalaverit"],
  ["starts", "Palvelun aloitukset", "/admin/palvelunaloitukset"],
  ["publishedNews", "Julkaistut uutiset", "/uutisten-yllapito"],
  ["draftNews", "Uutisluonnokset", "/uutisten-yllapito"],
] as const;

function AdminDashboard() {
  const { data } = useSuspenseQuery(adminDashboardQuery);

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Tervetuloa</p>
        <h2 className="mt-2 text-4xl">Yhteenveto</h2>
        <p className="mt-2 text-muted-foreground">
          Tässä näet tuoreimmat asiakaspyynnöt ja tärkeimmät tilanneluvut.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map(([key, label, to]) => (
          <Link key={key} to={to} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-normal text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{data.counts[key]}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Uusimmat yhteydenotot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {!data.latestContacts.length && (
              <p className="text-muted-foreground">Ei yhteydenottopyyntöjä.</p>
            )}
            {data.latestContacts.map((contact) => (
              <article
                key={contact.id}
                className="border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <p className="text-sm text-muted-foreground">
                  {formatFinnishDateTime(contact.created_at)} · {contact.lang.toUpperCase()}
                </p>
                <p className="mt-1 font-medium break-words">{contact.email}</p>
                <p className="mt-1 line-clamp-2 whitespace-pre-wrap break-words text-sm">
                  {contact.message}
                </p>
              </article>
            ))}
            <Link
              to="/admin/yhteydenotot"
              className="inline-block text-sm font-medium text-primary hover:underline"
            >
              Näytä kaikki yhteydenotot →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sähköpostien tila</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(data.emailStatusCounts).length === 0 && (
              <p className="text-muted-foreground">Ei ilmoituksia.</p>
            )}
            {Object.entries(data.emailStatusCounts).map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <Badge variant={status === "failed" ? "destructive" : "secondary"}>
                  {formatEmailStatus(status)}
                </Badge>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
            <p className="pt-2 text-xs text-muted-foreground">
              “Resend hyväksyi” ei tarkoita lopullista toimitusta vastaanottajan postilaatikkoon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
