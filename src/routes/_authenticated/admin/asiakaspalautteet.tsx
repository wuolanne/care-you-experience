import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, EyeOff, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminReviewsQuery } from "@/features/content/queries";
import {
  customerTypeLabels,
  contentLanguages,
  customerReviewFlags,
  customerReviewVisibility,
  type CustomerReview,
  type CustomerReviewVisibility,
} from "@/features/content/model";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/asiakaspalautteet")({
  component: ReviewsAdmin,
});

type ReviewForm = {
  lang: string;
  public_name: string;
  customer_type: string;
  review_text: string;
  rating: string;
  consent_granted: boolean;
  visibility: CustomerReviewVisibility;
  display_order: string;
};

const emptyForm: ReviewForm = {
  lang: "fi",
  public_name: "",
  customer_type: "private",
  review_text: "",
  rating: "",
  consent_granted: false,
  visibility: "hidden",
  display_order: "0",
};

function reviewToForm(review: CustomerReview): ReviewForm {
  return {
    lang: review.lang,
    public_name: review.public_name,
    customer_type: review.customer_type,
    review_text: review.review_text,
    rating: review.rating?.toString() ?? "",
    consent_granted: review.consent_granted,
    visibility: customerReviewVisibility(review),
    display_order: review.display_order.toString(),
  };
}

