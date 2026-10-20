// Business plan prices excluding VAT; VAT is stated separately in the pricing view.
export const businessPackages = [
  { name: 'TGN Mini B2B', hours: 4, monthly: 180 },
  { name: 'TGN Medium B2B', hours: 8, monthly: 350 },
  { name: 'TGN Maxi B2B', hours: 16, monthly: 680 },
  { name: 'TGN Premium B2B', hours: 32, monthly: 1312 },
] as const;
export const businessHourlyPrice = 55;
// VAT-inclusive display price: net + 25.5% VAT, rounded to cents (half up).
export const withBusinessVat = (net: number) => Math.round(net * 1.255 * 100 + 1e-9) / 100;