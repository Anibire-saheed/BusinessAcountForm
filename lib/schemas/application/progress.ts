import { applicationChecks } from "./checks";
import type { Application } from "./draft.schema";
import type { BusinessType } from "../../requirements";

export function applicationProgress(
  type: BusinessType,
  application: Application,
) {
  const fields = applicationChecks(type, application).flatMap(
    (check) => check.fields,
  );
  const completed = fields.filter(
    (field) => field.schema.safeParse(field.value).success,
  ).length;
  const total = fields.length;
  return {
    completed,
    total,
    percentage: total ? Math.floor((completed / total) * 100) : 0,
  };
}
