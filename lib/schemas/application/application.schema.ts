import { REQUIREMENTS, type BusinessType } from "../../requirements";
import { draftSchema } from "./draft.schema";
import { applicationChecks } from "./checks";
export function createApplicationSchema(type: BusinessType) {
  return draftSchema.superRefine((app, ctx) => {
    for (const group of REQUIREMENTS[type].people) {
      const count = app.people[group.key]?.length || 0;
      if (count < group.min || count > group.max)
        ctx.addIssue({
          code: "custom",
          path: ["people", group.key, "root"],
          message: `Provide ${group.min}–${group.max} ${group.title.toLowerCase()}.`,
        });
    }
    for (const check of applicationChecks(type, app))
      for (const field of check.fields) {
        const result = field.schema.safeParse(field.value);
        if (!result.success)
          ctx.addIssue({
            code: "custom",
            path: (type === "BN" && app.same
              ? field.path.replace("people.proprietors.0.", "people.admin.0.")
              : field.path
            )
              .split(".")
              .map((p) => (/^\d+$/.test(p) ? Number(p) : p)),
            message: result.error.issues[0].message,
          });
      }
  });
}
