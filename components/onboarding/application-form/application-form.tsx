"use client";
import type { ApplicationFormProps } from "@/types/onboardingProps.types";
import { FormProvider } from "react-hook-form";
import { useApplicationForm } from "@/hooks/use-application-form";
import { RequirementsSection } from "../requirements/requirements";
import { ReviewSection } from "../review/review";
export function ApplicationForm({ type }: ApplicationFormProps) {
  const {
    form,
    complete,
    confirmationId,
    submit,
    confirmed,
    setConfirmed,
    submission,
    submitted,
    locked,
  } = useApplicationForm(type);
  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={submit} aria-busy={submission.isPending}>
        <RequirementsSection
          type={type}
          locked={locked}
          saving={submission.sectionMutation.isPending}
          saveSection={(section) =>
            submission.sectionMutation.mutateAsync({
              section,
              values: form.getValues(),
            })
          }
          review={
            <ReviewSection
              type={type}
              complete={complete}
              confirmationId={confirmationId}
              confirmed={confirmed}
              onConfirm={setConfirmed}
              submitted={submitted}
              locked={locked}
              pending={submission.isPending}
              step={submission.step}
              applicationUUID={submission.session?.applicationUUID}
              error={submission.error}
              createUncertain={!!submission.session?.createUncertain}
            />
          }
        />
      </form>
    </FormProvider>
  );
}
