import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactForm } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/varaa")({
  head: () => ({
    meta: [
      { title: "Varaa videopalaveri | D&M Services" },
      { name: "description", content: "Varaa 30 minuutin videopalaveri ja aloitetaan yhteistyö rauhassa suunnitellen." },
      { property: "og:title", content: "Varaa videopalaveri | D&M Services" },
      { property: "og:description", content: "Sovitaan etätapaaminen ja käydään tarpeesi läpi." },
    ],
  }),
  component: Page,
});

function Page() {
  const { tr } = useLang();
  return (
    <>
      <PageHero eyebrow={tr.actions.eyebrow} title={tr.book.title} lead={tr.book.lead} />
      <div className="mx-auto max-w-xl px-6 py-20">
        <ContactForm
          labels={{ submit: tr.form.submit, thanks: tr.form.thanks }}
          fields={[
            { key: "name", label: tr.form.name },
            { key: "email", label: tr.form.email, type: "email" },
            { key: "phone", label: tr.form.phone, type: "tel" },
            { key: "time", label: tr.form.preferredTime, type: "datetime-local" },
            { key: "message", label: tr.form.message, textarea: true },
          ]}
        />
      </div>
    </>
  );
}
