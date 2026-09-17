export type BusinessType = "RC" | "BN" | "IT";
export type PeopleGroup = {
  key: string;
  title: string;
  min: number;
  max: number;
  note?: string;
  sameAsAdmin?: boolean;
};
export type Requirement = {
  name: string;
  subtitle: string;
  documents: { id: string; name: string; hint: string }[];
  people: PeopleGroup[];
  referee: { label: string; note: string };
  address: boolean;
};
export const REQUIREMENTS: Record<BusinessType, Requirement> = {
  RC: {
    name: "Registered company",
    subtitle: "Requirements for a Registered Company (RC) business account.",
    documents: [
      {
        id: "cac",
        name: "CAC Certificate",
        hint: "Certified copy of your CAC registration certificate",
      },
      {
        id: "statusReport",
        name: "CAC Status Report",
        hint: "Issued within the last 6 months",
      },
      {
        id: "memart",
        name: "MEMART",
        hint: "Memorandum and Articles of Association",
      },
      {
        id: "boardres",
        name: "Board Resolution",
        hint: "Stating the account signatories",
      },
      {
        id: "tin",
        name: "Tax Identification Number (TIN)",
        hint: "Company TIN certificate",
      },
    ],
    people: [
      { key: "admin", title: "Admin officer", min: 1, max: 1 },
      {
        key: "directors",
        title: "Directors",
        min: 2,
        max: 6,
        note: "At least two directors are required.",
      },
      { key: "signatories", title: "Signatories", min: 1, max: 6 },
    ],
    referee: {
      label: "Referee",
      note: "Corporate account held with another bank.",
    },
    address: true,
  },
  BN: {
    name: "Business name",
    subtitle: "Requirements for a Business Name (BN) account.",
    documents: [
      {
        id: "cac",
        name: "CAC Certificate",
        hint: "Certified copy of your CAC registration certificate",
      },
      {
        id: "statusReport",
        name: "CAC Status Report",
        hint: "Issued within the last 6 months",
      },
      {
        id: "tin",
        name: "Tax Identification Number (TIN)",
        hint: "Business TIN certificate",
      },
    ],
    people: [
      { key: "admin", title: "Admin officer", min: 1, max: 1 },
      {
        key: "proprietors",
        title: "Proprietors",
        min: 1,
        max: 4,
        note: "As stated on the CAC Status Report.",
        sameAsAdmin: true,
      },
      { key: "signatories", title: "Signatories", min: 1, max: 6 },
    ],
    referee: {
      label: "Referee",
      note: "Business account held with another bank.",
    },
    address: true,
  },
  IT: {
    name: "Incorporated trustees",
    subtitle: "Requirements for an Incorporated Trustees (IT) account.",
    documents: [
      {
        id: "cac",
        name: "CAC Certificate",
        hint: "Certified copy of your CAC registration certificate",
      },
      {
        id: "statusReport",
        name: "CAC Status Report",
        hint: "Issued within the last 6 months",
      },
      {
        id: "boardres",
        name: "Board Resolution",
        hint: "Stating the account signatories",
      },
      {
        id: "tin",
        name: "Tax Identification Number (TIN)",
        hint: "Organisation TIN certificate",
      },
    ],
    people: [
      { key: "admin", title: "Admin officer", min: 1, max: 1 },
      {
        key: "trustees",
        title: "Board of trustees",
        min: 2,
        max: 6,
        note: "At least two trustees are required.",
      },
      { key: "signatories", title: "Signatories", min: 1, max: 6 },
    ],
    referee: {
      label: "Referee",
      note: "Business account held with another bank.",
    },
    address: true,
  },
};
