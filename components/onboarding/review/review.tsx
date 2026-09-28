"use client";
import { useApplicationValues } from "@/hooks/use-application-values";
import { useFormContext } from "react-hook-form";
import { apiErrorMessage } from "@/app/apiService/apiResponseHandler";
import { CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { applicationChecks, type Application } from "@/lib/schemas/application";
import { reviewStatus } from "@/lib/schemas/application/review-status";
import { sectionClass } from "@/components/ui/shared/styles";
import { downloadSummary } from "./download-summary";
import type { ReviewProps } from "@/types/onboardingProps.types";
export function ReviewSection({
  type,
  complete,
  confirmed,
  onConfirm,
  submitted,
  locked,
  pending,
  step,
  applicationUUID,
  error,
  createUncertain,
  confirmationId,
}: ReviewProps) {
  const form = useFormContext<Application>();
  const values = useApplicationValues(form.control);
  const checks = applicationChecks(type, values);
  return (
    <section className={sectionClass}>
      <p className="mb-2.5 text-[13px] font-medium text-gold">Step 3</p>
      <h2 className="mb-2.5 text-[27px] font-medium text-primary">
        Review and submit
      </h2>
      <p className="mb-[30px] text-[15px] text-muted-foreground">
        Review your information and documents, confirm their accuracy, then
        submit your application to the bank.
      </p>
      <ul>
        {checks.map((check, index) => {
          const { status, completed, total } = reviewStatus(check);
          return (
            <li
              key={index}
              className="flex justify-between gap-5 border-b border-border py-3 text-sm"
            >
              <span>{check.label}</span>
              <span
                aria-live="polite"
                aria-atomic="true"
                className={`shrink-0 text-right ${status === "Complete" ? "text-primary" : status === "In progress" ? "text-gold" : "text-destructive"}`}
              >
                {status}
                {status === "In progress" && (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {completed} of {total} complete
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
      {form.formState.isSubmitted && !complete && (
        <Alert variant="destructive" className="mt-5">
          <AlertTitle>Application needs attention</AlertTitle>
          <AlertDescription>
            Complete the highlighted fields and attach all required documents.
            The first invalid field is focused when you submit.
          </AlertDescription>
        </Alert>
      )}
      {applicationUUID && (
        <p className="mt-4 break-all text-sm">
          Application reference: {applicationUUID}
        </p>
      )}
      <label className="mt-6 flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={confirmed}
          disabled={locked}
          onChange={(event) => {
            onConfirm(event.target.checked);
            form.clearErrors("root.confirmation");
          }}
          className="mt-1"
        />
        I confirm that the information and documents provided are accurate.
      </label>
      {form.formState.errors.root?.confirmation && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {form.formState.errors.root.confirmation.message}
        </p>
      )}
      {error && !submitted && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Submission needs attention</AlertTitle>
          <AlertDescription>{apiErrorMessage(error)}</AlertDescription>
        </Alert>
      )}
      {createUncertain && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          We could not verify whether your application was created. Contact
          business@ethicamfb.com before starting another application.
        </p>
      )}
      {pending && (
        <p role="status" className="mt-4 text-sm">
          {step || "Submitting…"} Keep this page open.
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3 max-[520px]:[&>button]:w-full">
        <Button
          type="submit"
          size="lg"

          disabled={locked || form.formState.isSubmitting}
        >
          {pending
            ? "Submitting…"
            : submitted
              ? "Submitted"
              : "Submit Application"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"

          onClick={() =>
            downloadSummary(
              type,
              form.getValues(),
              submitted ? applicationUUID : undefined,
            )
          }
        >
          <Download />
          Download summary (.txt)
        </Button>
      </div>
      {submitted && (
        <Alert
          id={confirmationId}
          tabIndex={-1}
          role="status"
          className="mt-5 bg-success-light"
        >
          <CheckCircle2 />
          <AlertTitle>Application received</AlertTitle>
          <AlertDescription>
            Your application has been sent to the bank. Keep your application
            reference for follow-up.
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
}
