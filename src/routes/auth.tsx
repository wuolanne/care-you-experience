import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect,useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pageHead } from "@/features/seo/head";
export const Route=createFileRoute('/auth')({ head:()=>pageHead({path:'/auth',title:'Uutisten ylläpito – kirjautuminen',description:'Kirjaudu TGN Services -uutisten ylläpitoon.',indexable:false}),component:AuthPage });
function AuthPage(){
 const navigate=useNavigate();const [mode,setMode]=useState<'login'|'signup'|'reset'>('login');const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 useEffect(()=>{void supabase.auth.getUser().then(({data})=>{if(data.user) void navigate({to:'/uutisten-yllapito'});});},[navigate]);
 async function submit(event:React.FormEvent){event.preventDefault();setBusy(true);setMessage('');try{
  if(mode==='reset'){const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/reset-password'});if(error) throw error;setMessage('Salasanan palautuslinkki on lähetetty, jos tili on olemassa.');}
  else if(mode==='signup'){const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+'/auth'}});if(error) throw error;if(data.session) await navigate({to:'/uutisten-yllapito'});else setMessage('Vahvista sähköpostiosoitteesi saamasi viestin linkistä ja kirjaudu sitten sisään.');}
  else {const {error}=await supabase.auth.signInWithPassword({email,password});if(error) throw error;await navigate({to:'/uutisten-yllapito'});}
 }catch{setMessage('Kirjautuminen ei onnistunut. Tarkista tiedot ja sähköpostivahvistus.');}finally{setBusy(false);}}
 async function social(){setBusy(true);setMessage('');try{const {data,error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/auth',skipBrowserRedirect:true}});if(error) throw error;if(data.url) window.location.assign(data.url);}catch{setMessage('Kirjautuminen ei onnistunut. Yritä uudelleen.');}finally{setBusy(false);}}
 return <section className="mx-auto max-w-md px-6 py-16"><h1 className="text-4xl">Uutisten ylläpito</h1><h2 className="mt-5 text-2xl">{mode==='signup'?'Luo ylläpitäjän tili':mode==='reset'?'Palauta salasana':'Kirjaudu sisään'}</h2>
 <form onSubmit={submit} className="mt-6 space-y-5"><div><Label htmlFor="email">Sähköpostiosoite</Label><Input id="email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></div>{mode!=='reset'&&<div><Label htmlFor="password">Salasana</Label><Input id="password" type="password" required minLength={8} autoComplete={mode==='signup'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/></div>}<Button disabled={busy} type="submit" className="w-full">{busy?'Odota…':mode==='signup'?'Luo tili':mode==='reset'?'Lähetä palautuslinkki':'Kirjaudu'}</Button></form>
 {message&&<p role="status" className="mt-5 text-sm">{message}</p>}
 {mode!=='reset'&&<div className="mt-6 grid gap-3"><Button variant="outline" disabled={busy} onClick={()=>social()}>Jatka Google-tilillä</Button></div>}
 <div className="mt-5 flex flex-wrap gap-3"><Button variant="link" className="px-0" onClick={()=>{setMode(mode==='login'?'signup':'login');setMessage('');}}>{mode==='login'?'Luo tili':'Takaisin kirjautumiseen'}</Button>{mode==='login'&&<Button variant="link" onClick={()=>{setMode('reset');setMessage('');}}>Unohditko salasanan?</Button>}</div></section>;
}
