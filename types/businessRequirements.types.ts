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
