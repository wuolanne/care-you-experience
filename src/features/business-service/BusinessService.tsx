import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Video, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useLang } from '@/i18n/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { HomePricing } from '../home-service/HomePricing';
import { RequestForm } from '../home-service/RequestForms';
import { homeCopy } from '../home-service/copy';
import { businessCopy } from './copy';
import { publicContentQuery, publicServiceSectionQuery } from '@/features/content/queries';
import { serviceIconFor } from '@/features/service-sections/icons';

export function BusinessService() {
  const { lang } = useLang();
  const t = businessCopy[lang];
  const h = homeCopy[lang];
  const { data: managed = {} } = useQuery(publicContentQuery('business-service', lang));
  const { data: benefits } = useQuery(publicServiceSectionQuery('business', 'benefits', lang));
  const { data: services } = useQuery(publicServiceSectionQuery('business', 'services', lang));
  const banner = managed.title || t.banner;
  const intro = managed.body || t.intro;
  const contact = managed.cta || h.contact;
  const [form, setForm] = useState<'contact' | 'start' | null>(null);
  const visibleBenefits = benefits?.items.filter((item) => item.visible && (item.title || item.description)) ?? [];
  const visibleServices = services?.items.filter((item) => item.visible && (item.title || item.description)) ?? [];
  return <>
    <section className="border-b border-border bg-[image:var(--gradient-lilac)]"><div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
      <h1 className="text-4xl text-primary md:text-5xl">{banner}</h1>
      <h2 className="mt-4 text-2xl leading-tight md:text-3xl">{t.subtitle}</h2>
      <p className="mt-5 text-base leading-relaxed text-plum">{intro}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3"><Button size="lg" className="h-auto min-h-12 whitespace-normal py-3" onClick={() => setForm('contact')}><Mail aria-hidden="true" />{contact}</Button><Button asChild size="lg" className="h-auto min-h-12 whitespace-normal py-3"><Link to="/varaa"><Video aria-hidden="true" />{h.video}</Link></Button><Button size="lg" className="h-auto min-h-12 whitespace-normal py-3" onClick={() => setForm('start')}><ArrowRight aria-hidden="true" />{h.start}</Button></div>
    </div></section>
    {benefits && (benefits.title || benefits.body || visibleBenefits.length > 0) && <section className="bg-background"><div className="mx-auto max-w-6xl px-6 py-14">
      {benefits.title && <h2 className="text-3xl md:text-4xl">{benefits.title}</h2>}{benefits.body && <p className="mt-5 max-w-4xl leading-relaxed text-plum">{benefits.body}</p>}<div className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">{visibleBenefits.map((item) => { const Icon = serviceIconFor(item.icon); return <div key={item.id}><Icon className="size-6 text-primary" strokeWidth={1.3} aria-hidden="true" />{item.title && <h3 className="mt-4 text-2xl">{item.title}</h3>}{item.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}</div>; })}</div>
    </div></section>}
    {services && (services.title || services.body || visibleServices.length > 0) && <section className="border-t border-border bg-[image:var(--gradient-lilac)]"><div className="mx-auto max-w-6xl px-6 py-14">
      {services.title && <h2 className="text-3xl md:text-4xl">{services.title}</h2>}{services.body && <p className="mt-5 max-w-4xl leading-relaxed text-plum">{services.body}</p>}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visibleServices.map((item) => { const Icon = serviceIconFor(item.icon); return <article key={item.id} className="min-w-0 rounded-sm border border-border bg-card p-6"><Icon className="size-6 text-primary" strokeWidth={1.3} aria-hidden="true" />{item.title && <h3 className="mt-4 text-2xl">{item.title}</h3>}{item.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}</article>; })}</div>
    </div></section>}
    <HomePricing audience="business" />
    <Dialog open={form !== null} onOpenChange={open => { if (!open) setForm(null); }}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-md"><DialogTitle className="pr-6 text-2xl font-normal">{form === 'start' ? h.start : h.contact}</DialogTitle><DialogDescription className="sr-only">{form === 'start' ? h.startNote : h.message}</DialogDescription>{form && <RequestForm key={form} kind={form} audience="business" />}</DialogContent></Dialog>
  </>;
}
