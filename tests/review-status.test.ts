import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applicationChecks,
  emptyApplication,
} from "../lib/schemas/application";
import { reviewStatus } from "../lib/schemas/application/review-status";

test("person status changes from missing to in progress to complete and back", () => {
  const app = emptyApplication("BN");
  const status = () =>
    reviewStatus(
      applicationChecks("BN", app).find((check) =>
        check.label.startsWith("Admin officer 1"),
      )!,
    );
  assert.equal(status().status, "Missing");
  app.people.admin[0].email = "invalid";
  assert.deepEqual(status(), { status: "In progress", completed: 0, total: 8 });
  Object.assign(app.people.admin[0], {
    name: "Jane Doe",
    bvn: "12345678901",
    nin: "12345678901",
    phone: "08012345678",
    email: "jane@example.com",
  });
  assert.equal(status().completed, 5);
  const file = new File(["document"], "document.pdf", {
    type: "application/pdf",
  });
  Object.assign(app.people.admin[0], {
    passport: file,
    validId: file,
    signature: file,
  });
  assert.equal(status().status, "Complete");
  app.people.admin[0].signature = null;
  assert.equal(status().status, "In progress");
});

test("documents and address become complete immediately and reset when cleared", () => {
  const app = emptyApplication("BN");
  app.documents.cac = new File(["document"], "cac.pdf", {
    type: "application/pdf",
  });
  app.address = "12 Example Street";
  let checks = applicationChecks("BN", app);
  assert.equal(reviewStatus(checks[0]).status, "Complete");
  assert.equal(reviewStatus(checks.at(-1)!).status, "Complete");
  app.documents.cac = null;
  app.address = "   ";
  checks = applicationChecks("BN", app);
  assert.equal(reviewStatus(checks[0]).status, "Missing");
  assert.equal(reviewStatus(checks.at(-1)!).status, "Missing");
});
