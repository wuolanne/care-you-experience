import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLang } from '@/i18n/LanguageProvider';
import { homeCopy } from './copy';
import { contactSchema, startSchema } from './model';
import { submitContact, submitServiceStart } from './requests.functions';

export function RequestForm({kind}:{kind:'contact'|'start'}) {
 const {lang}=useLang(); const t=homeCopy[lang];
 const sendContact=useServerFn(submitContact); const sendStart=useServerFn(submitServiceStart);
 const [pending,setPending]=useState(false); const [sent,setSent]=useState(false); const [error,setError]=useState(false); const [type,setType]=useState('once');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); if(pending)return; const f=new FormData(e.currentTarget); setError(false);
  const data=kind==='contact'?contactSchema.safeParse({email:f.get('email'),message:f.get('message'),lang}):startSchema.safeParse({customerName:f.get('customerName'),contactPerson:f.get('contactPerson'),email:f.get('email'),workAddress:f.get('workAddress'),startDate:f.get('startDate'),startTime:f.get('startTime'),serviceType:type,lang});
  if(!data.success){setError(true);return;}
  setPending(true);
  try{const result=kind==='contact'?await sendContact({data:contactSchema.parse(data.data)}):await sendStart({data:startSchema.parse(data.data)}); if(result.ok)setSent(true);else setError(true);}catch{setError(true);}finally{setPending(false);}
 }
 if(sent)return <div role="status" className="py-6 text-center"><CheckCircle2 className="mx-auto mb-4 size-8 text-primary"/><h2 className="text-2xl">{t.thanks}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{kind==='contact'?t.contactThanks:t.startThanks}</p></div>;
 const field=(name:string,label:string,inputType='text',maxLength=200)=><div className="space-y-2" key={name}><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type={inputType} maxLength={maxLength} required /></div>;
 return <form onSubmit={submit} className="space-y-5">
  {kind==='start'&&<>{field('customerName',t.name)}{field('contactPerson',t.person)}</>}
  {field('email',t.email,'email',255)}
  {kind==='contact'?<div className="space-y-2"><Label htmlFor="message">{t.message}</Label><Textarea id="message" name="message" rows={4} maxLength={4000} required /></div>:<>
   {field('workAddress',t.address,'text',500)}
   <div className="grid gap-4 sm:grid-cols-2">{field('startDate',t.date,'date')}{field('startTime',t.time,'time')}</div>
   <fieldset><legend className="mb-3 text-sm font-medium">{t.type}</legend><RadioGroup value={type} onValueChange={setType} className="grid grid-cols-2 gap-3">{(['once','monthly'] as const).map(value=><Label key={value} htmlFor={`service-${value}`} className="flex min-h-12 cursor-pointer items-center gap-2 rounded-sm border border-border p-3"><RadioGroupItem id={`service-${value}`} value={value}/><span>{value==='once'?t.once:t.recurring}</span></Label>)}</RadioGroup></fieldset>
   <p className="text-sm text-muted-foreground">{t.startNote}</p>
  </>}
  {error&&<p role="alert" className="text-sm text-destructive">{t.error}</p>}
  <Button type="submit" disabled={pending} className="min-h-12 w-full"><Mail aria-hidden="true"/>{pending?t.pending:t.send}</Button>
 </form>;
}
