import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/i18n/LanguageProvider";
import { publicReviewsQuery } from "@/features/content/queries";

const copy = {
  fi: { title: "ASIAKKAAMME ARVIO", feedback: "Asiakaspalaute", nickname: "Nimimerkki", stars: "Tähtiarvion paikka" },
  sv: { title: "VÅRA KUNDERS OMDÖMEN", feedback: "Kundrespons", nickname: "Signatur", stars: "Plats för stjärnbetyg" },
  es: { title: "OPINIONES DE NUESTROS CLIENTES", feedback: "Opinión del cliente", nickname: "Seudónimo", stars: "Espacio para la valoración" },
  en: { title: "OUR CUSTOMERS’ REVIEWS", feedback: "Customer feedback", nickname: "Nickname", stars: "Star rating placeholder" },
};

export function CustomerReviews() {
  const { lang } = useLang();
  const t = copy[lang];
  const { data: allReviews = [] } = useQuery(publicReviewsQuery);
  const reviews = allReviews.filter((review) => review.lang === lang);

  if (!reviews.length) return null;

  return (
    <section aria-labelledby="customer-reviews-title" className="border-t border-border/60 bg-[image:var(--gradient-lilac)]">
      <div className="mx-auto max-w-6xl px-6 py-7 md:py-8">
        <h2 id="customer-reviews-title" className="text-center text-2xl leading-tight text-primary md:text-3xl">{t.title}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="min-w-0">
              <blockquote aria-label={t.feedback} className="min-h-16 rounded-sm border border-primary/20 bg-background px-4 py-3 text-sm leading-relaxed text-primary">
                {review.review_text}
              </blockquote>
              <div role="img" aria-label={review.rating === null ? t.stars : `${review.rating}/5`} className="mt-3 flex justify-center gap-1.5 text-primary">
                {Array.from({ length: 5 }, (_, star) => (
                  <Star key={star} aria-hidden="true" strokeWidth={1.25} className={`size-4 ${review.rating !== null && star < review.rating ? "fill-gold text-gold" : "fill-none"}`} />
                ))}
              </div>
              <p aria-label={t.nickname} className="mx-auto mt-2 min-h-7 w-full max-w-44 rounded-sm border border-primary/20 bg-background px-3 py-1 text-center text-xs text-primary">
                {review.public_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
