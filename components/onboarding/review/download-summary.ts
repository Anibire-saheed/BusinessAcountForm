import { REQUIREMENTS, type BusinessType } from "@/lib/requirements";
import {
  effectivePeople,
  personFields,
  uploadFields,
  refereeFields,
  type Application,
} from "@/lib/schemas/application";
export function downloadSummary(type: BusinessType, app: Application) {
  const req = REQUIREMENTS[type];
  const lines = [
    "Ethica MFB — Business Account Opening Summary",
    `Account type: ${req.name} (${type})`,
    "",
    "Documents:",
    ...req.documents.map(
      (d) => `${d.name}: ${app.documents[d.id]?.name || "Not attached"}`,
    ),
  ];
  req.people.forEach((group) => {
    lines.push("", group.title);
    effectivePeople(app, group.key).forEach((person, index) => {
      lines.push(`Person ${index + 1}`);
      personFields.forEach(([key, label]) =>
        lines.push(`${label}: ${person[key] || "Missing"}`),
      );
      uploadFields.forEach(([key, label]) =>
        lines.push(`${label}: ${person[key]?.name || "Not attached"}`),
      );
    });
  });
  lines.push(
    "",
    "Referee:",
    ...refereeFields.map(
      ([key, label]) => `${label}: ${app.referee[key] || "Missing"}`,
    ),
    "",
    `Business address: ${app.address || "Missing"}`,
    "",
    "Prepared locally. This application has not been submitted.",
  );
  const url = URL.createObjectURL(
    new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `ethica-mfb-${type.toLowerCase()}-application-summary.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
