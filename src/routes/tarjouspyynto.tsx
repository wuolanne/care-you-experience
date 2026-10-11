import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactForm } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/tarjouspyynto")({
  head: () => ({
    meta: [
      { title: "Jätä yhteydenottopyyntö | T T & G Services G Nordic Services" },
      { name: "description", content: "Jätä yhteystietosi ja kerro kodin tai yrityksen palvelutarpeista." },
      { property: "og:title", content: "Jätä yhteydenottopyyntö | T T & G Services G Nordic Services" },
      { property: "og:description", content: "Ota yhteyttä T T & G Services G Nordic Services -palveluihin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const { tr } = useLang();
  return (
    <>
      <PageHero eyebrow={tr.actions.eyebrow} title={tr.quote.title} lead={tr.quote.lead} />
      <div className="mx-auto max-w-xl px-6 py-20">
        <ContactForm
          labels={{ submit: tr.form.submit, thanks: tr.form.thanks }}
          fields={[
            { key: "name", label: tr.form.name },
            { key: "email", label: tr.form.email, type: "email" },
            { key: "phone", label: tr.form.phone, type: "tel" },
            { key: "service", label: tr.form.service },
            { key: "message", label: tr.form.message, textarea: true },
          ]}
        />
      </div>
    </>
  );
}
