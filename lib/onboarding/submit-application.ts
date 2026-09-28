import { applicationsApi } from "@/app/apiService/applicationService";
import { isClientError } from "@/app/utils/axios";
import type { PrincipalInput } from "@/types/businessApplication.types";
import { createApplicationSchema } from "@/lib/schemas/application";
import {
  isEmptyPerson,
  linkedSignatories,
} from "@/lib/schemas/application/checks";
import { REQUIREMENTS } from "@/lib/requirements";
import {
  documentTypes,
  personFiles,
  principalRoles,
  toBusinessDetails,
  toPerson,
  toReferee,
} from "./mappers";
import { emptySession } from "./session";
import type {
  ApplicationSession,
  SubmitOptions,
  SubmissionResult,
} from "@/types/onboardingSubmission.types";

// A 4xx failure is a known/explicit rejection safe to surface for correction;
// anything else (network drop, 5xx) is ambiguous and must not be silently retried.
const isKnownRejection = isClientError;

/** Sequential writes retain confirmed IDs immediately so retries update existing rows. */
export async function submitApplicationWorkflow(
  {
    type,
    values,
    confirmed,
    section,
    session: saved,
    saveSession,
    onStep = () => {},
  }: SubmitOptions,
  api = applicationsApi,
): Promise<SubmissionResult> {
  const finalizing = !section || section === "review";
  const includes = (name: string) => !section || section === name;
  if (finalizing && !confirmed)
    throw new Error(
      "Confirm the accuracy of your information before submitting.",
    );
  if (finalizing) createApplicationSchema(type).parse(values);
  let session = {
    ...(saved ?? emptySession()),
    principalIds: { ...saved?.principalIds },
    signatoryIds: { ...saved?.signatoryIds },
  };
  const save = (patch: Partial<ApplicationSession>) => {
    session = { ...session, ...patch };
    saveSession({
      ...session,
      principalIds: { ...session.principalIds },
      signatoryIds: { ...session.signatoryIds },
    });
  };
  if (session.createUncertain)
    throw new Error("The application creation response was lost.");
  if (session.submitUncertain)
    throw new Error("The submission response was lost.");
  let applicationUUID = session.applicationUUID;
  if (applicationUUID) {
    if (session.submitted)
      throw new Error("This application has already been submitted. ");
  } else {
    if (!includes("details")) throw new Error("Save business details first.");
    onStep("Creating your application…");
    try {
      applicationUUID = await api.create({
        businessType: type,
        ...toBusinessDetails(values),
      });
      save({ applicationUUID });
    } catch (error) {
      // Explicit validation errors are safe to correct; uncertain writes must not be duplicated.
      if (!isKnownRejection(error)) save({ createUncertain: true });
      throw error;
    }
  }
  if (includes("details")) {
    onStep("Saving business details…");
    await api.updateBusinessDetails(applicationUUID, toBusinessDetails(values));
  }
  if (includes("documents")) {
    onStep("Uploading business documents…");
    for (const doc of REQUIREMENTS[type].documents) {
      await api.uploadDocument(
        applicationUUID,
        documentTypes[doc.id],
        values.documents[doc.id]!,
      );
    }
  }

  if (!section || ["admin", "principals", "signatories"].includes(section)) {
    // Also recovers IDs if a principal/signatory POST completed but its response was lost.
    const remotePrincipals = await api.getPrincipals(applicationUUID);
    const remoteSignatories = await api.getSignatories(applicationUUID);
    if (session.pendingWrite) {
      const pending = session.pendingWrite;
      const records =
        pending.kind === "principal"
          ? remotePrincipals
          : remoteSignatories.filter((p) => !p.addedAutomatically);
      const recovered = records.filter((p) => !pending.knownIds.includes(p.id));
      if (recovered.length !== 1)
        throw new Error(
          "An earlier person save could not be verified. Contact support before retrying to avoid duplicate people.",
        );
      const field =
        pending.kind === "principal" ? "principalIds" : "signatoryIds";
      save({
        [field]: { ...session[field], [pending.key]: recovered[0].id },
        pendingWrite: undefined,
      });
    }
    for (const group of REQUIREMENTS[type].people.filter(
      (g) =>
        g.key !== "signatories" &&
        (!section ||
          (section === "admin"
            ? g.key === "admin"
            : section === "principals" && g.key !== "admin")),
    )) {
      for (const [index, person] of values.people[group.key].entries()) {
        onStep(`Saving ${group.title.toLowerCase()} ${index + 1}…`);
        const key = `${group.key}.${index}`;
        const same = group.key === "proprietors" && index === 0 && values.same;
        const details = toPerson(same ? values.people.admin[0] : person);
        const role = principalRoles[group.key];
        const input: PrincipalInput = same
          ? {
              role: "PROPRIETOR",
              sameAsAdminOfficer: true,
              alsoSignatory: !!person.isSignatory,
            }
          : {
              ...details,
              role,
              sameAsAdminOfficer: false,
              alsoSignatory: !!person.isSignatory,
            };
        let id = session.principalIds[key];
        if (id) {
          await api.updatePrincipal(applicationUUID, id, input);
        } else {
          save({
            pendingWrite: {
              kind: "principal",
              key,
              knownIds: remotePrincipals.map((p) => p.id),
            },
          });
          try {
            id = await api.addPrincipal(applicationUUID, input);
          } catch (error) {
            if (isKnownRejection(error)) save({ pendingWrite: undefined });
            throw error;
          }
          remotePrincipals.push({
            ...details,
            id,
            role,
            alsoSignatory: !!person.isSignatory,
            sameAsAdminOfficer: same,
            passportPhotoUploaded: false,
            validIdUploaded: false,
            signatureUploaded: false,
          });
        }
        save({
          principalIds: { ...session.principalIds, [key]: id },
          pendingWrite: undefined,
        });
        if (!same)
          for (const [field, fileType] of personFiles) {
            await api.uploadPrincipalFile(
              applicationUUID,
              id,
              fileType,
              person[field]!,
            );
          }
      }
    }
    if (includes("signatories")) {
      const hasLinked = linkedSignatories(values).length > 0;
      for (const [index, person] of values.people.signatories.entries()) {
        if (index === 0 && hasLinked && isEmptyPerson(person)) continue;
        onStep(`Saving signatory ${index + 1}…`);
        const key = `signatories.${index}`;
        const input = toPerson(person);
        let id = session.signatoryIds[key];
        if (id) {
          await api.updateSignatory(applicationUUID, id, input);
        } else {
          // Refresh after principal saves because those may auto-create signatories.
          const existing = await api.getSignatories(applicationUUID);
          save({
            pendingWrite: {
              kind: "signatory",
              key,
              knownIds: existing.map((p) => p.id),
            },
          });
          try {
            id = await api.addSignatory(applicationUUID, input);
          } catch (error) {
            if (isKnownRejection(error)) save({ pendingWrite: undefined });
            throw error;
          }
        }
        save({
          signatoryIds: { ...session.signatoryIds, [key]: id },
          pendingWrite: undefined,
        });
        for (const [field, fileType] of personFiles)
          await api.uploadSignatoryFile(
            applicationUUID,
            id,
            fileType,
            person[field]!,
          );
      }
    }
  }
  if (includes("referee")) {
    onStep("Saving referee…");
    await api.upsertReferee(applicationUUID, toReferee(values));
  }
  if (!finalizing) return { applicationUUID, status: "DRAFT" };
  onStep("Confirming and submitting your application…");
  await api.confirmAccuracy(applicationUUID, true);
  let description: string | undefined;
  try {
    await api.submit(applicationUUID, (message) => {
      description = message;
    });
  } catch (error) {
    if (!isKnownRejection(error)) save({ submitUncertain: true });
    throw error;
  }
  save({ submitted: true });
  return { applicationUUID, status: "SUBMITTED", description };
}
