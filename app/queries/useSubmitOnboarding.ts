"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useHandledMutation } from "@/hooks/useHandledMutation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { saveApplicationSession } from "@/store/slice/onboarding/onboarding";
import type { BusinessType } from "@/lib/requirements";
import type {
  ApplicationSection,
  SubmitOnboardingPayload,
  SubmitOptions,
} from "@/types/onboardingSubmission.types";
import { submitApplicationWorkflow } from "@/lib/onboarding/submit-application";
import { applicationKeys } from "./index";

export function useSubmitOnboarding(type: BusinessType) {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.onboarding.sessions[type]);
  // The workflow reads session/pendingWrite IDs to avoid duplicate creates on
  // retry, so it must see the latest saved state even if mutate() fires again
  // before React has re-rendered with the previous mutation's Redux update.
  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);
  const queryClient = useQueryClient();
  const [step, setStep] = useState("");
  const options = (
    values: SubmitOnboardingPayload["values"],
    confirmed: boolean,
  ): SubmitOptions => ({
    type,
    values,
    confirmed,
    session: sessionRef.current,
    saveSession: (next) => {
      sessionRef.current = next;
      dispatch(saveApplicationSession({ type, session: next }));
    },
    onStep: setStep,
  });
  const sectionMutation = useHandledMutation({
    mutationFn: ({
      values,
      section,
    }: {
      values: SubmitOnboardingPayload["values"];
      section: ApplicationSection;
    }) => submitApplicationWorkflow({ ...options(values, false), section }),
    retry: false,
    showSuccessNotification: false,
    onSuccess: (_result, { section }) => {
      const names: Record<ApplicationSection, string> = {
        details: "Details",
        documents: "Documents",
        admin: "Admin Officer",
        referee: "Referee",
        principals:
          type === "RC"
            ? "Director Info"
            : type === "BN"
              ? "Proprietor Info"
              : "Trustee Info",
        signatories: "Signatory Info",
      };
      toast.success(`${names[section]} saved successfully.`);
    },
    onSettled: () => {
      setStep("");
      void queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
  const mutation = useHandledMutation({
    mutationFn: ({ values, confirmed }: SubmitOnboardingPayload) =>
      submitApplicationWorkflow({
        ...options(values, confirmed),
        section: "review",
      }),
    retry: false,
    successMessage: "Application submitted successfully.",
    onSettled: () => {
      // Keep a successful submit successful even if a later background read fails.
      void queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      setStep("");
    },
  });
  return {
    ...mutation,
    step,
    session,
    sectionMutation,
    isPending: mutation.isPending || sectionMutation.isPending,
  };
}
