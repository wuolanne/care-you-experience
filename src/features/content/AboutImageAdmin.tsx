import { useEffect, useMemo, useState } from "react";
import { ImagePlus, RotateCcw, Save } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publicImageUrl } from "./model";
import { contentLanguages, type ContentLanguage } from "./model";
import { adminAboutImageQuery } from "./queries";
import { supabase } from "@/integrations/supabase/client";

type ImageRow = {
  draft_path: string | null;
  published_path: string | null;
};

type AltRow = {
  lang: ContentLanguage;
  draft_alt_text: string;
  published_alt_text: string;
};

type ImageInspection = {
  width: number;
  height: number;
  ratioWarning: boolean;
};

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function stringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseImageData(value: unknown): { image: ImageRow; texts: AltRow[] } {
  const data = record(value);
  const image = record(data["image"]);
  const texts = Array.isArray(data["texts"]) ? data["texts"] : [];
  return {
    image: {
      draft_path: typeof image["draft_path"] === "string" ? image["draft_path"] : null,
      published_path: typeof image["published_path"] === "string" ? image["published_path"] : null,
    },
    texts: texts.flatMap((item) => {
      const row = record(item);
      const lang = row["lang"];
      if (!contentLanguages.includes(lang as ContentLanguage)) return [];
      return [
        {
          lang: lang as ContentLanguage,
          draft_alt_text: stringOrEmpty(row["draft_alt_text"]),
          published_alt_text: stringOrEmpty(row["published_alt_text"]),
        },
      ];
    }),
  };
}

function extensionFor(file: File): string {
  return file.type === "image/jpeg" ? "jpg" : (file.type.split("/")[1] ?? "png");
}

