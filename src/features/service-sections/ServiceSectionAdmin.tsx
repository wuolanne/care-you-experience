import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { adminServiceSectionsQuery } from "@/features/content/queries";
import { contentLanguages, type ContentLanguage } from "@/features/content/model";
import {
  adminServiceSectionValues,
  sectionTypes,
  serviceTypes,
  serviceSectionPayload,
  type SectionType,
  type ServiceSectionItem,
  type ServiceSectionValues,
  type ServiceType,
} from "./model";
import { serviceIconOptions } from "./icons";

type Props = {
  heading: string;
  description: string;
  initialSectionType?: SectionType;
  onlySection?: SectionType;
};

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `00000000-0000-4000-8000-${Date.now()}`;
}

function cloneSection(section: ServiceSectionValues): ServiceSectionValues {
  return { ...section, items: section.items.map((item) => ({ ...item })) };
}

export function ServiceSectionAdmin({
  heading,
  description,
  initialSectionType = "services",
  onlySection,
}: Props) {
  const queryClient = useQueryClient();
  const { data: snapshot, isLoading } = useQuery(adminServiceSectionsQuery);
  const [serviceType, setServiceType] = useState<ServiceType>("home");
  const [sectionType, setSectionType] = useState<SectionType>(onlySection ?? initialSectionType);
  const [lang, setLang] = useState<ContentLanguage>("fi");
  const [form, setForm] = useState(() =>
    adminServiceSectionValues(undefined, "home", onlySection ?? initialSectionType, "fi"),
  );
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const draft = useMemo(
    () => adminServiceSectionValues(snapshot, serviceType, sectionType, lang),
    [lang, sectionType, serviceType, snapshot],
  );

  useEffect(() => setForm(cloneSection(draft)), [draft]);

  function updateItem(
    id: string,
    field: keyof ServiceSectionItem,
    value: string | boolean | number,
  ) {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  }

  function addItem() {
    setForm((previous) => ({
      ...previous,
      items: [
        ...previous.items,
        {
          id: newId(),
          icon: "sparkles",
          displayOrder: previous.items.length,
          visible: true,
          title: "",
          description: "",
        },
      ],
    }));
  }

  async function removeItem(id: string) {
    if (!window.confirm("Poistetaanko tämä palvelukortti?")) return;
    setBusy(true);
    const { error } = await supabase.rpc("admin_delete_service_section_item", { p_id: id });
    setBusy(false);
    if (error) {
      setNotice("Korttia ei voitu poistaa. Tarkista migraatio 0013 ja ylläpitäjän oikeudet.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-service-sections"] });
    setNotice("Kortti poistettiin luonnoksesta.");
  }

  async function save(publish: boolean) {
    if (form.items.some((item) => !Number.isInteger(item.displayOrder) || item.displayOrder < 0)) {
      setNotice(
        "Korttien järjestysnumeroiden pitää olla nollaa suurempia tai yhtä suuria kokonaislukuja.",
      );
      return;
    }
    setBusy(true);
    setNotice(null);
    const { error } = await supabase.rpc("admin_upsert_service_section", {
      ...serviceSectionPayload(form),
      p_publish: publish,
    });
    setBusy(false);
    if (error) {
      setNotice("Sisältöä ei voitu tallentaa. Tarkista migraatio 0013 ja ylläpitäjän oikeudet.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-service-sections"] });
    await queryClient.invalidateQueries({
      queryKey: ["public-service-section", serviceType, sectionType],
    });
    setNotice(publish ? "Sisältö julkaistiin." : "Luonnos tallennettiin.");
  }

  if (isLoading) return <p className="text-muted-foreground">Ladataan sisältöjä…</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="service-section-service">Palvelu</Label>
            <select
              id="service-section-service"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value as ServiceType)}
            >
              {serviceTypes.map((value) => (
                <option key={value} value={value}>
                  {value === "home" ? "TGN Kotiin" : "TGN Yrityksille"}
                </option>
              ))}
            </select>
          </div>
          {!onlySection && (
            <div className="space-y-2">
              <Label htmlFor="service-section-type">Osio</Label>
              <select
                id="service-section-type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={sectionType}
                onChange={(event) => setSectionType(event.target.value as SectionType)}
              >
                {sectionTypes.map((value) => (
                  <option key={value} value={value}>
                    {value === "services" ? "Palvelut" : "Asiakasedut"}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="service-section-language">Kieli</Label>
            <select
              id="service-section-language"
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

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="service-section-title">Osion otsikko</Label>
            <Input
              id="service-section-title"
              value={form.title}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, title: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service-section-body">Osion johdanto</Label>
            <Textarea
              id="service-section-body"
              rows={3}
              value={form.body}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, body: event.target.value }))
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl text-primary">Kortit</h3>
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus aria-hidden="true" /> Lisää kortti
            </Button>
          </div>
          {form.items.map((item) => (
            <div key={item.id} className="space-y-4 rounded-md border border-border p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                <div className="space-y-2">
                  <Label htmlFor={`service-title-${item.id}`}>Kortin otsikko</Label>
                  <Input
                    id={`service-title-${item.id}`}
                    value={item.title}
                    onChange={(event) => updateItem(item.id, "title", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`service-icon-${item.id}`}>Kuvake</Label>
                  <select
                    id={`service-icon-${item.id}`}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    value={item.icon}
                    onChange={(event) => updateItem(item.id, "icon", event.target.value)}
                  >
                    {serviceIconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`service-order-${item.id}`}>Järjestys</Label>
                  <Input
                    id={`service-order-${item.id}`}
                    type="number"
                    min="0"
                    step="1"
                    value={item.displayOrder}
                    onChange={(event) =>
                      updateItem(item.id, "displayOrder", Number(event.target.value))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`service-description-${item.id}`}>Kuvaus</Label>
                <Textarea
                  id={`service-description-${item.id}`}
                  rows={3}
                  value={item.description}
                  onChange={(event) => updateItem(item.id, "description", event.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(event) => updateItem(item.id, "visible", event.target.checked)}
                  />{" "}
                  Näkyvissä julkaistussa sisällössä
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive"
                  disabled={busy}
                  onClick={() => void removeItem(item.id)}
                >
                  <Trash2 aria-hidden="true" /> Poista
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-dashed border-primary/40 bg-secondary/20 p-5">
          <p className="eyebrow">Esikatselu</p>
          <h3 className="mt-3 text-2xl text-primary">{form.title}</h3>
          {form.body && <p className="mt-2 text-sm text-muted-foreground">{form.body}</p>}
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {form.items
              .filter((item) => item.visible && (item.title || item.description))
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((item) => (
                <div key={item.id} className="rounded-md border border-border bg-card p-4">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
          </div>
        </div>

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
            <Save aria-hidden="true" /> Tallenna luonnos
          </Button>
          <Button variant="secondary" disabled={busy} onClick={() => void save(true)}>
            <Check aria-hidden="true" /> Julkaise
          </Button>
          <Button variant="outline" disabled={busy} onClick={() => setForm(cloneSection(draft))}>
            <RotateCcw aria-hidden="true" /> Peruuta muutokset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
