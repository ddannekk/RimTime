export const FREE_SHIPPING_THRESHOLD = 4900;
export const STANDARD_SHIPPING_COST = 500;
export const RETURN_DAYS = 100;
export const VAT_RATE = 0.19;

export function getShippingCost(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}

export function getRemainingForFreeShipping(subtotal: number) {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

export function getIncludedVat(grossAmount: number) {
  return Math.round(grossAmount * (VAT_RATE / (1 + VAT_RATE)));
}
