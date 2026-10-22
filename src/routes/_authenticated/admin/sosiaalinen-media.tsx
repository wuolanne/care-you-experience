import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminSocialLinksQuery } from "@/features/content/queries";
import { isSafeExternalUrl, makeWhatsAppUrl, socialServiceLabels } from "@/features/content/model";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/sosiaalinen-media")({
  component: SocialMediaAdmin,
});

type SocialForm = { url: string; visible: boolean; display_order: string };
type SocialKey = keyof typeof socialServiceLabels;
const socialKeys = Object.keys(socialServiceLabels) as SocialKey[];

function SocialMediaAdmin() {
  const queryClient = useQueryClient();
  const { data: links = [], isLoading } = useQuery(adminSocialLinksQuery);
  const [forms, setForms] = useState<Record<SocialKey, SocialForm>>(
    () =>
      Object.fromEntries(
        socialKeys.map((key, index) => [
          key,
          { url: "", visible: false, display_order: String(index) },
        ]),
      ) as Record<SocialKey, SocialForm>,
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForms(
      (previous) =>
        Object.fromEntries(
          socialKeys.map((key, index) => {
            const stored = links.find((link) => link.service_key === key);
            return [
              key,
              {
                url: stored?.url ?? previous[key]?.url ?? "",
                visible: stored?.visible ?? previous[key]?.visible ?? false,
                display_order: String(
                  stored?.display_order ?? previous[key]?.display_order ?? index,
                ),
              },
            ];
          }),
        ) as Record<SocialKey, SocialForm>,
    );
  }, [links]);

  function setField(key: SocialKey, field: keyof SocialForm, value: string | boolean) {
    setForms((previous) => ({ ...previous, [key]: { ...previous[key], [field]: value } }));
  }

  async function save() {
    for (const key of socialKeys) {
      const value = forms[key].url.trim();
      if (!value) continue;
      const normalized =
        key === "whatsapp" && !value.startsWith("http") ? makeWhatsAppUrl(value) : value;
      if (!normalized || !isSafeExternalUrl(normalized)) {
        setNotice(`${socialServiceLabels[key]}-linkin osoite ei ole turvallinen http(s)-osoite.`);
        return;
      }
    }
    setBusy(true);
    setNotice(null);
    const payload = socialKeys.map((key) => {
      const value = forms[key].url.trim();
      const normalized =
        key === "whatsapp" && !value.startsWith("http") ? (makeWhatsAppUrl(value) ?? "") : value;
      return {
        service_key: key,
        label: socialServiceLabels[key],
        url: normalized,
        visible: forms[key].visible && Boolean(normalized),
        display_order: Number(forms[key].display_order) || 0,
      };
    });
    const { error } = await supabase
      .from("social_links")
      .upsert(payload, { onConflict: "service_key" });
    setBusy(false);
    if (error) {
      setNotice("Sosiaalisen median asetuksia ei voitu tallentaa.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
    await queryClient.invalidateQueries({ queryKey: ["public-social-links"] });
    setNotice("Sosiaalisen median asetukset tallennettiin.");
  }

  if (isLoading)
    return <p className="text-muted-foreground">Ladataan sosiaalisen median asetuksia…</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Some-linkit</p>
        <h2 className="mt-2 text-4xl">Sosiaalinen media</h2>
        <p className="mt-2 text-muted-foreground">
          Tyhjät tai virheelliset linkit eivät näy julkisessa footerissa. WhatsApp-numero muunnetaan
          turvalliseksi wa.me-linkiksi.
        </p>
      </div>
      {notice && (
        <p role="status" className="rounded-md border border-primary/30 bg-card px-4 py-3 text-sm">
          {notice}
        </p>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Footerin nykyiset kuvakkeet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {socialKeys.map((key) => (
            <div
              key={key}
              className="grid gap-3 rounded-md border p-4 md:grid-cols-[10rem_1fr_auto_auto] md:items-end"
            >
              <div>
                <p className="font-medium">{socialServiceLabels[key]}</p>
                <p className="text-xs text-muted-foreground">
                  {key === "whatsapp" ? "Numero tai wa.me-linkki" : "Profiilin URL"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`social-${key}`}>URL</Label>
                <Input
                  id={`social-${key}`}
                  value={forms[key].url}
                  onChange={(event) => setField(key, "url", event.target.value)}
                  placeholder={key === "whatsapp" ? "+358..." : "https://..."}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={forms[key].visible}
                  onChange={(event) => setField(key, "visible", event.target.checked)}
                />{" "}
                Näkyvissä
              </label>
              <div className="space-y-2">
                <Label htmlFor={`social-order-${key}`}>Järjestys</Label>
                <Input
                  id={`social-order-${key}`}
                  type="number"
                  min="0"
                  value={forms[key].display_order}
                  onChange={(event) => setField(key, "display_order", event.target.value)}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <Button disabled={busy} onClick={() => void save()}>
              <Save aria-hidden="true" />
              Tallenna asetukset
            </Button>
            <span className="text-xs text-muted-foreground">
              <ExternalLink className="mr-1 inline size-3" />
              Linkit avautuvat uuteen välilehteen.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
