"use client";
import { useId, useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createApplicationSchema,
  emptyApplication,
  type Application,
} from "@/lib/schemas/application";
import type { BusinessType } from "@/lib/requirements";
import { RequirementsSection } from "../requirements/requirements";
import { ReviewSection } from "../review/review";
export function ApplicationForm({ type }: { type: BusinessType }) {
  const schema = useMemo(() => createApplicationSchema(type), [type]);
  const form = useForm<Application>({
    resolver: zodResolver(schema),
    defaultValues: emptyApplication(type),
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const app = useWatch({ control: form.control }) as Application;
  const [prepared, setPrepared] = useState(false);
  const confirmationId = useId();
  const complete = schema.safeParse(app).success;
  const submit = form.handleSubmit(
    () => {
      setPrepared(true);
      requestAnimationFrame(() =>
        document.getElementById(confirmationId)?.focus(),
      );
    },
    () => setPrepared(false),
  );
  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={submit}
        onChange={() => setPrepared(false)}
        onClickCapture={() => setPrepared(false)}
      >
        <RequirementsSection type={type} />
        <ReviewSection
          type={type}
          complete={complete}
          prepared={prepared}
          confirmationId={confirmationId}
        />
      </form>
    </FormProvider>
  );
}
