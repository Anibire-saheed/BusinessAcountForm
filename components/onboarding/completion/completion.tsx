"use client";
import type { CompletionSectionProps } from "@/types/onboardingProps.types";

import { useApplicationValues } from "@/hooks/use-application-values";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { applicationProgress } from "@/lib/schemas/application/progress";
import type { Application } from "@/lib/schemas/application";

export function CompletionSection({ type }: CompletionSectionProps) {
  const { control } = useFormContext<Application>();
  const values = useApplicationValues(control);
  const { percentage } = applicationProgress(type, values);

  return (
    <Card className="mb-8">
      <CardContent className="flex-row items-center justify-between gap-5">
        <div>
          <p className="text-muted-foreground">Completed</p>
          <p
            className="font-sans text-xl text-primary tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {percentage}%
          </p>
        </div>
        <Progress
          value={percentage}
          aria-label="Application completion"
          aria-valuetext={`${percentage}% complete`}
          className="w-[140px] max-w-[45%] shrink-0"
        />
      </CardContent>
    </Card>
  );
}