function inspectImage(file: File): Promise<ImageInspection | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = image.width / image.height;
      resolve({
        width: image.width,
        height: image.height,
        ratioWarning: Math.abs(ratio - 0.8) > 0.03,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
}

export function AboutImageAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminAboutImageQuery);
  const parsed = useMemo(() => parseImageData(data), [data]);
  const [file, setFile] = useState<File | null>(null);
  const [inspection, setInspection] = useState<ImageInspection | null>(null);
  const [draftAltTexts, setDraftAltTexts] = useState<Record<ContentLanguage, string>>({
    fi: "",
    sv: "",
    es: "",
    en: "",
  });
  const [draftPreviewUrl, setDraftPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const next = { fi: "", sv: "", es: "", en: "" } as Record<ContentLanguage, string>;
    for (const row of parsed.texts) next[row.lang] = row.draft_alt_text;
    setDraftAltTexts(next);
  }, [parsed.texts]);

  useEffect(() => {
    let active = true;
    setDraftPreviewUrl(null);
    if (!parsed.image.draft_path) return;
    void supabase.storage
      .from("site-images-drafts")
      .createSignedUrl(parsed.image.draft_path, 60 * 60)
      .then(({ data: signed, error }) => {
        if (active && !error) setDraftPreviewUrl(signed.signedUrl);
      });
    return () => {
      active = false;
    };
  }, [parsed.image.draft_path]);

  const localPreviewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    if (!localPreviewUrl) return;
    return () => URL.revokeObjectURL(localPreviewUrl);
  }, [localPreviewUrl]);

  async function selectFile(nextFile: File | null) {
    setFile(nextFile);
    setInspection(nextFile ? await inspectImage(nextFile) : null);
  }

  function reset() {
    setFile(null);
    setInspection(null);
    const next = { fi: "", sv: "", es: "", en: "" } as Record<ContentLanguage, string>;
    for (const row of parsed.texts) next[row.lang] = row.draft_alt_text;
    setDraftAltTexts(next);
    setNotice(null);
  }

  async function save(publish: boolean) {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/avif"];
    if (file && (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setNotice("Kuvan pitää olla JPG-, PNG-, WebP- tai AVIF-kuva ja enintään 5 Mt.");
      return;
    }
    setBusy(true);
    setNotice(null);
    let draftPath = parsed.image.draft_path;
    let newDraftPath: string | null = null;
    let newPublishedPath: string | null = null;

    if (file) {
      draftPath = `about/main/${crypto.randomUUID()}.${extensionFor(file)}`;
      newDraftPath = draftPath;
      const upload = await supabase.storage.from("site-images-drafts").upload(draftPath, file, {
        contentType: file.type,
        upsert: false,
      });
      if (upload.error) {
        setBusy(false);
        setNotice("Kuvaa ei voitu ladata luonnosbucketiin.");
        return;
      }
    }

    let publishedPath = parsed.image.published_path;
    if (publish && draftPath) {
      newPublishedPath = `about/main/${crypto.randomUUID()}.${draftPath.split(".").pop() ?? "png"}`;
      const copy = await supabase.storage
        .from("site-images-drafts")
        .copy(draftPath, newPublishedPath, {
          destinationBucket: "site-images",
        });
      if (copy.error) {
        if (newDraftPath) await supabase.storage.from("site-images-drafts").remove([newDraftPath]);
        setBusy(false);
        setNotice("Kuvaa ei voitu julkaista. Vanha julkaistu kuva säilytettiin.");
        return;
      }
      publishedPath = newPublishedPath;
    }

    const { error } = await supabase.rpc("admin_upsert_about_image", {
      p_draft_path: draftPath,
      p_published_path: publishedPath,
      p_texts: contentLanguages.map((lang) => ({ lang, draftAltText: draftAltTexts[lang] })),
      p_publish: publish,
    });
    if (error) {
      if (newPublishedPath) await supabase.storage.from("site-images").remove([newPublishedPath]);
      if (newDraftPath) await supabase.storage.from("site-images-drafts").remove([newDraftPath]);
      setBusy(false);
      setNotice("Pääkuvaa ei voitu tallentaa. Vanha julkaistu kuva säilytettiin.");
      return;
    }
    if (
      publish &&
      newPublishedPath &&
      parsed.image.published_path &&
      parsed.image.published_path !== newPublishedPath
    ) {
      await supabase.storage.from("site-images").remove([parsed.image.published_path]);
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-about-image"] });
    await Promise.all(
      contentLanguages.map((lang) =>
        queryClient.invalidateQueries({ queryKey: ["public-site-image", "about", "main", lang] }),
      ),
    );
    setBusy(false);
    setFile(null);
    setInspection(null);
    setNotice(
      publish ? "Pääkuva julkaistiin kaikille kieliversioille." : "Pääkuvan luonnos tallennettiin.",
    );
  }

  if (isLoading) return <p className="text-muted-foreground">Ladataan pääkuvaa…</p>;

  const publishedUrl = publicImageUrl(parsed.image.published_path);
  const draftUrl = localPreviewUrl ?? draftPreviewUrl;
  const publishedAltByLang = Object.fromEntries(
    parsed.texts.map((row) => [row.lang, row.published_alt_text]),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lyhyesti meistä – pääkuva</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Yksi julkaistu kuva näkyy kaikilla kielillä. Alt-tekstit voi määrittää kielikohtaisesti.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Nykyinen julkaistu kuva</p>
            {publishedUrl ? (
              <img
                src={publishedUrl}
                alt={publishedAltByLang["fi"] || ""}
                className="max-h-80 w-full rounded-md border object-contain"
              />
            ) : (
              <p className="rounded-md border border-dashed p-5 text-sm text-muted-foreground">
                Ei julkaistua kuvaa.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Uusi kuvaluonnos</p>
            {draftUrl ? (
              <img
                src={draftUrl}
                alt="Luonnoksen esikatselu"
                className="max-h-80 w-full rounded-md border object-contain"
              />
            ) : (
              <p className="rounded-md border border-dashed p-5 text-sm text-muted-foreground">
                Ei uutta luonnosta.
              </p>
            )}
          </div>
        </div>
        <div className="rounded-md border border-dashed border-primary/40 bg-secondary/20 p-4 text-sm text-muted-foreground">
          <p>Suositeltu kuvakoko: 1200 × 1500 px</p>
          <p>Kuvasuhde: 4:5 (pystykuva)</p>
          <p>Tuetut tiedostomuodot: JPG, PNG, WebP ja AVIF</p>
          <p>Suurin tiedostokoko: 5 Mt</p>
          <p className="mt-2">
            Käytä mieluiten pystysuuntaista kuvaa. Muun kuvasuhteen kuva voi rajautua sivustolla.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="about-main-image">Uusi kuva</Label>
          <Input
            id="about-main-image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={(event) => void selectFile(event.target.files?.[0] ?? null)}
          />
          {inspection && (
            <p
              className={
                inspection.ratioWarning ? "text-sm text-amber-700" : "text-sm text-muted-foreground"
              }
            >
              {inspection.width} × {inspection.height} px
              {inspection.ratioWarning
                ? " – kuvasuhde poikkeaa suosituksesta (4:5)."
                : " – kuvasuhde vastaa suositusta."}
            </p>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {contentLanguages.map((lang) => (
            <div key={lang} className="space-y-2">
              <Label htmlFor={`about-main-alt-${lang}`}>Alt-teksti ({lang.toUpperCase()})</Label>
              <Input
                id={`about-main-alt-${lang}`}
                value={draftAltTexts[lang]}
                maxLength={300}
                onChange={(event) =>
                  setDraftAltTexts((previous) => ({ ...previous, [lang]: event.target.value }))
                }
              />
            </div>
          ))}
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
            <Save aria-hidden="true" />
            Tallenna luonnos
          </Button>
          <Button variant="secondary" disabled={busy} onClick={() => void save(true)}>
            <ImagePlus aria-hidden="true" />
            Julkaise kuva
          </Button>
          <Button variant="outline" disabled={busy} onClick={reset}>
            <RotateCcw aria-hidden="true" />
            Peruuta muutokset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
