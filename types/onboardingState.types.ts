import type { BusinessType } from "@/lib/requirements";
import type { ApplicationSession } from "@/types/onboardingSubmission.types";

export interface OnboardingState {
  sessions: Partial<Record<BusinessType, ApplicationSession>>;
  selectedType: BusinessType | null;
  visitedTypes: BusinessType[];
}

export interface SaveApplicationSessionPayload {
  type: BusinessType;
  session: ApplicationSession;
}
export type SelectBusinessTypePayload = BusinessType;
