import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { adminPricingQuery } from "@/features/content/queries";
import { contentLanguages, type ContentLanguage } from "@/features/content/model";
import {
  editorPricingValues,
  pricingPayload,
  pricingServices,
  publishedPricingValues,
  type PricingData,
  type PricingService,
} from "./model";

type PricingForm = {
  packages: Array<
    Omit<PricingData["packages"][number], "monthlyPrice" | "hours"> & {
      monthlyPrice: string;
      hours: string;
    }
  >;
  settings: Omit<PricingData["settings"], "hourlyPrice"> & { hourlyPrice: string };
};

function formFromData(data: PricingData): PricingForm {
  return {
    packages: data.packages.map((item) => ({
      ...item,
      monthlyPrice: String(item.monthlyPrice),
      hours: String(item.hours),
    })),
    settings: { ...data.settings, hourlyPrice: String(data.settings.hourlyPrice) },
  };
}

function numberInputValue(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function dataFromForm(form: PricingForm): { data: PricingData | null; error: string | null } {
  const packages = form.packages.map((item) => {
    const monthlyPrice = numberInputValue(String(item.monthlyPrice));
    const hours = numberInputValue(String(item.hours));
    return { item, monthlyPrice, hours };
  });
  if (
    packages.some(
      ({ monthlyPrice, hours }) =>
        monthlyPrice === null || monthlyPrice < 0 || hours === null || hours <= 0,
    )
  ) {
    return {
      data: null,
      error: "Hinnat eivät voi olla negatiivisia ja tuntimäärien pitää olla positiivisia.",
    };
  }
  const hourlyPrice = numberInputValue(String(form.settings.hourlyPrice));
  if (hourlyPrice === null || hourlyPrice < 0) {
    return { data: null, error: "Tuntihinnan pitää olla nolla tai suurempi." };
  }
  if (
    form.packages.some((item) => !item.name.trim() || !item.description.trim()) ||
    Object.values(form.settings.texts).some((value) => value !== null && !value.trim())
  ) {
    return { data: null, error: "Nimiä ja tekstikenttiä ei voi jättää tyhjiksi." };
  }
  return {
    data: {
      packages: packages.map(({ item, monthlyPrice, hours }) => ({
        ...item,
        monthlyPrice: monthlyPrice!,
        hours: hours!,
      })),
      settings: { ...form.settings, hourlyPrice },
    },
    error: null,
  };
}

export function PricingAdmin() {
  const queryClient = useQueryClient();
  const { data: snapshot, isLoading } = useQuery(adminPricingQuery);
  const [serviceType, setServiceType] = useState<PricingService>("home");
  const [lang, setLang] = useState<ContentLanguage>("fi");
  const [form, setForm] = useState<PricingForm>(() =>
    formFromData(editorPricingValues(undefined, "home", "fi")),
  );
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const draftData = useMemo(
    () => editorPricingValues(snapshot, serviceType, lang),
    [lang, serviceType, snapshot],
  );
  const publishedData = useMemo(
    () => publishedPricingValues(snapshot, serviceType, lang),
    [lang, serviceType, snapshot],
  );

  useEffect(() => {
    setForm(formFromData(draftData));
  }, [draftData]);

  const preview = useMemo(() => dataFromForm(form).data, [form]);
  const hasUnpublishedChanges = preview
    ? JSON.stringify(preview) !== JSON.stringify(publishedData)
    : true;

  function updatePackage(
    index: number,
    field: "name" | "monthlyPrice" | "hours" | "description",
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      packages: previous.packages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function updateText(field: keyof PricingData["settings"]["texts"], value: string) {
    setForm((previous) => ({
      ...previous,
      settings: { ...previous.settings, texts: { ...previous.settings.texts, [field]: value } },
    }));
  }

  async function save(publish: boolean) {
    const parsed = dataFromForm(form);
    if (!parsed.data) {
      setNotice(parsed.error);
      return;
    }
    setBusy(true);
    setNotice(null);
    const payload = pricingPayload(parsed.data);
    const { error } = await supabase.rpc("admin_upsert_service_pricing", {
      p_service_type: serviceType,
      p_lang: lang,
      p_packages: payload.packages,
      p_settings: payload.settings,
      p_texts: payload.texts,
      p_publish: publish,
    });
    setBusy(false);
    if (error) {
      setNotice(
        "Hinnoittelua ei voitu tallentaa. Tarkista migraatio 0011 ja ylläpitäjän oikeudet.",
      );
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
    await queryClient.invalidateQueries({ queryKey: ["public-pricing", serviceType] });
    setNotice(publish ? "Hinnoittelu julkaistiin." : "Hinnoitteluluonnos tallennettiin.");
  }

  if (isLoading) return <p className="text-muted-foreground">Ladataan hinnoittelua…</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Palveluiden hinnoittelu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pricing-service">Palvelu</Label>
            <select
              id="pricing-service"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value as PricingService)}
            >
              {pricingServices.map((value) => (
                <option key={value} value={value}>
                  {value === "home" ? "TGN Kotiin" : "TGN Yrityksille"}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricing-language">Kieli</Label>
            <select
              id="pricing-language"
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

        <div className="rounded-md border border-dashed border-primary/40 bg-secondary/20 p-4 text-sm">
          <p>
            Julkaistu versio:{" "}
            {hasUnpublishedChanges ? "julkaistu sisältö eroaa luonnoksesta" : "sama kuin luonnos"}.
          </p>
          <p className="mt-1 text-muted-foreground">
            Luonnos ei muuta julkista sivua ennen Julkaise-toimintoa. Numeeriset hinnat ovat
            palvelukohtaisia ja yhteisiä kaikille kielille.
          </p>
        </div>

        {form.packages.map((item, index) => (
          <div key={item.packageKey} className="space-y-4 rounded-md border border-border p-5">
            <h3 className="text-xl text-primary">Paketti {index + 1}</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`pricing-name-${item.packageKey}`}>Paketin nimi</Label>
                <Input
                  id={`pricing-name-${item.packageKey}`}
                  value={item.name}
                  onChange={(event) => updatePackage(index, "name", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`pricing-monthly-${item.packageKey}`}>Kuukausihinta</Label>
                <Input
                  id={`pricing-monthly-${item.packageKey}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.monthlyPrice}
                  onChange={(event) => updatePackage(index, "monthlyPrice", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`pricing-hours-${item.packageKey}`}>Tuntimäärä</Label>
                <Input
                  id={`pricing-hours-${item.packageKey}`}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.hours}
                  onChange={(event) => updatePackage(index, "hours", event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`pricing-description-${item.packageKey}`}>Paketin kuvaus</Label>
              <Textarea
                id={`pricing-description-${item.packageKey}`}
                rows={3}
                value={item.description}
                onChange={(event) => updatePackage(index, "description", event.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="space-y-4 rounded-md border border-border p-5">
          <h3 className="text-xl text-primary">Palvelun hinnoittelutekstit</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ["pricingHeading", "Hinnoittelun otsikko"],
                ["monthlyHeading", "Kuukausipakettien otsikko"],
                ["hourlyHeading", "Tuntihinnoittelun otsikko"],
                ["vatNotice", "ALV-teksti"],
              ] as const
            ).map(([field, label]) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={`pricing-text-${field}`}>{label}</Label>
                <Input
                  id={`pricing-text-${field}`}
                  value={form.settings.texts[field]}
                  onChange={(event) => updateText(field, event.target.value)}
                />
              </div>
            ))}
          </div>
          {(
            [
              ["pricingNote", "Hinnoittelun esittelyteksti"],
              ["hourlyDescription", "Tuntihinnoittelun esittelyteksti"],
            ] as const
          ).map(([field, label]) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={`pricing-text-${field}`}>{label}</Label>
              <Textarea
                id={`pricing-text-${field}`}
                rows={3}
                value={form.settings.texts[field]}
                onChange={(event) => updateText(field, event.target.value)}
              />
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="pricing-hourly-price">Kertatilauksen tuntihinta</Label>
            <Input
              id="pricing-hourly-price"
              type="number"
              min="0"
              step="0.01"
              value={form.settings.hourlyPrice}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  settings: { ...previous.settings, hourlyPrice: event.target.value },
                }))
              }
            />
          </div>
          {serviceType === "home" && (
            <>
              {(
                [
                  ["deductionTitle", "Kotitalousvähennyksen otsikko"],
                  ["deductionLinkLabel", "Verolinkin teksti"],
                ] as const
              ).map(([field, label]) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`pricing-text-${field}`}>{label}</Label>
                  <Input
                    id={`pricing-text-${field}`}
                    value={form.settings.texts[field] ?? ""}
                    onChange={(event) => updateText(field, event.target.value)}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="pricing-text-deductionBody">
                  Kotitalousvähennyksen esittelyteksti
                </Label>
                <Textarea
                  id="pricing-text-deductionBody"
                  rows={5}
                  value={form.settings.texts.deductionBody ?? ""}
                  onChange={(event) => updateText("deductionBody", event.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {preview && (
          <div className="rounded-md border border-dashed border-primary/40 bg-secondary/20 p-5">
            <p className="eyebrow">Hinnoittelun esikatselu</p>
            <h3 className="mt-3 text-2xl text-primary">{preview.settings.texts.pricingHeading}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {preview.settings.texts.pricingNote}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {preview.packages.map((item) => (
                <div key={item.packageKey} className="rounded-md border border-border bg-card p-4">
                  <h4 className="text-lg text-primary">{item.name}</h4>
                  <p className="mt-1 text-sm">
                    {item.monthlyPrice.toFixed(2)} € · {item.hours} h
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {preview.settings.texts.hourlyHeading}: {preview.settings.hourlyPrice.toFixed(2)} € /
              h
            </p>
          </div>
        )}

        {notice && (
          <p
            role="status"
            className="rounded-md border border-primary/30 bg-card px-4 py-3 text-sm"
          >
            {notice}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Button disabled={busy} onClick={() => void save(false)}>
            <Save aria-hidden="true" />
            Tallenna luonnos
          </Button>
          <Button variant="secondary" disabled={busy} onClick={() => void save(true)}>
            <Check aria-hidden="true" />
            Julkaise
          </Button>
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => setForm(formFromData(draftData))}
          >
            <RotateCcw aria-hidden="true" />
            Peruuta muutokset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
