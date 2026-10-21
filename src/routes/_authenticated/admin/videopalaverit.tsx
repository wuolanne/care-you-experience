import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingRequestsQuery } from "@/features/admin/queries";
import { formatFinnishDate, formatFinnishDateTime } from "@/features/admin/model";

export const Route = createFileRoute("/_authenticated/admin/videopalaverit")({
  loader: ({ context }) => context.queryClient.ensureQueryData(bookingRequestsQuery),
  component: BookingRequests,
});

function BookingRequests() {
  const { data } = useSuspenseQuery(bookingRequestsQuery);
  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">Asiakaspyynnöt</p>
        <h2 className="mt-2 text-4xl">Videopalaverit</h2>
        <p className="mt-2 text-muted-foreground">
          Nämä ovat pyyntöjä, eivät automaattisesti vahvistettuja varauksia.
        </p>
      </div>
      {!data.length && (
        <Card>
          <CardContent className="pt-6 text-muted-foreground">
            Ei videopalaveripyyntöjä.
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4">
        {data.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="text-lg">{request.contact_email}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Vastaanotettu {formatFinnishDateTime(request.created_at)} · Kieli:{" "}
                {request.lang.toUpperCase()}
              </p>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              <p>
                <span className="font-medium">Toivottu päivä:</span>{" "}
                {formatFinnishDate(request.meeting_date)}
              </p>
              <p>
                <span className="font-medium">Toivottu aika:</span> {request.preferred_time}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
