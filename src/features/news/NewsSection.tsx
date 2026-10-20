import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowRight, ImageIcon, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLang } from '@/i18n/LanguageProvider';
import { newsQuery } from './queries';
import { NEWS_PAGE_SIZE, newsCopy, newsText, type NewsItem } from './model';

export function NewsSection() {
  const { lang } = useLang(); const copy = newsCopy[lang];
  const { data: items } = useSuspenseQuery(newsQuery);
  const [count,setCount] = useState(NEWS_PAGE_SIZE);
  const [selected,setSelected] = useState<NewsItem | null>(null);
  return <section id="uutiset" aria-labelledby="news-title" className="border-b border-border/60 bg-background">
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h2 id="news-title" className="text-center text-4xl text-primary md:text-5xl">{copy.title}</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.length ? items.slice(0,count).map(item => <article key={item.id} className="overflow-hidden rounded-sm border border-border bg-card">
          {item.imageUrl ? <img src={item.imageUrl} alt={newsText(item.title,lang)} className="aspect-[3/2] w-full object-cover" loading="lazy" /> : <div className="flex aspect-[3/2] items-center justify-center bg-section-grey"><ImageIcon className="size-9 text-muted-foreground/50" aria-hidden /></div>}
          <div className="p-6"><time dateTime={item.news_date} className="text-sm text-muted-foreground">{new Intl.DateTimeFormat(lang === 'fi' ? 'fi-FI' : lang === 'sv' ? 'sv-SE' : lang === 'es' ? 'es-ES' : 'en-GB').format(new Date(`${item.news_date}T12:00:00Z`))}</time>
          <h3 className="mt-3 break-words text-2xl">{newsText(item.title,lang)}</h3><p className="mt-3 line-clamp-3 whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">{newsText(item.body,lang)}</p>
          <Button variant="link" onClick={() => setSelected(item)} className="mt-4 px-0">{copy.read}<ArrowRight aria-hidden /></Button></div>
        </article>) : Array.from({ length:NEWS_PAGE_SIZE },(_,i) => <article key={i} className="overflow-hidden rounded-sm border border-border bg-card">
          <div className="flex aspect-[3/2] items-center justify-center bg-section-grey"><ImageIcon className="size-9 text-muted-foreground/40" aria-label={copy.image} /></div>
          <div className="p-6"><span className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4" aria-hidden /> —</span><h3 className="mt-3 text-2xl">{copy.empty}</h3><div className="mt-5 h-2 w-4/5 bg-border/50" aria-hidden /><div className="mt-2 h-2 w-3/5 bg-border/50" aria-hidden /></div>
        </article>)}
      </div>
      <div className="mt-8 flex justify-center"><Button size="icon" className="size-12" aria-label={copy.more} title={copy.more} disabled={count >= items.length} onClick={() => setCount(c => c+NEWS_PAGE_SIZE)}><ArrowRight aria-hidden /></Button></div>
    </div>
    <Dialog open={Boolean(selected)} onOpenChange={open => { if(!open) setSelected(null); }}><DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle className="break-words text-3xl">{selected ? newsText(selected.title,lang) : ''}</DialogTitle></DialogHeader>{selected && <><time className="text-sm text-muted-foreground">{selected.news_date}</time>{selected.imageUrl && <img src={selected.imageUrl} alt={newsText(selected.title,lang)} className="max-h-96 w-full object-contain" />}<p className="whitespace-pre-line break-words leading-relaxed">{newsText(selected.body,lang)}</p></>}</DialogContent></Dialog>
  </section>;
}