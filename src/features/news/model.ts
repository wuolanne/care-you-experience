import type { Lang } from '@/i18n/translations';
export type NewsText = Partial<Record<Lang, string>>;
export type NewsItem = { id: string; title: NewsText; body: NewsText; news_date: string; image_path: string | null; published: boolean; imageUrl?: string | null };
export const NEWS_PAGE_SIZE = 3;
export const newsCopy = {
  fi: { title: 'Uutiset ja uutta', more: 'Lisää uutisia', empty: 'Uutisia tulossa', image: 'Uutiskuva', text: 'Uutisen teksti', date: 'Päivämäärä', manage: 'Uutisten ylläpito', read: 'Lue uutinen', close: 'Sulje' },
  sv: { title: 'Nyheter och nytt', more: 'Fler nyheter', empty: 'Nyheter kommer snart', image: 'Nyhetsbild', text: 'Nyhetstext', date: 'Datum', manage: 'Hantera nyheter', read: 'Läs nyheten', close: 'Stäng' },
  es: { title: 'Noticias y novedades', more: 'Más noticias', empty: 'Próximamente noticias', image: 'Imagen de la noticia', text: 'Texto de la noticia', date: 'Fecha', manage: 'Gestionar noticias', read: 'Leer noticia', close: 'Cerrar' },
  en: { title: 'News and updates', more: 'More news', empty: 'News coming soon', image: 'News image', text: 'News text', date: 'Date', manage: 'Manage news', read: 'Read news', close: 'Close' },
};
export function newsText(text: NewsText, lang: Lang) { return text[lang]?.trim() || text.fi?.trim() || ''; }
export function visibleNews(items: NewsItem[], count = NEWS_PAGE_SIZE) { return items.filter(n => n.published).sort((a,b) => b.news_date.localeCompare(a.news_date) || b.id.localeCompare(a.id)).slice(0,count); }