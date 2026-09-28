"use client";

import { useWatch, type Control } from "react-hook-form";
import type { Application } from "@/lib/schemas/application";

/** Requires the complete defaults supplied by useApplicationForm. */
export function useApplicationValues(control: Control<Application>) {
  // RHF types whole-form subscriptions as partial even with complete defaults.
  return useWatch({ control }) as Application;
}
