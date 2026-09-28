import type { BusinessType } from "@/lib/requirements";
import type { Application } from "@/lib/schemas/application";

export interface ApplicationSession {
  applicationUUID?: string;
  principalIds: Record<string, number>;
  signatoryIds: Record<string, number>;
  submitted: boolean;
  pendingWrite?: {
    kind: "principal" | "signatory";
    key: string;
    knownIds: number[];
  };
  // A lost create response cannot be retried safely without an idempotency API.
  createUncertain?: boolean;
  submitUncertain?: boolean;
}
export interface SubmitOnboardingPayload {
  values: Application;
  confirmed: boolean;
}

export interface SubmitOptions extends SubmitOnboardingPayload {
  section?: ApplicationSection | "review";
  type: BusinessType;
  session?: ApplicationSession;
  saveSession: (session: ApplicationSession) => void;
  onStep?: (step: string) => void;
}

export interface SubmissionResult {
  applicationUUID: string;
  status: "DRAFT" | "SUBMITTED";
  description?: string;
}

export type ApplicationSection =
  "details" | "documents" | "admin" | "referee" | "principals" | "signatories";
