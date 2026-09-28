import type { Application, Person } from "@/types/applicationForm.types";
import type {
  BusinessDetails,
  DocumentType,
  PersonFileType,
  PersonInput,
  PrincipalRole,
  RefereeInput,
} from "@/types/businessApplication.types";

/** Translate form document keys into the backend upload categories. */
export const documentTypes: Record<string, DocumentType> = {
  cac: "CAC_CERTIFICATE",
  statusReport: "CAC_STATUS_REPORT",
  memart: "MEMART",
  boardres: "BOARD_RESOLUTION",
};

/** Translate form people groups into backend roles; signatories use separate routes. */
export const principalRoles: Record<string, PrincipalRole> = {
  admin: "ADMIN_OFFICER",
  directors: "DIRECTOR",
  proprietors: "PROPRIETOR",
  trustees: "TRUSTEE",
};

/** Pair each person file field with its backend upload category. */
export const personFiles = [
  ["passport", "PASSPORT_PHOTO"],
  ["validId", "VALID_ID"],
  ["signature", "E_SIGNATURE"],
] as const satisfies ReadonlyArray<readonly [keyof Person, PersonFileType]>;

/** Convert business form fields into the API payload and trim surrounding whitespace. */
export function toBusinessDetails(values: Application): BusinessDetails {
  return {
    businessName: values.companyName.trim(),
    registrationNumber: values.rcNumber.trim(),
    businessAddress: values.address.trim(),
    tin: values.tin.trim(),
  };
}

/** Map identity/contact fields; files and principal roles are sent separately. */
export function toPerson(person: Person): PersonInput {
  return {
    fullName: person.name.trim(),
    bvn: person.bvn.trim(),
    nin: person.nin.trim(),
    phoneNumber: person.phone.trim(),
    email: person.email.trim(),
  };
}

/** Convert the form’s referee section into backend account and contact fields. */
export function toReferee(values: Application): RefereeInput {
  return {
    accountName: values.referee.accountName.trim(),
    accountNumber: values.referee.accountNumber.trim(),
    bankName: values.referee.bank.trim(),
    email: values.referee.email.trim(),
    phoneNumber: values.referee.phone.trim(),
  };
}
