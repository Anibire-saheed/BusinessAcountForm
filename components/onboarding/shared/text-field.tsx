"use client";
import { useId } from "react";
import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Application } from "@/lib/schemas/application";
export function TextField({
  name,
  label,
  full = false,
  placeholder,
}: {
  name: FieldPath<Application>;
  label: string;
  full?: boolean;
  placeholder?: string;
}) {
  const { control } = useFormContext<Application>();
  const id = useId();
  const key = name.split(".").at(-1);
  const numeric = key === "bvn" || key === "nin" || key === "accountNumber";
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          className={full ? "col-span-full" : ""}
          data-invalid={fieldState.invalid}
        >
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            {...field}
            id={id}
            value={typeof field.value === "string" ? field.value : ""}
            type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
            inputMode={numeric ? "numeric" : undefined}
            maxLength={
              numeric ? (key === "accountNumber" ? 10 : 11) : undefined
            }
            placeholder={placeholder}
            className="bg-white"
            aria-invalid={fieldState.invalid}
            aria-describedby={fieldState.error ? `${id}-error` : undefined}
          />
          {fieldState.error && (
            <FieldError id={`${id}-error`} errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}
