import type { BusinessType } from "@/lib/requirements";

export type DocumentType =
  "CAC_CERTIFICATE" | "CAC_STATUS_REPORT" | "MEMART" | "BOARD_RESOLUTION";
export type PersonFileType = "PASSPORT_PHOTO" | "VALID_ID" | "E_SIGNATURE";
export type PrincipalRole =
  "ADMIN_OFFICER" | "DIRECTOR" | "PROPRIETOR" | "TRUSTEE";
export interface BusinessDetails {
  businessName: string;
  registrationNumber: string;
  businessAddress: string;
  tin: string;
}
export interface CreateApplicationInput extends BusinessDetails {
  businessType: BusinessType;
}
export interface PersonInput {
  fullName: string;
  bvn: string;
  nin: string;
  phoneNumber: string;
  email: string;
}
export type PrincipalInput = { role: PrincipalRole; alsoSignatory: boolean } & (
  | (PersonInput & { sameAsAdminOfficer?: false })
  | { role: "PROPRIETOR"; sameAsAdminOfficer: true }
);
export interface RefereeInput {
  accountName: string;
  accountNumber: string;
  bankName: string;
  email: string;
  phoneNumber: string;
}
export interface UploadedFiles {
  passportPhotoUploaded: boolean;
  validIdUploaded: boolean;
  signatureUploaded: boolean;
}
export interface Principal extends PersonInput, UploadedFiles {
  id: number;
  role: PrincipalRole;
  alsoSignatory: boolean;
  sameAsAdminOfficer: boolean;
}
export interface Signatory extends PersonInput, UploadedFiles {
  id: number;
  addedAutomatically: boolean;
}
