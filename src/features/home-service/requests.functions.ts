import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { contactSchema, startSchema } from './model';
function publicClient() {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  const url = process.env['SUPABASE_URL'];
  if (!key || !url) throw new Error('Service unavailable');
  return createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{ const headers = new Headers(init?.headers); if(key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey',key); return fetch(input,{...init,headers}); }}});
}
let windowStart = 0;
let requests = 0;
function burstAllowed() { const now = Date.now(); if(now-windowStart>60000){windowStart=now;requests=0;} return ++requests<=30; }
export const submitContact = createServerFn({method:'POST'}).inputValidator(input=>contactSchema.parse(input)).handler(async({data})=>{
  if(!burstAllowed()) return {ok:false};
  const {error}=await publicClient().from('contact_submissions').insert({email:data.email,message:data.message,lang:data.lang});
  return {ok:!error};
});
export const submitServiceStart = createServerFn({method:'POST'}).inputValidator(input=>startSchema.parse(input)).handler(async({data})=>{
  if(!burstAllowed()) return {ok:false};
  const {error}=await publicClient().from('service_start_requests').insert({customer_name:data.customerName,contact_person:data.contactPerson,email:data.email,work_address:data.workAddress,start_date:data.startDate,start_time:data.startTime,service_type:data.serviceType,lang:data.lang});
  return {ok:!error};
});
