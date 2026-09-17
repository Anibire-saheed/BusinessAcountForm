import { REQUIREMENTS, type BusinessType } from "../../requirements";
import type { Application } from "./draft.schema";
import type { Person } from "./person.schema";
export const emptyPerson = (): Person => ({
  name: "",
  bvn: "",
  nin: "",
  phone: "",
  email: "",
  passport: null,
  validId: null,
  signature: null,
});
export function emptyApplication(type: BusinessType): Application {
  return {
    documents: Object.fromEntries(
      REQUIREMENTS[type].documents.map((d) => [d.id, null]),
    ),
    people: Object.fromEntries(
      REQUIREMENTS[type].people.map((g) => [
        g.key,
        Array.from({ length: g.min }, emptyPerson),
      ]),
    ),
    referee: {
      accountName: "",
      accountNumber: "",
      bank: "",
      email: "",
      phone: "",
    },
    address: "",
    same: false,
  };
}
