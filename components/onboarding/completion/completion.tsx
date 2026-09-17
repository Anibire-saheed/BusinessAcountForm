"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { applicationProgress } from "@/lib/schemas/application/progress";
import type { Application } from "@/lib/schemas/application";
import type { BusinessType } from "@/lib/requirements";

export function CompletionSection({ type }: { type: BusinessType }) {
  const { control } = useFormContext<Application>();
  const values = useWatch({ control }) as Application;
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
