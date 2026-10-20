import { createFileRoute,useNavigate } from '@tanstack/react-router';
import { useEffect,useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pageHead } from '@/features/news/head';
export const Route=createFileRoute('/reset-password')({head:()=>pageHead('Uusi salasana','Aseta uusi salasana TGN Services -uutisten ylläpitoon.'),component:ResetPassword});
function ResetPassword(){const [password,setPassword]=useState('');const [confirm,setConfirm]=useState('');const [ready,setReady]=useState(false);const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);const navigate=useNavigate();
 useEffect(()=>{const hash=new URLSearchParams(window.location.hash.slice(1));if(hash.get('type')==='recovery'){void supabase.auth.getUser().then(({data})=>setReady(Boolean(data.user)));}else setMessage('Avaa salasanan palautuslinkki sähköpostistasi.');},[]);
 return <section className="mx-auto max-w-md px-6 py-16"><h1 className="text-4xl">Uusi salasana</h1><form className="mt-6 space-y-5" onSubmit={async e=>{e.preventDefault();if(password!==confirm){setMessage('Salasanat eivät täsmää.');return;}setBusy(true);const {error}=await supabase.auth.updateUser({password});setBusy(false);if(error)setMessage('Salasanaa ei voitu vaihtaa. Pyydä uusi palautuslinkki.');else await navigate({to:'/uutisten-yllapito'});}}><Label htmlFor="new-password">Uusi salasana</Label><Input id="new-password" required minLength={8} type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/><Label htmlFor="confirm-password">Vahvista salasana</Label><Input id="confirm-password" required minLength={8} type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)}/><Button disabled={!ready||busy} type="submit">Tallenna salasana</Button></form>{message&&<p role="status" className="mt-5">{message}</p>}</section>;
}