"use client";
import { useId } from "react";
import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { fileSchema, type Application } from "@/lib/schemas/application";
export function FileField({
  name,
  label,
  hint,
  layout = "stacked",
}: {
  name: FieldPath<Application>;
  label: string;
  hint?: string;
  layout?: "stacked" | "row" | "compact";
}) {
  const { control, setError, clearErrors } = useFormContext<Application>();
  const id = useId();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const file = field.value instanceof File ? field.value : null;
        const input = (
          <Input
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            id={id}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className={
              layout !== "stacked"
                ? "absolute inset-0 z-10 size-full cursor-pointer opacity-0"
                : "bg-white px-3 py-2"
            }
            aria-invalid={fieldState.invalid}
            aria-describedby={
              [hint && `${id}-hint`, fieldState.error && `${id}-error`]
                .filter(Boolean)
                .join(" ") || undefined
            }
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (!selected) return;
              const result = fileSchema.safeParse(selected);
              if (!result.success) {
                field.onChange(null);
                event.target.value = "";
                setError(name, {
                  type: "validate",
                  message: result.error.issues[0].message,
                });
                return;
              }
              clearErrors(name);
              field.onChange(selected);
            }}
          />
        );
        if (layout === "compact") {
          return (
            <Field
              data-invalid={fieldState.invalid}
              className="w-auto max-w-full gap-2"
            >
              <div
                className={`relative inline-flex h-[60px] items-center justify-center overflow-hidden rounded-[5px] border bg-white px-3 text-[13px] text-primary focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary hover:border-primary ${fieldState.invalid ? "border-destructive" : "border-[#c4baa2]"}`}
              >
                <FieldLabel
                  htmlFor={id}
                  className="text-[13px] font-normal text-primary"
                >
                  {file && <span aria-hidden="true">✓</span>}
                  {label}
                </FieldLabel>
                {input}
              </div>
              {file && (
                <p
                  className="max-w-[180px] truncate text-xs text-primary"
                  title={file.name}
                  aria-live="polite"
                >
                  {file.name}
                </p>
              )}
              {fieldState.error && (
                <FieldError
                  id={`${id}-error`}
                  className="max-w-[200px]"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          );
        }
        if (layout === "row") {
          return (
            <Field
              data-invalid={fieldState.invalid}
              className="gap-2 border-t border-[#dcd5c4] py-3.5"
            >
              <div className="flex flex-col gap-4 min-[641px]:flex-row min-[641px]:items-center min-[641px]:justify-between">
                <div className="min-w-0 flex-1">
                  <FieldLabel
                    htmlFor={id}
                    className="text-sm font-medium text-foreground"
                  >
                    {label}
                  </FieldLabel>
                  {hint && (
                    <FieldDescription
                      id={`${id}-hint`}
                      className="mt-1 text-[13px] text-[#6b6558]"
                    >
                      {hint}
                    </FieldDescription>
                  )}
                </div>
                <div className="flex shrink-0 items-center justify-between gap-2.5 min-[641px]:justify-end">
                  <span
                    className={`max-w-[120px] truncate text-[13px] ${file ? "text-primary" : "text-[#6b6558]"}`}
                    title={file?.name}
                    aria-live="polite"
                  >
                    {file ? file.name : "Not attached"}
                  </span>
                  <div className="relative inline-flex h-[60px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] border border-[#c4baa2] bg-white px-3.5 text-[13px] font-medium text-primary focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary hover:border-primary">
                    <span aria-hidden="true">Choose file</span>
                    {input}
                  </div>
                </div>
              </div>
              {fieldState.error && (
                <FieldError id={`${id}-error`} errors={[fieldState.error]} />
              )}
            </Field>
          );
        }
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {hint && (
              <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>
            )}
            {input}
            {file && (
              <p className="break-all text-xs text-primary">
                Selected: {file.name}
              </p>
            )}
            {fieldState.error && (
              <FieldError id={`${id}-error`} errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
}
