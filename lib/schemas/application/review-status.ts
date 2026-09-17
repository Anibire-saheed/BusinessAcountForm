import type { applicationChecks } from "./checks";

type Check = ReturnType<typeof applicationChecks>[number];

export function reviewStatus(check: Check) {
  const total = check.fields.length;
  const completed = check.fields.filter(
    (field) => field.schema.safeParse(field.value).success,
  ).length;
  const started = check.fields.some((field) =>
    typeof field.value === "string"
      ? field.value.trim().length > 0
      : field.value != null,
  );
  const status =
    completed === total && total > 0
      ? "Complete"
      : started
        ? "In progress"
        : "Missing";
  return { status, completed, total };
}
