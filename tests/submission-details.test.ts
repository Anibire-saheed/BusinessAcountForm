import assert from "node:assert/strict";
import test from "node:test";
import { applicationsApi } from "../app/apiService/applicationService";
import { emptyApplication } from "../lib/schemas/application/defaults";
import { emptySession } from "../lib/onboarding/session";
import { submitApplicationWorkflow } from "../lib/onboarding/submit-application";

test("creation saves its UUID before updating details and retries reuse it", async () => {
  let session = emptySession();
  const calls: string[] = [];
  let failUpdate = true;
  const api = {
    ...applicationsApi,
    async create() {
      calls.push("create");
      return "application-123";
    },
    async updateBusinessDetails(id: string) {
      assert.equal(id, "application-123");
      assert.equal(session.applicationUUID, id);
      calls.push("update");
      if (failUpdate) throw new Error("Update failed");
      return null;
    },
  };
  const options = () => ({
    type: "RC" as const,
    values: emptyApplication("RC"),
    confirmed: false,
    section: "details" as const,
    session,
    saveSession: (next: typeof session) => { session = next; },
  });
  await assert.rejects(submitApplicationWorkflow(options(), api), /Update failed/);
  assert.equal(session.createUncertain, undefined);
  failUpdate = false;
  assert.deepEqual(await submitApplicationWorkflow(options(), api), {
    applicationUUID: "application-123",
    status: "DRAFT",
  });
  assert.deepEqual(calls, ["create", "update", "update"]);
});
