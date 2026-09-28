"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { Application } from "@/lib/schemas/application";
import {
  linkedSignatories,
  signatoryEntries,
} from "@/lib/schemas/application/checks";
import type { PeopleGroup } from "@/lib/requirements";
import { useApplicationValues } from "./use-application-values";

/** Dynamic people rows and their derived signatory state; requires FormProvider. */
export function usePeopleGroup(group: PeopleGroup) {
  const { control, formState, trigger } = useFormContext<Application>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `people.${group.key}`,
  });
  const app = useApplicationValues(control);
  const same = app.same;
  const linked = linkedSignatories(app);
  const isSignatories = group.key === "signatories";
  const canLink = ["directors", "proprietors", "trustees"].includes(group.key);
  const totalSignatories = signatoryEntries(app).length;
  const groupError = formState.errors.people?.[group.key]?.root;
  return {
    control,
    formState,
    trigger,
    fields,
    append,
    remove,
    same,
    app,
    linked,
    isSignatories,
    canLink,
    totalSignatories,
    groupError,
  };
}
