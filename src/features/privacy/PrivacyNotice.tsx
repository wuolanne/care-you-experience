import { Link } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";

type PrivacyNoticeKind = "contact" | "booking" | "serviceStart";

export function PrivacyNotice({ kind = "contact" }: { kind?: PrivacyNoticeKind }) {
  const { tr } = useLang();
  const notice =
    kind === "booking"
      ? tr.privacy.bookingNotice
      : kind === "serviceStart"
        ? tr.privacy.serviceStartNotice
        : tr.privacy.contactNotice;

  return (
    <p className="text-sm leading-relaxed text-muted-foreground">
      {notice}{" "}
      <Link to="/tietosuoja" className="underline underline-offset-4 hover:text-primary">
        {tr.privacy.readMore}
      </Link>
      .
    </p>
  );
}
