import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const adminAccessQuery = queryOptions({
  queryKey: ["current-admin-access"],
  queryFn: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    return !error && data === true;
  },
  staleTime: 5 * 60_000,
  retry: false,
});

function throwIfAnyError(results: Array<{ error: { message: string } | null }>): void {
  const failure = results.find((result) => result.error);
  if (failure) throw new Error("Hallintatietoja ei voitu ladata.");
}

export const adminDashboardQuery = queryOptions({
  queryKey: ["admin-dashboard"],
  queryFn: async () => {
    const [contacts, bookings, starts, publishedNews, draftNews, latestContacts, emailStatuses] =
      await Promise.all([
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
        supabase.from("booking_requests").select("id", { count: "exact", head: true }),
        supabase.from("service_start_requests").select("id", { count: "exact", head: true }),
        supabase.from("news").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("news").select("id", { count: "exact", head: true }).eq("published", false),
        supabase
          .from("contact_submissions")
          .select("id,email,message,lang,created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("email_outbox").select("status"),
      ]);

    throwIfAnyError([
      contacts,
      bookings,
      starts,
      publishedNews,
      draftNews,
      latestContacts,
      emailStatuses,
    ]);

    const emailStatusCounts = (emailStatuses.data ?? []).reduce<Record<string, number>>(
      (counts, row) => {
        counts[row.status] = (counts[row.status] ?? 0) + 1;
        return counts;
      },
      {},
    );

    return {
      counts: {
        contacts: contacts.count ?? 0,
        bookings: bookings.count ?? 0,
        starts: starts.count ?? 0,
        publishedNews: publishedNews.count ?? 0,
        draftNews: draftNews.count ?? 0,
      },
      latestContacts: latestContacts.data ?? [],
      emailStatusCounts,
    };
  },
});

export const contactSubmissionsQuery = queryOptions({
  queryKey: ["admin-contact-submissions"],
  queryFn: async () => {
    const result = await supabase
      .from("contact_submissions")
      .select("id,email,message,lang,created_at")
      .order("created_at", { ascending: false });
    if (result.error) throw new Error("Yhteydenottoja ei voitu ladata.");
    return result.data ?? [];
  },
});

export const bookingRequestsQuery = queryOptions({
  queryKey: ["admin-booking-requests"],
  queryFn: async () => {
    const result = await supabase
      .from("booking_requests")
      .select("id,contact_email,meeting_date,preferred_time,lang,created_at")
      .order("created_at", { ascending: false });
    if (result.error) throw new Error("Videopalaveripyyntöjä ei voitu ladata.");
    return result.data ?? [];
  },
});

export const serviceStartRequestsQuery = queryOptions({
  queryKey: ["admin-service-start-requests"],
  queryFn: async () => {
    const result = await supabase
      .from("service_start_requests")
      .select(
        "id,customer_name,contact_person,email,work_address,service_type,start_date,start_time,once_details,package_name,lang,created_at",
      )
      .order("created_at", { ascending: false });
    if (result.error) throw new Error("Palvelunaloituspyyntöjä ei voitu ladata.");
    return result.data ?? [];
  },
});
