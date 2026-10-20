import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Mail, Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLang } from '@/i18n/LanguageProvider';
import { homeCopy } from './copy';
import { homePackages, homeHourlyPrice } from './model';
import { RequestForm } from './RequestForms';
export function HomePricing(){
 const {lang}=useLang();const t=homeCopy[lang];const [form,setForm]=useState<'contact'|'start'|null>(null);
 const fmt=(n:number)=>new Intl.NumberFormat('fi-FI',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
 return <section className="border-t border-border bg-[image:var(--gradient-lilac)]" aria-labelledby="home-pricing-title"><div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
  <h2 id="home-pricing-title" className="text-center text-4xl md:text-5xl">{t.pricing}</h2><h3 className="mt-8 text-center text-2xl">{t.monthly}</h3>
  <p className="mt-3 text-center text-sm text-muted-foreground">{t.vat}</p>
  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{homePackages.map(p=><article key={p.name} className="flex min-w-0 flex-col rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-soft)]"><h3 className="text-2xl">{p.name}</h3><p className="mt-4 text-lg text-primary">{p.hours} {t.hours}</p><p className="mt-4 font-[family-name:var(--font-display)] text-4xl text-primary">{fmt(p.monthly)} <span className="text-base">{t.month}</span></p><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.packageBody}</p></article>)}</div>
  <div className="mt-9 border-y border-border py-6"><h3 className="text-2xl">{t.deduction}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.deductionBody}</p><a className="mt-3 inline-block text-sm text-primary underline underline-offset-4" href="https://www.vero.fi/henkiloasiakkaat/vahennykset/kotitalousvahennys/kotitalousvahennyksen-maara/" target="_blank" rel="noreferrer">{t.vero}</a></div>
  <div className="mt-8 flex flex-col justify-between gap-4 rounded-sm border border-border bg-card px-6 py-5 sm:flex-row sm:items-center"><div><h3 className="text-2xl">{t.hourly}</h3><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.hourlyBody}</p></div><p className="shrink-0 font-[family-name:var(--font-display)] text-4xl text-primary">{fmt(homeHourlyPrice)} <span className="text-base">{t.hour}</span></p></div>
  <div className="mt-9 grid gap-3 lg:grid-cols-3"><Button size="lg" className="h-auto min-h-12 whitespace-normal py-3" onClick={()=>setForm('contact')}><Mail aria-hidden="true"/>{t.contact}</Button><Button asChild size="lg" className="h-auto min-h-12 whitespace-normal py-3"><Link to="/varaa"><Video aria-hidden="true"/>{t.video}</Link></Button><Button size="lg" className="h-auto min-h-12 whitespace-normal py-3" onClick={()=>setForm('start')}><ArrowRight aria-hidden="true"/>{t.start}</Button></div>
  <Dialog open={form!==null} onOpenChange={open=>{if(!open)setForm(null);}}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-md"><DialogTitle className="pr-6 text-2xl font-normal">{form==='start'?t.start:t.contact}</DialogTitle><DialogDescription className="sr-only">{form==='start'?t.startNote:t.message}</DialogDescription>{form&&<RequestForm key={form} kind={form}/>}</DialogContent></Dialog>
 </div></section>;
}
