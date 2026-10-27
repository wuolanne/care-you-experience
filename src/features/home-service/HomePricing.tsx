import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Mail, Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLang } from '@/i18n/LanguageProvider';
import { homeCopy } from './copy';
import { RequestForm } from './RequestForms';
import { businessCopy } from '../business-service/copy';
import { withBusinessVat } from '../business-service/model';
import { publicPricingQuery } from '@/features/content/queries';
import { sourcePricing } from '@/features/pricing/model';
export function HomePricing({audience='home'}:{audience?:'home'|'business'}){
 const {lang}=useLang();const t=homeCopy[lang];const [form,setForm]=useState<'contact'|'start'|null>(null);
 const isBusiness=audience==='business';
 const serviceType=isBusiness?'business':'home';
 const {data:pricing=sourcePricing(serviceType,lang)}=useQuery(publicPricingQuery(serviceType,lang));
 const packages=pricing.packages;
 const hourlyPrice=pricing.settings.hourlyPrice;
 const fmt=(n:number)=>new Intl.NumberFormat('fi-FI',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
 return <section className="border-t border-border bg-background" aria-labelledby="home-pricing-title"><div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
  <h2 id="home-pricing-title" className="managed-copy break-words text-center text-4xl md:text-5xl">{pricing.settings.texts.pricingHeading}</h2><p className="managed-copy mt-3 break-words text-center text-sm text-muted-foreground">{pricing.settings.texts.pricingNote}</p><h3 className="managed-copy mt-8 break-words text-center text-2xl">{pricing.settings.texts.monthlyHeading}</h3>
  <p className="managed-copy mt-3 break-words text-center text-sm font-semibold text-plum">{pricing.settings.texts.vatNotice}</p>
  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{packages.map(p=><article key={p.packageKey} className="flex min-w-0 flex-col rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-soft)]"><h3 className="managed-copy break-words text-2xl font-medium text-primary">{p.name}</h3><p className="mt-2 text-sm text-muted-foreground">({p.hours} {t.hours})</p><p className="mt-4 font-[family-name:var(--font-display)] text-4xl text-primary">{fmt(p.monthlyPrice)} <span className="text-base">{t.month}</span></p>{isBusiness&&<p className="mt-1 text-sm text-muted-foreground">({fmt(withBusinessVat(p.monthlyPrice))} {t.month} {businessCopy[lang].inclVat})</p>}<p className="managed-copy mt-4 break-words text-sm leading-relaxed text-muted-foreground">{p.description}</p></article>)}</div>
  {!isBusiness&&pricing.settings.texts.deductionTitle&&pricing.settings.texts.deductionBody&&<div className="mt-9 border-y border-border py-6"><h3 className="managed-copy break-words text-2xl">{pricing.settings.texts.deductionTitle}</h3><p className="managed-copy mt-3 break-words text-sm leading-relaxed text-muted-foreground">{pricing.settings.texts.deductionBody}</p>{pricing.settings.texts.deductionLinkLabel&&<a className="mt-3 inline-block text-sm text-primary underline underline-offset-4" href="https://www.vero.fi/henkiloasiakkaat/vahennykset/kotitalousvahennys/kotitalousvahennyksen-maara/" target="_blank" rel="noreferrer">{pricing.settings.texts.deductionLinkLabel}</a>}</div>}
  <div className="mt-8 flex flex-col justify-between gap-4 rounded-sm border border-border bg-card px-6 py-5 sm:flex-row sm:items-center"><div><h3 className="managed-copy break-words text-2xl">{pricing.settings.texts.hourlyHeading}</h3><p className="managed-copy mt-2 break-words text-sm font-semibold text-plum">{pricing.settings.texts.vatNotice}</p><p className="managed-copy mt-2 max-w-2xl break-words text-sm text-muted-foreground">{pricing.settings.texts.hourlyDescription}</p></div><div className="shrink-0"><p className="font-[family-name:var(--font-display)] text-4xl text-primary">{fmt(hourlyPrice)} <span className="text-base">{t.hour}</span></p>{isBusiness&&<p className="mt-1 text-sm text-muted-foreground">({fmt(withBusinessVat(hourlyPrice))} {t.hour} {businessCopy[lang].inclVat})</p>}</div></div>
  <div className="mt-9 grid gap-3 lg:grid-cols-3"><Button size="lg" className="h-auto min-h-12 whitespace-normal py-3" onClick={()=>setForm('contact')}><Mail aria-hidden="true"/>{t.contact}</Button><Button asChild size="lg" className="h-auto min-h-12 whitespace-normal py-3"><Link to="/varaa"><Video aria-hidden="true"/>{t.video}</Link></Button><Button size="lg" className="h-auto min-h-12 whitespace-normal py-3" onClick={()=>setForm('start')}><ArrowRight aria-hidden="true"/>{t.start}</Button></div>
  <Dialog open={form!==null} onOpenChange={open=>{if(!open)setForm(null);}}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-md"><DialogTitle className="pr-6 text-2xl font-normal">{form==='start'?t.start:t.contact}</DialogTitle><DialogDescription className="sr-only">{form==='start'?t.startNote:t.message}</DialogDescription>{form&&<RequestForm key={form} kind={form} audience={audience}/>}</DialogContent></Dialog>
 </div></section>;
}
