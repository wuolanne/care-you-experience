import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { editorAccess } from '@/features/news/editor.functions';
import { pageHead } from '@/features/news/head';
const requestQuery=queryOptions({queryKey:['owner-requests'],queryFn:async()=>{
 const allowed=await editorAccess(); if(!allowed)return {allowed:false,contacts:[],starts:[]};
 const [contacts,starts]=await Promise.all([supabase.from('contact_submissions').select('*').order('created_at',{ascending:false}),supabase.from('service_start_requests').select('*').order('created_at',{ascending:false})]);
 if(contacts.error||starts.error)throw new Error('Pyyntöjä ei voitu ladata.');
 return {allowed:true,contacts:contacts.data,starts:starts.data};
}});
export const Route=createFileRoute('/_authenticated/pyynnot')({head:()=>pageHead('Asiakaspyynnöt','TGN Services -yhteydenotot ja palvelun aloituspyynnöt.'),loader:({context})=>context.queryClient.ensureQueryData(requestQuery),component:Requests});
function Requests(){const {data}=useSuspenseQuery(requestQuery);
 if(!data.allowed)return <p className="p-10">Tarvitset ylläpitäjän oikeudet pyyntöjen katseluun.</p>;
 return <main className="mx-auto max-w-5xl px-6 py-14"><h1 className="text-4xl">Asiakaspyynnöt</h1><h2 className="mt-10 text-3xl">Yhteydenottopyynnöt</h2>{!data.contacts.length&&<p className="mt-4 text-muted-foreground">Ei yhteydenottopyyntöjä.</p>}{data.contacts.map(r=><article key={r.id} className="border-b border-border py-6"><p className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString('fi-FI')} · {r.lang.toUpperCase()}</p><p className="mt-2 font-medium">{r.email}</p><p className="mt-2 whitespace-pre-wrap break-words">{r.message}</p></article>)}<h2 className="mt-12 text-3xl">Palvelun aloituspyynnöt</h2>{!data.starts.length&&<p className="mt-4 text-muted-foreground">Ei aloituspyyntöjä.</p>}{data.starts.map(r=><article key={r.id} className="border-b border-border py-6"><p className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString('fi-FI')} · {r.lang.toUpperCase()}</p><h3 className="mt-2 text-2xl">{r.customer_name}</h3><p className="mt-2">{r.contact_person} · {r.email}</p><p className="mt-2">{r.work_address}</p><p className="mt-2">{r.start_date} · {r.start_time} (Suomen aikaa) · {r.service_type==='monthly'?'Kuukausiasiakkuus':'Kertakäynti'}</p></article>)}</main>;
}
