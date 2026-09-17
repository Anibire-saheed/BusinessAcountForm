import assert from "node:assert/strict";
import { test } from "node:test";
import {
  emptyApplication,
  emptyPerson,
  applicationChecks,
  createApplicationSchema,
} from "../lib/schemas/application";
import {
  effectivePeople,
  signatoryEntries,
} from "../lib/schemas/application/checks";

for (const [type, group] of [
  ["RC", "directors"],
  ["BN", "proprietors"],
  ["IT", "trustees"],
] as const) {
  test(`${type}: certificate and status report are independently required`, () => {
    const app = emptyApplication(type);
    app.documents.cac = new File(["x"], "certificate.pdf", {
      type: "application/pdf",
    });
    const result = createApplicationSchema(type).safeParse(app);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(
        result.error.issues.some(
          (issue) => issue.path.join(".") === "documents.statusReport",
        ),
      );
      assert.ok(
        !result.error.issues.some(
          (issue) => issue.path.join(".") === "documents.cac",
        ),
      );
    }
  });
  test(`${type}: linked signatories follow edits, uploads, unlinking and removal`, () => {
    const app = emptyApplication(type);
    const source = app.people[group][0];
    source.isSignatory = true;
    source.name = "First name";
    assert.equal(effectivePeople(app, "signatories").length, 1);
    source.name = "Updated name";
    source.passport = new File(["x"], "photo.png", { type: "image/png" });
    assert.equal(effectivePeople(app, "signatories")[0].name, "Updated name");
    assert.equal(
      effectivePeople(app, "signatories")[0].passport,
      source.passport,
    );
    const check = applicationChecks(type, app).find((check) =>
      check.label.startsWith("Signatory 1"),
    )!;
    assert.equal(check.fields[0].path, `people.${group}.0.name`);
    source.isSignatory = false;
    assert.equal(effectivePeople(app, "signatories")[0].name, "");
    source.isSignatory = true;
    app.people[group].splice(0, 1);
    assert.equal(
      signatoryEntries(app).some((entry) => entry.person === source),
      false,
    );
  });
}
test("linked signatories preserve manual entries and support admin-proprietor reuse", () => {
  const app = emptyApplication("BN");
  app.same = true;
  app.people.admin[0].name = "Admin name";
  app.people.proprietors[0].isSignatory = true;
  app.people.signatories[0].name = "Manual name";
  assert.deepEqual(
    effectivePeople(app, "signatories").map((p) => p.name),
    ["Admin name", "Manual name"],
  );
  assert.equal(signatoryEntries(app)[0].path, "people.admin.0");
  app.people.proprietors[0].isSignatory = false;
  assert.equal(effectivePeople(app, "signatories")[0].name, "Manual name");
});
test("combined linked and manual signatories enforce the maximum", () => {
  const app = emptyApplication("RC");
  app.people.directors = Array.from({ length: 6 }, () => ({
    ...emptyPerson(),
    isSignatory: true,
  }));
  app.people.signatories[0].name = "Manual extra";
  const result = createApplicationSchema("RC").safeParse(app);
  assert.equal(result.success, false);
  if (!result.success)
    assert.ok(
      result.error.issues.some(
        (issue) => issue.path.join(".") === "people.signatories.root",
      ),
    );
});
