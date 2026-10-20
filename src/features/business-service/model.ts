// Business plan prices excluding VAT; VAT is stated separately in the pricing view.
export const businessPackages = [
  { name: 'TGN Mini B2B', hours: 4, monthly: 180 },
  { name: 'TGN Medium B2B', hours: 8, monthly: 350 },
  { name: 'TGN Maxi B2B', hours: 16, monthly: 680 },
  { name: 'TGN Premium B2B', hours: 32, monthly: 1312 },
] as const;
export const businessHourlyPrice = 55;