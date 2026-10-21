import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceStartRequestsQuery } from "@/features/admin/queries";
import {
  formatFinnishDate,
  formatFinnishDateTime,
  formatServiceType,
} from "@/features/admin/model";

export const Route = createFileRoute("/_authenticated/admin/palvelunaloitukset")({
  loader: ({ context }) => context.queryClient.ensureQueryData(serviceStartRequestsQuery),
  component: ServiceStartRequests,
});

function ServiceStartRequests() {
  const { data } = useSuspenseQuery(serviceStartRequestsQuery);
  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">Asiakaspyynnöt</p>
        <h2 className="mt-2 text-4xl">Palvelun aloitukset</h2>
      </div>
      {!data.length && (
        <Card>
          <CardContent className="pt-6 text-muted-foreground">
            Ei palvelunaloituspyyntöjä.
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4">
        {data.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="text-lg">{request.customer_name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Vastaanotettu {formatFinnishDateTime(request.created_at)} · Kieli:{" "}
                {request.lang.toUpperCase()}
              </p>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <p>
                <span className="font-medium">Yhteyshenkilö:</span> {request.contact_person}
              </p>
              <p>
                <span className="font-medium">Sähköposti:</span> {request.email}
              </p>
              <p className="sm:col-span-2">
                <span className="font-medium">Työosoite:</span> {request.work_address}
              </p>
              <p>
                <span className="font-medium">Palvelutyyppi:</span>{" "}
                {formatServiceType(request.service_type)}
              </p>
              <p>
                <span className="font-medium">Aloitus:</span>{" "}
                {formatFinnishDate(request.start_date)} klo {request.start_time}
              </p>
              {request.package_name && (
                <p>
                  <span className="font-medium">Paketti:</span> {request.package_name}
                </p>
              )}
              {request.once_details && (
                <p className="whitespace-pre-wrap break-words sm:col-span-2">
                  <span className="font-medium">Lisätiedot:</span> {request.once_details}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
