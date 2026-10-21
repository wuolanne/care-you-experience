import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contactSubmissionsQuery } from "@/features/admin/queries";
import { formatFinnishDateTime } from "@/features/admin/model";

export const Route = createFileRoute("/_authenticated/admin/yhteydenotot")({
  loader: ({ context }) => context.queryClient.ensureQueryData(contactSubmissionsQuery),
  component: ContactSubmissions,
});

function ContactSubmissions() {
  const { data } = useSuspenseQuery(contactSubmissionsQuery);
  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">Asiakaspyynnöt</p>
        <h2 className="mt-2 text-4xl">Yhteydenotot</h2>
      </div>
      {!data.length && (
        <Card>
          <CardContent className="pt-6 text-muted-foreground">Ei yhteydenottopyyntöjä.</CardContent>
        </Card>
      )}
      <div className="grid gap-4">
        {data.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="text-lg">{request.email}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatFinnishDateTime(request.created_at)} · Kieli: {request.lang.toUpperCase()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap break-words">{request.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
