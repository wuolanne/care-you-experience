import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { contactRequestSchema, startRequestSchema } from './model';
function publicClient() {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  const url = process.env['SUPABASE_URL'];
  if (!key || !url) throw new Error('Service unavailable');
  return createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{ const headers = new Headers(init?.headers); if(key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey',key); return fetch(input,{...init,headers}); }}});
}
let windowStart = 0;
let requests = 0;
function burstAllowed() { const now = Date.now(); if(now-windowStart>60000){windowStart=now;requests=0;} return ++requests<=30; }
export const submitContact = createServerFn({method:'POST'}).validator(input=>contactRequestSchema.parse(input)).handler(async({data})=>{
  if(!burstAllowed()) return {ok:false};
  if(data.website) return {ok:false};
  const { saveContactRequest } = await import('@/integrations/email/request-notifications.server');
  return saveContactRequest(data, async()=>{
    const {error}=await publicClient().from('contact_submissions').insert({email:data.email,message:data.message,lang:data.lang});
    if(error) throw error;
  });
});
export const submitServiceStart = createServerFn({method:'POST'}).validator(input=>startRequestSchema.parse(input)).handler(async({data})=>{
  if(!burstAllowed()) return {ok:false};
  if(data.website) return {ok:false};
  const { saveServiceStartRequest } = await import('@/integrations/email/request-notifications.server');
  return saveServiceStartRequest(data, async()=>{
    const {error}=await publicClient().from('service_start_requests').insert({customer_name:data.customerName,contact_person:data.contactPerson,email:data.email,work_address:data.workAddress,start_date:data.startDate,start_time:data.startTime,service_type:data.serviceType,once_details:data.serviceType==='once'?(data.onceDetails??null):null,package_name:data.serviceType==='monthly'?(data.packageName??null):null,lang:data.lang});
    if(error) throw error;
  });
});
