import { describe, it, expect } from 'vitest';
import { homePackages, homeHourlyPrice, householdDeduction, contactSchema, startSchema } from './model';
describe('approved home service rules',()=>{
 it('Mini is 3 hours for 158.13 euros',()=>expect(homePackages[0]).toEqual({name:'TGN Mini',hours:3,monthly:158.13}));
 it('Medium is 6 hours for 308.73 euros',()=>expect(homePackages[1]).toEqual({name:'TGN Medium',hours:6,monthly:308.73}));
 it('Maxi is 12 hours for 602.40 euros',()=>expect(homePackages[2]).toEqual({name:'TGN Maxi',hours:12,monthly:602.4}));
 it('Premium is 24 hours for 1174.68 euros',()=>expect(homePackages[3]).toEqual({name:'TGN Premium',hours:24,monthly:1174.68}));
 it('individual hours cost 65.26 euros',()=>expect(homeHourlyPrice).toBe(65.26));
 it('2026 deduction is 40 percent, capped at 2100 with 150 deductible',()=>expect(householdDeduction).toEqual({percent:40,maximum:2100,deductible:150,year:2026}));
 it('requires email and additional details',()=>{expect(contactSchema.safeParse({email:'invalid',message:'',lang:'fi'}).success).toBe(false); expect(contactSchema.safeParse({email:'customer@example.com',message:'Siivousta',lang:'fi'}).success).toBe(true);});
 it('requires requested start fields and valid schedule',()=>{const input={customerName:'Test',contactPerson:'Test',email:'test@example.com',workAddress:'Test address',startDate:'2026-10-30',startTime:'10:00',serviceType:'monthly',lang:'fi'}; expect(startSchema.safeParse(input).success).toBe(true); expect(startSchema.safeParse({...input,startTime:'25:00'}).success).toBe(false);expect(startSchema.safeParse({...input,startDate:'2026-02-30'}).success).toBe(false);expect(startSchema.safeParse({...input,workAddress:''}).success).toBe(false);});
 it('accepts optional one-off details and a known package name',()=>{const input={customerName:'Test',contactPerson:'Test',email:'test@example.com',workAddress:'Test address',startDate:'2026-10-30',startTime:'10:00',serviceType:'once' as const,lang:'fi' as const}; expect(startSchema.safeParse({...input,onceDetails:'Ikkunanpesu'}).success).toBe(true); expect(startSchema.safeParse({...input,serviceType:'monthly',packageName:'TGN Mini'}).success).toBe(true); expect(startSchema.safeParse({...input,packageName:'TGN Unknown'}).success).toBe(false);});
});
