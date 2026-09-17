export const personFields = [
  ["name", "Full name"],
  ["bvn", "BVN"],
  ["nin", "NIN"],
  ["phone", "Phone number"],
  ["email", "Email"],
] as const;
export const uploadFields = [
  ["passport", "Passport photograph"],
  ["validId", "Valid ID"],
  ["signature", "E-signature"],
] as const;
export const refereeFields = [
  ["accountName", "Account name"],
  ["accountNumber", "Account number"],
  ["bank", "Bank"],
  ["email", "Email"],
  ["phone", "Phone number"],
] as const;
export const personTitles: Record<string, string> = {
  admin: "Admin officer",
  directors: "Director",
  proprietors: "Proprietor",
  trustees: "Trustee",
  signatories: "Signatory",
};
