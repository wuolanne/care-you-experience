import { describe, it, expect } from 'vitest';
import { businessPackages, businessHourlyPrice } from './model';

describe('Business plan pricing', () => {
  it.each([[0, 4, 180], [1, 8, 350], [2, 16, 680], [3, 32, 1312]])('retains package %i source hours and net price', (index, hours, monthly) => {
    expect(businessPackages[index]?.hours).toBe(hours);
    expect(businessPackages[index]?.monthly).toBe(monthly);
  });
  it('retains the separate net hourly price', () => {
    expect(businessHourlyPrice).toBe(55);
  });
});