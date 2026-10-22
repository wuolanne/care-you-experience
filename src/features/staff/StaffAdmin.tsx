import { useEffect, useMemo, useState } from "react";
import { Check, EyeOff, Plus, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { publicImageUrl } from "@/features/content/model";
import { adminStaffQuery } from "@/features/content/queries";
import { contentLanguages, type ContentLanguage } from "@/features/content/model";
import { staffLanguages, type StaffAdminMember, type StaffAdminSnapshot } from "./model";

type StaffForm = {
  id: string;
  displayName: string;
  displayOrder: string;
  visible: boolean;
  draftImagePath: string | null;
  publishedImagePath: string | null;
  texts: Record<ContentLanguage, { jobTitle: string; bio: string; altText: string }>;
};

type ImageInspection = { width: number; height: number; ratioWarning: boolean };

function newTexts(): StaffForm["texts"] {
  return {
    fi: { jobTitle: "", bio: "", altText: "" },
    sv: { jobTitle: "", bio: "", altText: "" },
    es: { jobTitle: "", bio: "", altText: "" },
    en: { jobTitle: "", bio: "", altText: "" },
  };
}

function newForm(): StaffForm {
  return {
    id: crypto.randomUUID(),
    displayName: "",
    displayOrder: "0",
    visible: false,
    draftImagePath: null,
    publishedImagePath: null,
    texts: newTexts(),
  };
}

function formFromMember(member: StaffAdminMember, snapshot: StaffAdminSnapshot): StaffForm {
  const texts = newTexts();
  for (const row of snapshot.texts.filter((item) => item.staffId === member.id)) {
    texts[row.lang] = {
      jobTitle: row.draftJobTitle,
      bio: row.draftBio,
      altText: row.draftAltText,
    };
  }
  return {
    id: member.id,
    displayName: member.draftDisplayName,
    displayOrder: String(member.draftDisplayOrder),
    visible: member.draftVisible,
    draftImagePath: member.draftImagePath,
    publishedImagePath: member.publishedImagePath,
    texts,
  };
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
        ratioWarning: Math.abs(ratio - 0.75) > 0.03,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
}

function extensionFor(file: File): string {
  return file.type === "image/jpeg" ? "jpg" : (file.type.split("/")[1] ?? "png");
}

export function StaffAdmin() {
  const queryClient = useQueryClient();
  const { data: snapshot, isLoading } = useQuery(adminStaffQuery);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<StaffForm | null>(null);
  const [textLang, setTextLang] = useState<ContentLanguage>("fi");
  const [file, setFile] = useState<File | null>(null);
  const [inspection, setInspection] = useState<ImageInspection | null>(null);
  const [draftPreviewUrl, setDraftPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const members = useMemo(() => snapshot?.members ?? [], [snapshot?.members]);
  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedId),
    [members, selectedId],
  );

  useEffect(() => {
    if (selectedId && snapshot && selectedMember) setForm(formFromMember(selectedMember, snapshot));
  }, [selectedId, selectedMember, snapshot]);

  useEffect(() => {
    let active = true;
    setDraftPreviewUrl(null);
    if (!form?.draftImagePath) return;
    void supabase.storage
      .from("site-images-drafts")
      .createSignedUrl(form.draftImagePath, 60 * 60)
      .then(({ data, error }) => {
        if (active && !error) setDraftPreviewUrl(data.signedUrl);
      });
    return () => {
      active = false;
    };
  }, [form?.draftImagePath]);

  const localPreviewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    if (!localPreviewUrl) return;
    return () => URL.revokeObjectURL(localPreviewUrl);
  }, [localPreviewUrl]);

  function chooseMember(member: StaffAdminMember) {
    if (!snapshot) return;
    setSelectedId(member.id);
    setForm(formFromMember(member, snapshot));
    setFile(null);
    setInspection(null);
    setNotice(null);
  }

  function addMember() {
    setSelectedId(null);
    setForm(newForm());
    setFile(null);
    setInspection(null);
    setNotice(null);
  }

  function reset() {
    if (snapshot && selectedMember) setForm(formFromMember(selectedMember, snapshot));
    else if (form) setForm(newForm());
    setFile(null);
    setInspection(null);
    setNotice(null);
  }

  function updateText(field: "jobTitle" | "bio" | "altText", value: string) {
    setForm((previous) =>
      previous
        ? {
            ...previous,
            texts: {
              ...previous.texts,
              [textLang]: { ...previous.texts[textLang], [field]: value },
            },
          }
        : previous,
    );
  }

  async function selectFile(nextFile: File | null) {
    setFile(nextFile);
    setInspection(nextFile ? await inspectImage(nextFile) : null);
  }

  async function save(publish: boolean) {
    if (!form) return;
    const displayOrder = Number(form.displayOrder);
    const publicText = Object.values(form.texts).some(
      (text) => text.jobTitle.trim() || text.bio.trim(),
    );
    if (!Number.isInteger(displayOrder) || displayOrder < 0) {
      setNotice("Näyttöjärjestyksen pitää olla nollaa suurempi tai yhtä suuri kokonaisluku.");
      return;
    }
    if (publish && !form.displayName.trim() && !form.publishedImagePath && !file && !publicText) {
      setNotice("Henkilöä ei voi julkaista täysin tyhjänä.");
      return;
    }
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/avif"];
    if (file && (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setNotice("Henkilökuvan pitää olla JPG-, PNG-, WebP- tai AVIF-kuva ja enintään 5 Mt.");
      return;
    }

    setBusy(true);
    setNotice(null);
    let draftImagePath = form.draftImagePath;
    let publishedImagePath = form.publishedImagePath;
    let newDraftPath: string | null = null;
    let newPublishedPath: string | null = null;
    if (file) {
      draftImagePath = `staff/${form.id}/${crypto.randomUUID()}.${extensionFor(file)}`;
      newDraftPath = draftImagePath;
      const upload = await supabase.storage
        .from("site-images-drafts")
        .upload(draftImagePath, file, {
          contentType: file.type,
          upsert: false,
        });
      if (upload.error) {
        setBusy(false);
        setNotice("Henkilökuvaa ei voitu ladata luonnosbucketiin.");
        return;
      }
    }
    if (publish && draftImagePath) {
      newPublishedPath = `staff/${form.id}/${crypto.randomUUID()}.${draftImagePath.split(".").pop() ?? "png"}`;
      const copy = await supabase.storage
        .from("site-images-drafts")
        .copy(draftImagePath, newPublishedPath, {
          destinationBucket: "site-images",
        });
      if (copy.error) {
        if (newDraftPath) await supabase.storage.from("site-images-drafts").remove([newDraftPath]);
        setBusy(false);
        setNotice("Henkilökuvaa ei voitu julkaista. Vanha julkaistu kuva säilytettiin.");
        return;
      }
      publishedImagePath = newPublishedPath;
    }

    const { error } = await supabase.rpc("admin_upsert_staff_member", {
      p_id: form.id,
      p_member: {
        displayName: form.displayName.trim(),
        displayOrder,
        visible: form.visible,
        draftImagePath,
        publishedImagePath,
      },
      p_texts: staffLanguages.map((lang) => ({
        lang,
        draftJobTitle: form.texts[lang].jobTitle.trim(),
        draftBio: form.texts[lang].bio.trim(),
        draftAltText: form.texts[lang].altText.trim(),
      })),
      p_publish: publish,
    });
    if (error) {
      if (newPublishedPath) await supabase.storage.from("site-images").remove([newPublishedPath]);
      if (newDraftPath) await supabase.storage.from("site-images-drafts").remove([newDraftPath]);
      setBusy(false);
      setNotice("Henkilöä ei voitu tallentaa. Tarkista migraatio 0012 ja ylläpitäjän oikeudet.");
      return;
    }
    if (
      publish &&
      newPublishedPath &&
      form.publishedImagePath &&
      form.publishedImagePath !== newPublishedPath
    ) {
      await supabase.storage.from("site-images").remove([form.publishedImagePath]);
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
    await Promise.all(
      contentLanguages.map((lang) =>
        queryClient.invalidateQueries({ queryKey: ["public-staff", lang] }),
      ),
    );
    setSelectedId(form.id);
    setBusy(false);
    setFile(null);
    setInspection(null);
    setNotice(publish ? "Henkilö julkaistiin." : "Henkilön luonnos tallennettiin.");
  }

  async function hideMember() {
    if (!form) return;
    setBusy(true);
    const { error } = await supabase.rpc("admin_set_staff_visibility", {
      p_id: form.id,
      p_visible: false,
    });
    if (!error) {
      await queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      await Promise.all(
        contentLanguages.map((lang) =>
          queryClient.invalidateQueries({ queryKey: ["public-staff", lang] }),
        ),
      );
      setNotice("Henkilö piilotettiin.");
    } else {
      setNotice("Henkilöä ei voitu piilottaa.");
    }
    setBusy(false);
  }

  async function removeMember() {
    if (!form || !window.confirm("Poistetaanko henkilö ja hänen tietonsa?")) return;
    setBusy(true);
    const { data, error } = await supabase.rpc("admin_delete_staff_member", { p_id: form.id });
    if (!error) {
      const deleted = (typeof data === "object" && data !== null ? data : {}) as Record<
        string,
        unknown
      >;
      const draftPath =
        typeof deleted["draftImagePath"] === "string" ? deleted["draftImagePath"] : null;
      const publishedPath =
        typeof deleted["publishedImagePath"] === "string" ? deleted["publishedImagePath"] : null;
      if (draftPath) {
        await supabase.storage.from("site-images-drafts").remove([draftPath]);
      }
      if (publishedPath) {
        await supabase.storage.from("site-images").remove([publishedPath]);
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      await Promise.all(
        contentLanguages.map((lang) =>
          queryClient.invalidateQueries({ queryKey: ["public-staff", lang] }),
        ),
      );
      setSelectedId(null);
      setForm(null);
      setNotice("Henkilö poistettiin.");
    } else {
      setNotice("Henkilöä ei voitu poistaa.");
    }
    setBusy(false);
  }

  if (isLoading) return <p className="text-muted-foreground">Ladataan henkilöstöä…</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Henkilöstön hallinta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Lisää ja julkaise vain oikeat henkilötiedot. Henkilömäärää ei ole rajoitettu.
          </p>
          <Button onClick={addMember}>
            <Plus aria-hidden="true" />
            Lisää henkilö
          </Button>
        </div>
        {members.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <button
                type="button"
                key={member.id}
                className={`rounded-md border p-4 text-left ${selectedId === member.id ? "border-primary bg-secondary/30" : "border-border"}`}
                onClick={() => chooseMember(member)}
              >
                <span className="block font-medium">
                  {member.draftDisplayName || "Nimetön luonnos"}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Järjestys {member.draftDisplayOrder} ·{" "}
                  {member.visible ? "julkaistu" : "piilotettu"}
                </span>
              </button>
            ))}
          </div>
        )}
        {form && (
          <div className="space-y-5 rounded-md border border-border p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="staff-display-name">Julkinen näyttönimi</Label>
                <Input
                  id="staff-display-name"
                  value={form.displayName}
                  onChange={(event) =>
                    setForm((previous) =>
                      previous ? { ...previous, displayName: event.target.value } : previous,
                    )
                  }
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-display-order">Näyttöjärjestys</Label>
                <Input
                  id="staff-display-order"
                  type="number"
                  min="0"
                  step="1"
                  value={form.displayOrder}
                  onChange={(event) =>
                    setForm((previous) =>
                      previous ? { ...previous, displayOrder: event.target.value } : previous,
                    )
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <input
                id="staff-visible"
                type="checkbox"
                checked={form.visible}
                onChange={(event) =>
                  setForm((previous) =>
                    previous ? { ...previous, visible: event.target.checked } : previous,
                  )
                }
              />
              <Label htmlFor="staff-visible">Näkyy julkaisussa</Label>
            </div>
            <div className="space-y-3">
              <Label htmlFor="staff-image">Henkilökuva</Label>
              <Input
                id="staff-image"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={(event) => void selectFile(event.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-muted-foreground">
                Suositeltu koko: 900 × 1200 px · kuvasuhde 3:4 · JPG, PNG, WebP tai AVIF · enintään
                5 Mt.
              </p>
              {inspection && (
                <p
                  className={
                    inspection.ratioWarning
                      ? "text-sm text-amber-700"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {inspection.width} × {inspection.height} px
                  {inspection.ratioWarning
                    ? " – kuvasuhde poikkeaa suosituksesta (3:4)."
                    : " – kuvasuhde vastaa suositusta."}
                </p>
              )}
              {(localPreviewUrl || draftPreviewUrl || publicImageUrl(form.publishedImagePath)) && (
                <img
                  src={
                    localPreviewUrl ||
                    draftPreviewUrl ||
                    publicImageUrl(form.publishedImagePath) ||
                    undefined
                  }
                  alt="Henkilökuvan esikatselu"
                  className="max-h-80 w-full rounded-md border object-contain"
                />
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
              <div className="space-y-2">
                <Label htmlFor="staff-language">Kieli</Label>
                <select
                  id="staff-language"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={textLang}
                  onChange={(event) => setTextLang(event.target.value as ContentLanguage)}
                >
                  {contentLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="staff-job-title">Tehtävänimike ({textLang.toUpperCase()})</Label>
                  <Input
                    id="staff-job-title"
                    value={form.texts[textLang].jobTitle}
                    onChange={(event) => updateText("jobTitle", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-bio">Esittelyteksti ({textLang.toUpperCase()})</Label>
                  <Textarea
                    id="staff-bio"
                    rows={5}
                    value={form.texts[textLang].bio}
                    onChange={(event) => updateText("bio", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-alt-text">
                    Kuvan alt-teksti ({textLang.toUpperCase()})
                  </Label>
                  <Input
                    id="staff-alt-text"
                    value={form.texts[textLang].altText}
                    onChange={(event) => updateText("altText", event.target.value)}
                    maxLength={300}
                  />
                </div>
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
                <Save aria-hidden="true" />
                Tallenna luonnos
              </Button>
              <Button variant="secondary" disabled={busy} onClick={() => void save(true)}>
                <Check aria-hidden="true" />
                Julkaise
              </Button>
              <Button variant="outline" disabled={busy} onClick={() => void hideMember()}>
                <EyeOff aria-hidden="true" />
                Piilota
              </Button>
              <Button variant="outline" disabled={busy} onClick={reset}>
                <RotateCcw aria-hidden="true" />
                Peruuta
              </Button>
              <Button variant="destructive" disabled={busy} onClick={() => void removeMember()}>
                <Trash2 aria-hidden="true" />
                Poista
              </Button>
            </div>
          </div>
        )}
        {!members.length && !form && (
          <p className="rounded-md border border-dashed p-5 text-sm text-muted-foreground">
            Henkilöstöä ei ole vielä lisätty.
          </p>
        )}
        {!form && members.length > 0 && (
          <p className="text-sm text-muted-foreground">Valitse henkilö muokataksesi tietoja.</p>
        )}
      </CardContent>
    </Card>
  );
}
