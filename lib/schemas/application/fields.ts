/**
 * Shared field names and display labels for the account application.
 * Each list entry is [form data key, label shown to the user]. Components use
 * these lists to render inputs, checks.ts uses the keys to validate values and
 * track completion, and the downloaded summary uses the labels.
 *
 * `as const` preserves the exact keys for TypeScript and makes the lists readonly.
 * Validation rules live in text.schema.ts and file.schema.ts.
 */

/** Company registration details, operating address, and tax identifier. */
export const businessFields = [
  ["companyName", "Company Name"],
  ["rcNumber", "RC Number"],
  ["address", "Business Address"],
  ["tin", "Tax Identification Number"],
] as const;

/** Identity and contact details collected for each person in the application.
 * BVN means Bank Verification Number; NIN means National Identification Number.
 */
export const personFields = [
  ["name", "Full name"],
  ["bvn", "BVN"],
  ["nin", "NIN"],
  ["phone", "Phone number"],
  ["email", "Email"],
] as const;

/** Files collected for each person: their photo, identification, and signature.
 * Company document requirements are defined separately in lib/requirements.ts.
 */
export const uploadFields = [
  ["passport", "Passport photograph"],
  ["validId", "Valid ID"],
  ["signature", "E-signature"],
] as const;

/** Bank account and contact details of the referee supporting the application. */
export const refereeFields = [
  ["accountName", "Account name"],
  ["accountNumber", "Account number"],
  ["bank", "Bank"],
  ["email", "Email"],
  ["phone", "Phone number"],
] as const;

/** Maps internal people-group keys to singular titles for rows and action buttons. */
export const personTitles: Record<string, string> = {
  admin: "Admin officer",
  directors: "Director",
  proprietors: "Proprietor",
  trustees: "Trustee",
  signatories: "Signatory",
};
