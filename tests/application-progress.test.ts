import assert from "node:assert/strict";
import { test } from "node:test";
import { emptyApplication, emptyPerson } from "../lib/schemas/application";
import { applicationProgress } from "../lib/schemas/application/progress";

test("completion updates as valid details are entered, cleared and files selected", () => {
  const app = emptyApplication("BN");
  assert.equal(applicationProgress("BN", app).percentage, 0);
  app.people.admin[0].name = "Jane Doe";
  const first = applicationProgress("BN", app);
  assert.equal(first.completed, 1);
  assert.ok(first.percentage > 0);
  app.people.admin[0].email = "invalid";
  assert.equal(applicationProgress("BN", app).completed, 1);
  app.people.admin[0].email = "jane@example.com";
  assert.equal(applicationProgress("BN", app).completed, 2);
  app.documents.cac = new File(["document"], "cac.pdf", {
    type: "application/pdf",
  });
  assert.equal(applicationProgress("BN", app).completed, 3);
  app.people.admin[0].name = "";
  assert.equal(applicationProgress("BN", app).completed, 2);
  app.documents.cac = null;
  assert.equal(applicationProgress("BN", app).completed, 1);
});

test("completion recalculates for shared admin details and added or removed people", () => {
  const app = emptyApplication("BN");
  app.people.admin[0].name = "Jane Doe";
  app.same = true;
  const shared = applicationProgress("BN", app);
  assert.equal(shared.completed, 2);
  app.people.signatories.push(emptyPerson());
  assert.equal(applicationProgress("BN", app).total, shared.total + 8);
  app.people.signatories.pop();
  assert.deepEqual(applicationProgress("BN", app), shared);
  app.same = false;
  assert.equal(applicationProgress("BN", app).completed, 1);
});
