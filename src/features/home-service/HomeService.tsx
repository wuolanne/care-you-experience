import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { House, Sparkles, PanelsTopLeft, Leaf, Footprints, Truck, PackageCheck, ShieldCheck, UserRoundCheck, CalendarCheck, RefreshCw, Mail, Video, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useLang } from '@/i18n/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { homeCopy } from './copy';
import { HomePricing } from './HomePricing';
import { RequestForm } from './RequestForms';
import { publicContentQuery } from '@/features/content/queries';

export function HomeService(){
 const {lang}=useLang();const t=homeCopy[lang];
 const {data:managed={}}=useQuery(publicContentQuery('home-service',lang));
 const banner=managed.title||t.banner;const intro=managed.body||t.intro;const contact=managed.cta||t.contact;
 const [form,setForm]=useState<'contact'|'start'|null>(null);
 const icons=[House,PanelsTopLeft,Sparkles,Leaf,Footprints,PackageCheck,Truck];
 return <>
  <section className="border-b border-border bg-[image:var(--gradient-lilac)]"><div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
    <h1 className="text-4xl text-primary md:text-5xl">{banner}</h1>
    <h2 className="mt-4 text-2xl leading-tight md:text-3xl">{t.subtitle}</h2>
    <p className="mt-5 text-base leading-relaxed text-plum">{intro}</p>
    <div className="mt-8 grid gap-3 sm:grid-cols-3"><Button size="lg" className="h-auto min-h-12 whitespace-normal py-3" onClick={()=>setForm('contact')}><Mail aria-hidden="true"/>{contact}</Button><Button asChild size="lg" className="h-auto min-h-12 whitespace-normal py-3"><Link to="/varaa"><Video aria-hidden="true"/>{t.video}</Link></Button><Button size="lg" className="h-auto min-h-12 whitespace-normal py-3" onClick={()=>setForm('start')}><ArrowRight aria-hidden="true"/>{t.start}</Button></div>
  </div></section>
  <section className="bg-background"><div className="mx-auto max-w-6xl px-6 py-14"><h2 className="text-3xl md:text-4xl">{t.partner}</h2><div className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">{t.benefits.map(([title,body],index)=>{const Icon=[RefreshCw,UserRoundCheck,ShieldCheck,CalendarCheck][index]??ShieldCheck;return <div key={title}><Icon className="size-6 text-primary" strokeWidth={1.3} aria-hidden="true"/><h3 className="mt-4 text-2xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p></div>;})}</div></div></section>
  <section className="border-t border-border bg-[image:var(--gradient-lilac)]"><div className="mx-auto max-w-6xl px-6 py-14"><h2 className="text-3xl md:text-4xl">{t.title}</h2><p className="mt-5 max-w-4xl leading-relaxed text-plum">{t.body}</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{t.services.map(([title,body],index)=>{const Icon=icons[index]??House;return <article key={title} className="rounded-sm border border-border bg-card p-6"><Icon className="size-6 text-primary" strokeWidth={1.3} aria-hidden="true"/><h3 className="mt-4 text-2xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p></article>;})}</div></div></section>
  <HomePricing/>
  <Dialog open={form!==null} onOpenChange={open=>{if(!open)setForm(null);}}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-md"><DialogTitle className="pr-6 text-2xl font-normal">{form==='start'?t.start:t.contact}</DialogTitle><DialogDescription className="sr-only">{form==='start'?t.startNote:t.message}</DialogDescription>{form&&<RequestForm key={form} kind={form} audience="home"/>}</DialogContent></Dialog>
 </>;
}
