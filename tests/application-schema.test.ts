import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applicationChecks,
  createApplicationSchema,
  effectivePeople,
  emptyApplication,
  emptyPerson,
  fileSchema,
  textSchemas,
  type Application,
} from "../lib/schemas/application";
import { REQUIREMENTS, type BusinessType } from "../lib/requirements";

const document = () =>
  new File(["test document"], "document.pdf", { type: "application/pdf" });
function completeApplication(type: BusinessType): Application {
  const app = emptyApplication(type);
  for (const doc of REQUIREMENTS[type].documents)
    app.documents[doc.id] = document();
  for (const group of REQUIREMENTS[type].people)
    app.people[group.key] = app.people[group.key].map(() => ({
      name: "Test Person",
      bvn: "12345678901",
      nin: "10987654321",
      phone: "+234 801 234 5678",
      email: "test@example.com",
      passport: document(),
      validId: document(),
      signature: document(),
    }));
  app.referee = {
    accountName: "Example Ltd",
    accountNumber: "0123456789",
    bank: "Example Bank",
    email: "referee@example.com",
    phone: "08012345678",
  };
  app.address = "12 Example Street, Lagos";
  return app;
}
for (const type of ["RC", "BN", "IT"] as const) {
  test(`${type}: accepts complete applications and rejects empty applications`, () => {
    const schema = createApplicationSchema(type);
    assert.equal(schema.safeParse(completeApplication(type)).success, true);
    const result = schema.safeParse(emptyApplication(type));
    assert.equal(result.success, false);
    if (!result.success)
      assert.ok(
        result.error.issues.some((issue) => issue.path.join(".") === "address"),
      );
  });
  test(`${type}: requires every document and enforces person counts`, () => {
    const app = completeApplication(type);
    for (const doc of REQUIREMENTS[type].documents) {
      const original = app.documents[doc.id];
      delete app.documents[doc.id];
      assert.equal(createApplicationSchema(type).safeParse(app).success, false);
      app.documents[doc.id] = original;
    }
    for (const group of REQUIREMENTS[type].people) {
      const original = app.people[group.key];
      app.people[group.key] = original.slice(0, group.min - 1);
      assert.equal(createApplicationSchema(type).safeParse(app).success, false);
      app.people[group.key] = Array.from(
        { length: group.max + 1 },
        () => original[0],
      );
      assert.equal(createApplicationSchema(type).safeParse(app).success, false);
      app.people[group.key] = original;
    }
  });
}
test("rejects whitespace, invalid identifiers, email, account numbers and punctuation-only phone numbers", () => {
  for (const [key, value] of [
    ["name", "   "],
    ["address", "\n"],
    ["bvn", "123"],
    ["nin", "1234567890a"],
    ["email", "invalid@"],
    ["accountNumber", "12345678901"],
    ["phone", "-------"],
  ])
    assert.equal(textSchemas[key].safeParse(value).success, false, key);
  assert.equal(textSchemas.accountNumber.safeParse("0123456789").success, true);
});
test("uploads reject missing, empty, oversized and unsupported files", () => {
  for (const file of [
    null,
    undefined,
    new File([], "empty.pdf"),
    new File(["x"], "script.exe"),
    new File(["x"], "fake.pdf", { type: "text/javascript" }),
    new File([new Uint8Array(10 * 1024 * 1024 + 1)], "big.pdf"),
  ])
    assert.equal(fileSchema.safeParse(file).success, false);
  for (const [name, type] of [
    ["document.pdf", "application/pdf"],
    ["photo.jpg", "image/jpeg"],
    ["photo.png", "image/png"],
  ])
    assert.equal(
      fileSchema.safeParse(new File(["x"], name, { type })).success,
      true,
    );
});
test("same-as-admin follows edits and reports errors against visible admin fields", () => {
  const app = completeApplication("BN");
  app.people.proprietors[0] = emptyPerson();
  app.same = true;
  const schema = createApplicationSchema("BN");
  assert.equal(schema.safeParse(app).success, true);
  app.people.admin[0].bvn = "bad";
  assert.equal(effectivePeople(app, "proprietors")[0].bvn, "bad");
  const result = schema.safeParse(app);
  assert.equal(result.success, false);
  if (!result.success)
    assert.ok(
      result.error.issues.every(
        (issue) => issue.path.join(".") === "people.admin.0.bvn",
      ),
    );
  app.people.admin[0].bvn = "12345678901";
  app.same = false;
  assert.equal(schema.safeParse(app).success, false);
});
test("progress and schema agree when a required signature is missing", () => {
  const app = completeApplication("RC");
  app.people.signatories[0].signature = null;
  const fields = applicationChecks("RC", app).flatMap((check) => check.fields);
  assert.equal(
    fields.filter((field) => !field.schema.safeParse(field.value).success)
      .length,
    1,
  );
  const result = createApplicationSchema("RC").safeParse(app);
  assert.equal(result.success, false);
  if (!result.success)
    assert.equal(
      result.error.issues[0].path.join("."),
      "people.signatories.0.signature",
    );
});
