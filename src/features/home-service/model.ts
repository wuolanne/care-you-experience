import { z } from 'zod';
import { businessPackages } from '../business-service/model';
export const householdDeduction = { percent: 40, maximum: 2100, deductible: 150, year: 2026 } as const;
export const homePackages = [
  { name: 'TGN Mini', hours: 3, monthly: 158.13 },
  { name: 'TGN Medium', hours: 6, monthly: 308.73 },
  { name: 'TGN Maxi', hours: 12, monthly: 602.40 },
  { name: 'TGN Premium', hours: 24, monthly: 1174.68 },
] as const;
export const homeHourlyPrice = 65.26;
const lang = z.enum(['fi','sv','es','en']);
export const contactSchema = z.object({ email: z.string().trim().toLowerCase().email().max(255), message: z.string().trim().min(1).max(4000), lang });
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => { const d = new Date(value + 'T12:00:00Z'); return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10) === value; }, 'invalid_date');
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const packageNames = [...homePackages, ...businessPackages].map(p => p.name) as [string, ...string[]];
export const startSchema = z.object({ customerName: z.string().trim().min(1).max(200), contactPerson: z.string().trim().min(1).max(200), email: contactSchema.shape.email, workAddress: z.string().trim().min(1).max(500), startDate: dateSchema, startTime: timeSchema, serviceType: z.enum(['once','monthly']), onceDetails: z.string().trim().max(500).optional(), packageName: z.enum(packageNames).optional(), lang });
