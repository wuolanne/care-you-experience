import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  adminContactQuery,
  adminContentQuery,
} from "@/features/content/queries";
import {
  asContentValues,
  contentEditorValues,
  contentFieldLabel,
  contentLanguages,
  contentPages,
  type ContentField,
  type ContentLanguage,
  type ContentPageKey,
  type ContentValues,
} from "@/features/content/model";

export const Route = createFileRoute("/_authenticated/admin/sisallot")({
  component: ContentAdmin,
});

const fallbackContact = {
  public_email: "info@tgnservices.fi",
  public_phone: "+358 45 78359301",
  public_address: "",
  business_id: "3664346-2",
};

function ContentAdmin() {
  const queryClient = useQueryClient();
  const { data: contents = [], isLoading: contentsLoading } = useQuery(adminContentQuery);
  const { data: contact } = useQuery(adminContactQuery);
  const [pageKey, setPageKey] = useState<ContentPageKey>("home");
  const [lang, setLang] = useState<ContentLanguage>("fi");
  const [values, setValues] = useState<ContentValues>({});
  const [contactForm, setContactForm] = useState(fallbackContact);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const currentRecord = contents.find((item) => item.page_key === pageKey && item.lang === lang);
  const selectedPage = useMemo(
    () => contentPages.find((page) => page.key === pageKey) ?? contentPages[0],
    [pageKey],
  );
  const fieldGroups =
    pageKey === "home"
      ? [
          {
            title: "Etusivun esittely",
            fields: ["title", "body", "cta", "secondary"] as ContentField[],
          },
          {
            title: "Hinnoittelu-osio",
            fields: [
              "pricingTitle",
              "pricingMonthlyDescription",
              "pricingServiceDescription",
              "pricingLanguages",
              "pricingHomeButton",
              "pricingBusinessButton",
            ] as ContentField[],
          },
          {
            title: "Arvomme-osio",
            fields: [
              "valuesEyebrow",
              "valuesTitle",
              "value1Title",
              "value1Body",
              "value2Title",
              "value2Body",
              "value3Title",
              "value3Body",
              "value4Title",
              "value4Body",
            ] as ContentField[],
          },
        ]
      : [{ title: "", fields: selectedPage.fields as unknown as readonly ContentField[] }];

  useEffect(() => {
    setValues(contentEditorValues(pageKey, lang, currentRecord));
  }, [currentRecord, lang, pageKey]);

  useEffect(() => {
    setContactForm({
      public_email: contact?.public_email ?? fallbackContact.public_email,
      public_phone: contact?.public_phone ?? fallbackContact.public_phone,
      public_address: contact?.public_address ?? fallbackContact.public_address,
      business_id: contact?.business_id ?? fallbackContact.business_id,
    });
  }, [contact]);


  async function saveContent(publish: boolean) {
    setBusy(true);
    setNotice(null);
    const content = { ...asContentValues(currentRecord?.draft_content), ...values };
    const { error } = await supabase.rpc("admin_upsert_site_content", {
      p_page_key: pageKey,
      p_lang: lang,
      p_draft_content: content,
      p_published_content: publish ? content : (currentRecord?.published_content ?? null),
      p_published_at: publish ? new Date().toISOString() : (currentRecord?.published_at ?? null),
    });
    setBusy(false);
    if (error) {
      setNotice("Sisältöä ei voitu tallentaa. Tarkista migraatio ja ylläpitäjän oikeudet.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-site-content"] });
    await queryClient.invalidateQueries({ queryKey: ["public-content", pageKey, lang] });
    setNotice(publish ? "Sisältö julkaistiin." : "Luonnos tallennettiin.");
  }

  async function saveContact() {
    if (
      contactForm.business_id !== fallbackContact.business_id &&
      !/^\d{7}-\d$/.test(contactForm.business_id)
    ) {
      setNotice("Y-tunnuksen muoto ei ole kelvollinen. Muoto on 1234567-8.");
      return;
    }
    setBusy(true);
    setNotice(null);
    const { error } = await supabase
      .from("site_contact_details")
      .upsert({ id: "default", ...contactForm }, { onConflict: "id" });
    setBusy(false);
    if (error) {
      setNotice("Yhteystietoja ei voitu tallentaa.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-site-contact"] });
    await queryClient.invalidateQueries({ queryKey: ["public-site-contact"] });
    setNotice("Yhteystiedot tallennettiin.");
  }

  if (contentsLoading) return <p className="text-muted-foreground">Ladataan sisältöjä…</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Sisällönhallinta</p>
        <h2 className="mt-2 text-4xl">Sivuston sisällöt</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Muokkaa tekstejä ja kuvia sivukohtaisesti. Julkaisematon sisältö ei näy julkisella
          sivustolla, ja puuttuva tietokantarivi käyttää nykyistä lähdekoodin oletussisältöä.
        </p>
      </div>

      {notice && (
        <p role="status" className="rounded-md border border-primary/30 bg-card px-4 py-3 text-sm">
          {notice}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tekstisisällöt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="content-page">Sivu</Label>
              <select
                id="content-page"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={pageKey}
                onChange={(event) => setPageKey(event.target.value as ContentPageKey)}
              >
                {contentPages.map((page) => (
                  <option key={page.key} value={page.key}>
                    {page.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-language">Kieli</Label>
              <select
                id="content-language"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={lang}
                onChange={(event) => setLang(event.target.value as ContentLanguage)}
              >
                {contentLanguages.map((value) => (
                  <option key={value} value={value}>
                    {value.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {fieldGroups.map((group) => (
            <section key={group.title || "content-fields"} className="space-y-4">
              {group.title && <h3 className="border-b border-border pb-2 text-2xl">{group.title}</h3>}
              <div className="space-y-4">
                {group.fields.map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={`content-${field}`}>{contentFieldLabel(field)}</Label>
                    <Textarea
                      id={`content-${field}`}
                      rows={field === "body" ? 7 : field.endsWith("Body") ? 5 : 3}
                      value={values[field] ?? ""}
                      onChange={(event) =>
                        setValues((previous) => ({ ...previous, [field]: event.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
          <div className="rounded-md border border-dashed border-primary/40 bg-secondary/20 p-5">
            <p className="eyebrow">Luonnoksen esikatselu</p>
            <h3 className="mt-3 text-2xl text-primary">{values.title || "Otsikko"}</h3>
            {values.headline && <h4 className="mt-3 text-lg">{values.headline}</h4>}
            {values.body && (
              <p className="managed-copy mt-3 text-sm leading-relaxed text-muted-foreground">
                {values.body}
              </p>
            )}
            {pageKey === "home" && (
              <div className="mt-6 space-y-4 border-t border-border/70 pt-5">
                <div>
                  <p className="eyebrow">{values.pricingTitle || "Hinnoittelu"}</p>
                  <p className="managed-copy mt-2 text-sm text-muted-foreground">
                    {values.pricingMonthlyDescription}
                  </p>
                  <p className="managed-copy mt-2 text-sm text-muted-foreground">
                    {values.pricingServiceDescription}
                  </p>
                </div>
                <div>
                  <p className="eyebrow">{values.valuesEyebrow || "Arvomme"}</p>
                  <h4 className="mt-2 text-xl text-primary">{values.valuesTitle}</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="rounded-md border border-border bg-background p-3">
                        <p className="font-medium">{values[`value${index}Title` as ContentField]}</p>
                        <p className="managed-copy mt-1 text-sm text-muted-foreground">
                          {values[`value${index}Body` as ContentField]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {(values.cta || values.secondary) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground">
                  {values.cta || "Painike"}
                </span>
                {values.secondary && (
                  <span className="rounded-md border border-primary px-3 py-2 text-xs text-primary">
                    {values.secondary}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled={busy} onClick={() => void saveContent(false)}>
              <Save aria-hidden="true" />
              Tallenna luonnos
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void saveContent(true)}>
              <Check aria-hidden="true" />
              Julkaise
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => setValues(contentEditorValues(pageKey, lang, currentRecord))}
            >
              <RotateCcw aria-hidden="true" />
              Peruuta muutokset
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Julkaistu sisältö:{" "}
            {currentRecord?.published_at
              ? new Date(currentRecord.published_at).toLocaleString("fi-FI")
              : "ei vielä"}
            .
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yrityksen yhteystiedot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {(["public_email", "public_phone", "public_address", "business_id"] as const).map(
            (field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={`contact-${field}`}>
                  {field === "public_email"
                    ? "Julkinen sähköposti"
                    : field === "public_phone"
                      ? "Julkinen puhelin"
                      : field === "public_address"
                        ? "Julkinen osoite"
                        : "Y-tunnus"}
                </Label>
                <Input
                  id={`contact-${field}`}
                  value={contactForm[field]}
                  onChange={(event) =>
                    setContactForm((previous) => ({ ...previous, [field]: event.target.value }))
                  }
                />
              </div>
            ),
          )}
          <div className="md:col-span-2">
            <Button disabled={busy} onClick={() => void saveContact()}>
              <Save aria-hidden="true" />
              Tallenna yhteystiedot
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Julkinen sähköposti ei muuta Resend-ilmoitusten vastaanottajia.
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
