import { REQUIREMENTS, type BusinessType } from "../../requirements";
import type { Application } from "./draft.schema";
import type { Person } from "./person.schema";
import { fileSchema } from "./file.schema";
import { textSchemas } from "./text.schema";
import {
  personFields,
  personTitles,
  refereeFields,
  uploadFields,
} from "./fields";
export function isEmptyPerson(person: Person) {
  return (
    personFields.every(([key]) => !person[key].trim()) &&
    uploadFields.every(([key]) => !person[key])
  );
}
export function linkedSignatories(app: Application) {
  return ["directors", "proprietors", "trustees"].flatMap((key) =>
    (app.people[key] || []).flatMap((person, index) =>
      person.isSignatory
        ? [
            {
              person:
                key === "proprietors" && index === 0 && app.same
                  ? app.people.admin[0]
                  : person,
              path:
                key === "proprietors" && index === 0 && app.same
                  ? "people.admin.0"
                  : `people.${key}.${index}`,
              label: `${personTitles[key]} ${index + 1}`,
            },
          ]
        : [],
    ),
  );
}
export function signatoryEntries(app: Application) {
  const linked = linkedSignatories(app);
  const manual = (app.people.signatories || []).flatMap((person, index) =>
    linked.length && index === 0 && isEmptyPerson(person)
      ? []
      : [{ person, path: `people.signatories.${index}`, label: "Signatory" }],
  );
  return [...linked, ...manual];
}
export function effectivePeople(app: Application, key: string): Person[] {
  if (key === "signatories")
    return signatoryEntries(app).map((entry) => entry.person);
  const people = app.people[key] || [];
  return key === "proprietors" && app.same && app.people.admin?.[0]
    ? [app.people.admin[0], ...people.slice(1)]
    : people;
}
export function applicationChecks(type: BusinessType, app: Application) {
  const req = REQUIREMENTS[type];
  return [
    ...req.documents.map((d) => ({
      label: d.name,
      fields: [
        {
          path: `documents.${d.id}`,
          schema: fileSchema,
          value: app.documents[d.id],
        },
      ],
    })),
    ...req.people.flatMap((g) =>
      effectivePeople(app, g.key).map((person, i) => ({
        label: `${personTitles[g.key]} ${i + 1}${person.name ? ` — ${person.name}` : ""}`,
        fields: [
          ...personFields.map(([key]) => ({
            path: `${g.key === "signatories" ? signatoryEntries(app)[i].path : `people.${g.key}.${i}`}.${key}`,
            schema: textSchemas[key],
            value: person[key],
          })),
          ...uploadFields.map(([key]) => ({
            path: `${g.key === "signatories" ? signatoryEntries(app)[i].path : `people.${g.key}.${i}`}.${key}`,
            schema: fileSchema,
            value: person[key],
          })),
        ],
      })),
    ),
    {
      label: "Referee details",
      fields: refereeFields.map(([key]) => ({
        path: `referee.${key}`,
        schema: textSchemas[key],
        value: app.referee[key],
      })),
    },
    {
      label: "Business address",
      fields: [
        { path: "address", schema: textSchemas.address, value: app.address },
      ],
    },
  ];
}
