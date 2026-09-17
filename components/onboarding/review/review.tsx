"use client";
import { useFormContext, useWatch } from "react-hook-form";
import { CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { applicationChecks, type Application } from "@/lib/schemas/application";
import { reviewStatus } from "@/lib/schemas/application/review-status";
import type { BusinessType } from "@/lib/requirements";
import { sectionClass } from "../shared/styles";
import { downloadSummary } from "./download-summary";
type ReviewProps = {
  type: BusinessType;
  complete: boolean;
  prepared: boolean;
  confirmationId: string;
};
export function ReviewSection({
  type,
  complete,
  prepared,
  confirmationId,
}: ReviewProps) {
  const form = useFormContext<Application>();
  const values = useWatch({ control: form.control }) as Application;
  const checks = applicationChecks(type, values);
  return (
    <section className={sectionClass}>
      <p className="mb-2.5 text-[13px] font-medium text-gold">Step 3</p>
      <h2 className="mb-2.5 text-[27px] font-medium text-primary">
        Review and submit
      </h2>
      <p className="mb-[30px] text-[15px] text-muted-foreground">
        Check that everything below is filled in. This preview prepares your
        application summary; nothing is sent to the bank.
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
      <div className="mt-6 flex flex-wrap gap-3 max-[520px]:[&>button]:w-full">
        <Button
          type="submit"
          size="lg"

          disabled={form.formState.isSubmitting}
        >
          Submit Application
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"

          onClick={() => downloadSummary(type, form.getValues())}
        >
          <Download />
          Download summary (.txt)
        </Button>
      </div>
      {prepared && complete && (
        <Alert
          id={confirmationId}
          tabIndex={-1}
          role="status"
          className="mt-5 bg-success-light"
        >
          <CheckCircle2 />
          <AlertTitle>Application prepared</AlertTitle>
          <AlertDescription>
            Your application is complete and ready to download. It has not been
            submitted. Contact business@ethicamfb.com for the next steps.
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
}
