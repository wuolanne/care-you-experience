import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/features/seo/head";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/tietosuoja")({
  head: () =>
    pageHead({
      path: "/tietosuoja",
      title: "Tietosuojaseloste | TGN Services",
      description: "TGN Servicesin henkilötietojen käsittelyä koskeva tietosuojaseloste.",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { tr } = useLang();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14 md:py-20">
      <nav aria-label={tr.privacy.home} className="mb-8 text-sm text-muted-foreground">
        <Link to="/" className="underline underline-offset-4 hover:text-primary">
          {tr.privacy.home}
        </Link>
      </nav>

      <header className="max-w-3xl">
        <p className="eyebrow">TGN Services</p>
        <h1 className="mt-3 text-4xl md:text-5xl">{tr.privacy.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{tr.privacy.intro}</p>
        <p className="mt-4 text-sm text-muted-foreground">{tr.privacy.updated}</p>
      </header>

      <div className="mt-12 space-y-10">
        {tr.privacy.sections.map((section, index) => (
          <section key={section.title} aria-labelledby={`privacy-section-${index}`}>
            <h2 id={`privacy-section-${index}`} className="text-2xl md:text-3xl">
              {section.title}
            </h2>
            <div className="mt-4 space-y-3 leading-relaxed text-foreground/80">
              {section.paragraphs.map((paragraph) => (
                <PrivacyParagraph key={paragraph} text={paragraph} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        <a
          href="https://tietosuoja.fi"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-primary"
        >
          tietosuoja.fi
        </a>
      </p>
    </div>
  );
}

function PrivacyParagraph({ text }: { text: string }) {
  const email = "info@tgnservices.fi";
  const emailIndex = text.indexOf(email);

  if (emailIndex === -1) return <p>{text}</p>;

  return (
    <p>
      {text.slice(0, emailIndex)}
      <a href={`mailto:${email}`} className="underline underline-offset-4 hover:text-primary">
        {email}
      </a>
      {text.slice(emailIndex + email.length)}
    </p>
  );
}
