export const LEGAL_STAND = "Mai 2026";

export const merchantProfile = {
  brandName: "RIMtime",
  operatorName: "RIMtime Studio",
  legalForm: "UG (haftungsbeschränkt)",
  representative: "Max Weber",
  street: "Kaiser-Joseph-Straße 254",
  postalCode: "79098",
  city: "Freiburg im Breisgau",
  country: "Deutschland",
  email: "demo@rimtime-shop.de",
  phone: "+49 (0) 761 458 91 20",
  registerCourt: "Amtsgericht Freiburg i. Br.",
  registerNumber: "HRB 729451",
  vatId: "DE361482917",
} as const;

export function getMerchantDisplayName() {
  return merchantProfile.legalForm
    ? `${merchantProfile.operatorName}, ${merchantProfile.legalForm}`
    : merchantProfile.operatorName;
}

export function getMerchantAddressLine() {
  return `${merchantProfile.street}, ${merchantProfile.postalCode} ${merchantProfile.city}`;
}
