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
export function effectivePeople(app: Application, key: string): Person[] {
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
            path: `people.${g.key}.${i}.${key}`,
            schema: textSchemas[key],
            value: person[key],
          })),
          ...uploadFields.map(([key]) => ({
            path: `people.${g.key}.${i}.${key}`,
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
