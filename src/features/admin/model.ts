import type { Tables } from "@/integrations/supabase/types";

export type ContactSubmission = Tables<"contact_submissions">;
export type BookingRequest = Tables<"booking_requests">;
export type ServiceStartRequest = Tables<"service_start_requests">;

const finnishDateTime = new Intl.DateTimeFormat("fi-FI", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Helsinki",
});

const finnishDate = new Intl.DateTimeFormat("fi-FI", {
  dateStyle: "medium",
  timeZone: "Europe/Helsinki",
});

export function formatFinnishDateTime(value: string): string {
  return finnishDateTime.format(new Date(value));
}

export function formatFinnishDate(value: string): string {
  return finnishDate.format(new Date(`${value}T12:00:00Z`));
}

export function formatServiceType(value: string): string {
  return value === "monthly" ? "Kuukausiasiakkuus" : "Kertakäynti";
}

export function formatEmailStatus(value: string): string {
  switch (value) {
    case "accepted":
      return "Resend hyväksyi";
    case "pending":
      return "Odottaa";
    case "processing":
      return "Käsittelyssä";
    case "failed":
      return "Epäonnistunut";
    case "blocked":
      return "Estetty";
    default:
      return "Tuntematon";
  }
}
