"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BusinessType } from "@/lib/requirements";
import {
  createApplicationSchema,
  emptyApplication,
  type Application,
} from "@/lib/schemas/application";
import { useApplicationValues } from "./use-application-values";
import { useSubmitOnboarding } from "@/app/queries/useSubmitOnboarding";

export function useApplicationForm(type: BusinessType) {
  const schema = useMemo(() => createApplicationSchema(type), [type]);
  const form = useForm<Application>({
    resolver: zodResolver(schema),
    defaultValues: emptyApplication(type),
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const values = useApplicationValues(form.control);
  const submission = useSubmitOnboarding(type);
  const [confirmed, setConfirmed] = useState(false);
  const confirmationId = useId();
  const complete = schema.safeParse(values).success;
  const submitted = !!submission.session?.submitted;
  const locked =
    submission.isPending ||
    submitted ||
    !!submission.session?.createUncertain ||
    !!submission.session?.submitUncertain;
  const { subscribe } = form;
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: () => setConfirmed(false),
      }),
    [subscribe],
  );
  useEffect(() => {
    if (submitted) document.getElementById(confirmationId)?.focus();
  }, [submitted, confirmationId]);
  const submit = form.handleSubmit(async (draft) => {
    if (locked) return;
    if (!confirmed) {
      form.setError("root.confirmation", {
        message:
          "Confirm that the information and documents provided are accurate.",
      });
      return;
    }
    form.clearErrors("root");
    try {
      await submission.mutateAsync({ values: draft, confirmed });
    } catch {
      /* useHandledMutation shows the error; render it beside the submit button too. */
    }
  });
  return {
    form,
    complete,
    confirmationId,
    submit,
    confirmed,
    setConfirmed,
    submission,
    submitted,
    locked,
  };
}
