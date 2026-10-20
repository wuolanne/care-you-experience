import { Building2, Coffee, PanelsTopLeft, Leaf, Snowflake, RefreshCw, UserRoundCheck, ShieldCheck, CalendarCheck } from 'lucide-react';
import { useLang } from '@/i18n/LanguageProvider';
import { HomePricing } from '../home-service/HomePricing';
import { businessCopy } from './copy';

export function BusinessService() {
  const { lang } = useLang();
  const t = businessCopy[lang];
  const icons = [Building2, Coffee, PanelsTopLeft, Leaf, Snowflake];
  const benefitIcons = [RefreshCw, UserRoundCheck, ShieldCheck, CalendarCheck];
  return <>
    <section className="border-b border-border bg-[image:var(--gradient-lilac)]"><div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
      <h1 className="text-4xl text-primary md:text-5xl">{t.banner}</h1>
      <h2 className="mt-4 text-2xl leading-tight md:text-3xl">{t.subtitle}</h2>
      <p className="mt-5 text-base leading-relaxed text-plum/80">{t.intro}</p>
    </div></section>
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h2 className="text-3xl md:text-4xl">{t.title}</h2><p className="mt-5 max-w-4xl leading-relaxed text-muted-foreground">{t.body}</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{t.services.map(([title, body], index) => {
        const Icon = icons[index] ?? Building2;
        return <article key={title} className="min-w-0 rounded-sm border border-border bg-card p-6"><Icon className="size-6 text-primary" strokeWidth={1.3} aria-hidden="true" /><h3 className="mt-4 text-2xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p></article>;
      })}</div>
    </section>
    <section className="border-t border-border bg-background"><div className="mx-auto max-w-6xl px-6 pb-14 pt-10">
      <h2 className="text-3xl md:text-4xl">{t.partner}</h2><div className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">{t.benefits.map((benefit, index) => {
        if (!benefit) return null;
        const [title, body] = benefit;
        const Icon = benefitIcons[index] ?? ShieldCheck;
        return <div key={title}><Icon className="size-6 text-primary" strokeWidth={1.3} aria-hidden="true" /><h3 className="mt-4 text-2xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p></div>;
      })}</div>
    </div></section>
    <HomePricing audience="business" />
  </>;
}