function ReviewsAdmin() {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery(adminReviewsQuery);
  const [form, setForm] = useState<ReviewForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function updateForm<K extends keyof ReviewForm>(key: K, value: ReviewForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function edit(review: CustomerReview) {
    setEditingId(review.id);
    setForm(reviewToForm(review));
    setNotice(null);
  }

  async function save() {
    if (!form.public_name.trim() || !form.review_text.trim()) {
      setNotice("Nimi ja palaute ovat pakollisia.");
      return;
    }
    if (form.visibility === "conflict") {
      setNotice(
        "Palautteen tietokannassa on ristiriitaiset näkyvyysarvot. Valitse Julkinen tai Piilossa ennen tallennusta.",
      );
      return;
    }
    if (form.visibility !== "public" && form.visibility !== "hidden") {
      setNotice("Valitse palautteelle tila: Julkinen tai Piilossa.");
      return;
    }
    if (form.visibility === "public" && !form.consent_granted) {
      setNotice("Palautetta ei voi julkaista ilman julkaisulupaa.");
      return;
    }
    const rating = form.rating ? Number(form.rating) : null;
    if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      setNotice("Arvion pitää olla kokonaisluku 1–5.");
      return;
    }
    setBusy(true);
    setNotice(null);
    const payload = {
      lang: form.lang,
      public_name: form.public_name.trim(),
      customer_type: form.customer_type,
      review_text: form.review_text.trim(),
      rating,
      consent_granted: form.consent_granted,
      ...customerReviewFlags(form.visibility),
      display_order: Number(form.display_order) || 0,
      published_at: form.visibility === "public" ? new Date().toISOString() : null,
    };
    const result = editingId
      ? await supabase.from("customer_reviews").update(payload).eq("id", editingId)
      : await supabase.from("customer_reviews").insert(payload);
    setBusy(false);
    if (result.error) {
      setNotice("Palautea ei voitu tallentaa.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-customer-reviews"] });
    await queryClient.invalidateQueries({ queryKey: ["public-reviews"] });
    setForm(emptyForm);
    setEditingId(null);
    setNotice(form.visibility === "public" ? "Palaute julkaistiin." : "Palaute tallennettiin piiloon.");
  }

  async function removeReview() {
    if (!editingId) return;
    setBusy(true);
    setNotice(null);
    const { error } = await supabase.from("customer_reviews").delete().eq("id", editingId);
    setBusy(false);
    setDeleteOpen(false);
    if (error) {
      setNotice("Palautetta ei voitu poistaa. Tarkista ylläpitäjän oikeudet.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-customer-reviews"] });
    await queryClient.invalidateQueries({ queryKey: ["public-reviews"] });
    setForm(emptyForm);
    setEditingId(null);
    setNotice("Palaute poistettiin.");
  }

  if (isLoading) return <p className="text-muted-foreground">Ladataan palautteita…</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Asiakaspalaute</p>
        <h2 className="mt-2 text-4xl">Asiakaspalautteet</h2>
        <p className="mt-2 text-muted-foreground">
          Julkaise vain palautteet, joihin asiakkaan nimi- ja sisältölupa on vahvistettu.
        </p>
      </div>
      {notice && (
        <p role="status" className="rounded-md border border-primary/30 bg-card px-4 py-3 text-sm">
          {notice}
        </p>
      )}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Muokkaa palautetta" : "Lisää palaute"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="review-lang">Kieli</Label>
              <select
                id="review-lang"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={form.lang}
                onChange={(event) => updateForm("lang", event.target.value)}
              >
                {contentLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-type">Asiakastyyppi</Label>
              <select
                id="review-type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={form.customer_type}
                onChange={(event) => updateForm("customer_type", event.target.value)}
              >
                {Object.entries(customerTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-order">Näyttöjärjestys</Label>
              <Input
                id="review-order"
                type="number"
                min="0"
                value={form.display_order}
                onChange={(event) => updateForm("display_order", event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-name">Julkinen nimi tai nimimerkki</Label>
            <Input
              id="review-name"
              value={form.public_name}
              onChange={(event) => updateForm("public_name", event.target.value)}
              maxLength={160}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-text">Palauteteksti</Label>
            <Textarea
              id="review-text"
              rows={6}
              value={form.review_text}
              onChange={(event) => updateForm("review_text", event.target.value)}
              maxLength={4000}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="review-rating">Arvosana 1–5 (valinnainen)</Label>
              <Input
                id="review-rating"
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(event) => updateForm("rating", event.target.value)}
              />
            </div>
            <label className="flex items-center gap-3 rounded-md border p-3 text-sm">
              <input
                type="checkbox"
                checked={form.consent_granted}
                onChange={(event) => updateForm("consent_granted", event.target.checked)}
              />{" "}
              Julkaisulupa koskee nimeä ja palautetekstiä
            </label>
          </div>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Näkyvyys</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ["public", "Julkinen", "Palaute näkyy julkisella verkkosivustolla."],
                ["hidden", "Piilossa", "Palaute säilyy hallintapaneelissa, mutta ei näy julkisella sivustolla."],
              ] as const).map(([value, label, description]) => (
                <label key={value} className="flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm">
                  <input
                    type="radio"
                    name="review-visibility"
                    value={value}
                    required
                    checked={form.visibility === value}
                    onChange={() => updateForm("visibility", value)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium">{label}</span>
                    <span className="mt-1 block text-muted-foreground">{description}</span>
                  </span>
                </label>
              ))}
            </div>
            {form.visibility === "conflict" && (
              <p role="alert" className="text-sm text-destructive">
                Tietueella on ristiriitaiset julkaistu- ja piilotettu-arvot. Valitse tila uudelleen.
              </p>
            )}
          </fieldset>
          <div className="flex flex-wrap gap-3">
            <Button disabled={busy} onClick={() => void save()}>
              <Save aria-hidden="true" />
              Tallenna
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
              }}
            >
              <Plus aria-hidden="true" />
              Uusi palaute
            </Button>
            {editingId && (
              <Button variant="destructive" disabled={busy} onClick={() => setDeleteOpen(true)}>
                <Trash2 aria-hidden="true" />
                Poista palaute
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-5">
        {!reviews.length && (
          <Card>
            <CardContent className="pt-6 text-muted-foreground">
              Palautteita ei ole vielä tallennettu.
            </CardContent>
          </Card>
        )}
        {reviews.map((review: CustomerReview) => (
          <Card key={review.id}>
            <CardContent className="space-y-3 pt-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {review.public_name} · {review.lang.toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customerTypeLabels[review.customer_type] ?? review.customer_type} · järjestys{" "}
                    {review.display_order}
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  {customerReviewVisibility(review) === "public" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
                      <Check className="size-3" />
                      Julkaistu
                    </span>
                  ) : customerReviewVisibility(review) === "conflict" ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-2 py-1 text-destructive">
                      Ristiriitainen tila
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                      <EyeOff className="size-3" />
                      Piilossa
                    </span>
                  )}
                  <Button size="sm" variant="outline" onClick={() => edit(review)}>
                    <Pencil aria-hidden="true" />
                    Muokkaa
                  </Button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{review.review_text}</p>
              {review.rating !== null && (
                <p className="text-sm text-muted-foreground">Arvosana: {review.rating}/5</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Poistetaanko palaute pysyvästi?</AlertDialogTitle>
            <AlertDialogDescription>
              Tämä on pysyvä toimenpide. Palaute poistetaan tietokannasta, eikä sitä voi palauttaa
              hallintapaneelista.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Peruuta</AlertDialogCancel>
            <AlertDialogAction disabled={busy} onClick={() => void removeReview()}>
              Vahvista poistaminen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
