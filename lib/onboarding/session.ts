import type { ApplicationSession } from "@/types/onboardingSubmission.types";
export type { ApplicationSession } from "@/types/onboardingSubmission.types";
/** Start submission tracking with no saved person IDs and no completed submission. */
export const emptySession = (): ApplicationSession => ({
  principalIds: {},
  signatoryIds: {},
  submitted: false,
});
