import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useState,useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useLang } from '@/i18n/LanguageProvider';
import { newsCopy } from './model';
export function NewsAdminLink() {
 const [signedIn,setSignedIn] = useState(false); const router=useRouter(); const queryClient=useQueryClient(); const navigate=useNavigate(); const {lang}=useLang();
 useEffect(() => { let active=true; void supabase.auth.getUser().then(({data}) => { if(active) setSignedIn(Boolean(data.user)); }); return () => { active=false; }; },[router.state.location.href]);
 return <div className="mt-3 flex flex-wrap justify-center gap-3"><Link to={signedIn ? '/uutisten-yllapito' : '/auth'} className="text-xs hover:text-primary">{newsCopy[lang].manage}</Link>{signedIn&&<Link to="/pyynnot" className="text-xs hover:text-primary">{({fi:'Asiakaspyynnöt',sv:'Kundförfrågningar',es:'Solicitudes de clientes',en:'Customer requests'})[lang]}</Link>}{signedIn && <Button variant="link" className="h-auto p-0 text-xs" onClick={async () => {await queryClient.cancelQueries();queryClient.clear();await supabase.auth.signOut();setSignedIn(false);await navigate({to:'/auth',replace:true});}}>Kirjaudu ulos</Button>}</div>;
}