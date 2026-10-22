import { Link } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";

export function PrivacyNotice() {
  const { tr } = useLang();

  return (
    <p className="text-sm leading-relaxed text-muted-foreground">
      {tr.privacy.formNotice}{" "}
      <Link to="/tietosuoja" className="underline underline-offset-4 hover:text-primary">
        {tr.privacy.readMore}
      </Link>
      .
    </p>
  );
}
