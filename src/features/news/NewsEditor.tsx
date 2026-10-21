import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ImageIcon, Pencil, Plus, Save, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { newsEditorQuery } from "@/features/news/NewsEditor.query";
import type { Lang } from "@/i18n/translations";
import type { NewsItem, NewsText } from "@/features/news/model";

export function NewsEditor() {
  const { data } = useSuspenseQuery(newsEditorQuery);
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<NewsItem | null>(null);
  const [language, setLanguage] = useState<Lang>("fi");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function newDraft() {
    setDraft({
      id: "",
      title: {},
      body: {},
      news_date: new Date().toISOString().slice(0, 10),
      image_path: null,
      published: false,
    });
    setFile(null);
    setMessage("");
  }

  function updateText(field: "title" | "body", value: string) {
    setDraft((current) =>
      current ? { ...current, [field]: { ...current[field], [language]: value } } : current,
    );
  }

  async function save() {
    if (!draft) return;
    if (!draft.title.fi?.trim() || !draft.body.fi?.trim()) {
      setMessage("Täytä suomenkielinen otsikko ja teksti.");
      return;
    }

    setBusy(true);
    setMessage("");
    let uploaded: string | null = null;
    try {
      let imagePath = draft.image_path;
      if (file) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
          throw new Error("Valitse JPG-, PNG- tai WebP-kuva.");
        if (file.size > 10 * 1024 * 1024) throw new Error("Kuvan enimmäiskoko on 10 Mt.");
        const extension =
          file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
        uploaded = `${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage
          .from("news-images")
          .upload(uploaded, file, { contentType: file.type });
        if (error) throw new Error("Kuvan tallennus epäonnistui.");
        imagePath = uploaded;
      }

      const row = {
        title: draft.title as NewsText,
        body: draft.body as NewsText,
        news_date: draft.news_date,
        image_path: imagePath,
        published: draft.published,
      };
      const result = draft.id
        ? await supabase.from("news").update(row).eq("id", draft.id).select("id").single()
        : await supabase.from("news").insert(row).select("id").single();
      if (result.error) throw new Error("Uutisen tallennus epäonnistui.");
      setDraft(null);
      setFile(null);
      await queryClient.invalidateQueries({ queryKey: ["news-editor"] });
      await queryClient.invalidateQueries({ queryKey: ["public-news"] });
      setMessage("Uutinen tallennettu.");
    } catch (error) {
      if (uploaded) await supabase.storage.from("news-images").remove([uploaded]);
      setMessage(error instanceof Error ? error.message : "Tallennus epäonnistui.");
    } finally {
      setBusy(false);
    }
  }

  if (!data.allowed)
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl">Uutisten ylläpito</h1>
        <p className="mt-6">
          Tällä tilillä ei ole uutisten muokkausoikeutta. Kirjaudu vahvistetulla ylläpitäjän
          sähköpostiosoitteella.
        </p>
      </section>
    );

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="eyebrow">Sisällönhallinta</p>
          <h2 className="mt-2 text-4xl">Uutisten ylläpito</h2>
        </div>
        <Button onClick={newDraft}>
          <Plus />
          Lisää uutinen
        </Button>
      </div>
      {message && <p role="status">{message}</p>}
      {draft && (
        <form
          className="border-y border-border py-8"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <div className="mb-6 flex flex-wrap gap-2">
            {(["fi", "sv", "es", "en"] as Lang[]).map((lang) => (
              <Button
                key={lang}
                type="button"
                variant={language === lang ? "default" : "outline"}
                onClick={() => setLanguage(lang)}
              >
                {{ fi: "Suomi", sv: "Ruotsi", es: "Espanja", en: "Englanti" }[lang]}
              </Button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="space-y-5">
              <div>
                <Label htmlFor="news-heading">Otsikko ({language.toUpperCase()})</Label>
                <Input
                  id="news-heading"
                  value={draft.title[language] ?? ""}
                  onChange={(event) => updateText("title", event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="news-body">Teksti ({language.toUpperCase()})</Label>
                <Textarea
                  id="news-body"
                  className="min-h-48"
                  value={draft.body[language] ?? ""}
                  onChange={(event) => updateText("body", event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <Label htmlFor="news-date">Päivämäärä</Label>
                <Input
                  id="news-date"
                  type="date"
                  required
                  value={draft.news_date}
                  onChange={(event) => setDraft({ ...draft, news_date: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="news-image" className="flex items-center gap-2">
                  <Upload className="size-4" />
                  Kuva
                </Label>
                <Input
                  id="news-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
                {file && <p className="mt-2 break-words text-sm">{file.name}</p>}
                {draft.imageUrl && !file && (
                  <img
                    src={draft.imageUrl}
                    alt="Uutiskuva"
                    className="mt-4 aspect-[3/2] w-full object-cover"
                  />
                )}
                {draft.image_path && (
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => setDraft({ ...draft, image_path: null, imageUrl: null })}
                  >
                    Poista kuva uutisesta
                  </Button>
                )}
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(event) => setDraft({ ...draft, published: event.target.checked })}
                />
                Julkaistu
              </label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button type="submit" disabled={busy}>
              <Save />
              {busy ? "Tallennetaan…" : "Tallenna uutinen"}
            </Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => setDraft(null)}>
              Peruuta
            </Button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {!data.items.length && <p className="text-muted-foreground">Ei uutisia vielä.</p>}
        {data.items.map((news) => (
          <article
            key={news.id}
            className="flex flex-wrap items-center gap-5 border-b border-border py-5"
          >
            {news.imageUrl ? (
              <img src={news.imageUrl} alt="" className="h-20 w-28 object-cover" />
            ) : (
              <ImageIcon className="size-8 text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="break-words text-2xl">{news.title.fi}</h3>
              <p className="text-sm text-muted-foreground">
                {news.news_date} · {news.published ? "Julkaistu" : "Luonnos"}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Muokkaa uutista"
              title="Muokkaa uutista"
              onClick={() => {
                setDraft(news);
                setFile(null);
                setMessage("");
              }}
            >
              <Pencil />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={busy}
              aria-label="Poista uutinen"
              title="Poista uutinen"
              onClick={async () => {
                if (!window.confirm("Poistetaanko uutinen pysyvästi?")) return;
                setBusy(true);
                const { error } = await supabase.from("news").delete().eq("id", news.id);
                if (error) setMessage("Poistaminen epäonnistui.");
                else {
                  if (news.image_path)
                    await supabase.storage.from("news-images").remove([news.image_path]);
                  await queryClient.invalidateQueries({ queryKey: ["news-editor"] });
                  await queryClient.invalidateQueries({ queryKey: ["public-news"] });
                }
                setBusy(false);
              }}
            >
              <Trash2 />
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
