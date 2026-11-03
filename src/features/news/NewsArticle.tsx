import { ArrowLeft, ImageIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Lang } from "@/i18n/translations";
import { newsCopy, newsText, type NewsItem } from "./model";
import { newsImagePath } from "./seo";

function dateLocale(lang: Lang) {
  return lang === "fi" ? "fi-FI" : lang === "sv" ? "sv-SE" : lang === "es" ? "es-ES" : "en-GB";
}

export function NewsArticle({ item, lang }: { item: NewsItem; lang: Lang }) {
  const copy = newsCopy[lang];
  const title = newsText(item.title, lang);
  const image = item.image_path ? newsImagePath(item.id) : null;

  return (
    <article className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Link
          to="/"
          hash="uutiset"
          className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {copy.title}
        </Link>
        <p className="eyebrow mt-12">{copy.title}</p>
        <h1 className="mt-4 break-words text-4xl leading-tight text-primary md:text-6xl">
          {title}
        </h1>
        <time dateTime={item.news_date} className="mt-6 block text-sm text-muted-foreground">
          {new Intl.DateTimeFormat(dateLocale(lang)).format(
            new Date(`${item.news_date}T12:00:00Z`),
          )}
        </time>
        {image ? (
          <img src={image} alt={title} className="mt-10 max-h-[38rem] w-full object-contain" />
        ) : (
          <div className="mt-10 flex aspect-[3/2] items-center justify-center bg-section-grey">
            <ImageIcon className="size-12 text-muted-foreground/50" aria-hidden />
          </div>
        )}
        <div className="managed-copy mt-10 whitespace-pre-wrap break-words text-base leading-relaxed text-foreground md:text-lg">
          {newsText(item.body, lang)}
        </div>
      </div>
    </article>
  );
}
