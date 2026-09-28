"use client";
import type { PeopleSectionProps } from "@/types/onboardingProps.types";
import { isEmptyPerson } from "@/lib/schemas/application/checks";
import { useId } from "react";
import { Controller } from "react-hook-form";
import { usePeopleGroup } from "@/hooks/use-people-group";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  emptyPerson,
  personFields,
  personTitles,
  uploadFields,
} from "@/lib/schemas/application";
import { useAppSelector } from "@/store/hooks";
import { SectionCard } from "@/components/ui/shared/section-card";
import { TextField } from "@/components/ui/shared/text-field";
import { FileField } from "@/components/ui/shared/file-field";
import { gridClass } from "@/components/ui/shared/styles";
export function PeopleSection({ group, type }: PeopleSectionProps) {
  const saved = useAppSelector((state) => {
    const session = state.onboarding.sessions[type];
    const ids =
      group.key === "signatories"
        ? session?.signatoryIds
        : session?.principalIds;
    return (
      !!session?.pendingWrite ||
      Object.keys(ids ?? {}).some((key) => key.startsWith(`${group.key}.`))
    );
  });
  const checkboxId = useId();
  const {
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
  } = usePeopleGroup(group);
  return (
    <SectionCard
      title={group.title}
      description={group.note}
      contentClassName="[&>[data-first-person=true]]:pt-0"
    >
      {group.sameAsAdmin && (
        <Controller
          control={control}
          name="same"
          render={({ field }) => (
            <Field orientation="horizontal" className="mb-3">
              <Checkbox
                id={checkboxId}
                name={field.name}
                ref={field.ref}
                checked={field.value}
                disabled={saved}
                onBlur={field.onBlur}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (formState.isSubmitted) void trigger();
                }}
              />
              <FieldLabel htmlFor={checkboxId}>
                Same as Admin officer
              </FieldLabel>
            </Field>
          )}
        />
      )}
      {isSignatories &&
        linked.map((entry, index) => (
          <div
            key={entry.path}
            data-first-person={index === 0}
            className="space-y-3 rounded-[10px] border-b-4 border-black/10 bg-white p-[18px] min-[521px]:p-[30px]"
          >
            <h4 className="font-medium text-primary">
              Signatory {index + 1} — {entry.label}
            </h4>
            <FieldDescription>
              Linked automatically. Edit details and uploads in the{" "}
              {entry.label.toLowerCase()} section, or turn off its signatory
              toggle to unlink.
            </FieldDescription>
            <dl className={gridClass}>
              {personFields.map(([key, label]) => (
                <div key={key}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="break-all">
                    {entry.person[key] || "Not provided"}
                  </dd>
                </div>
              ))}
              {uploadFields.map(([key, label]) => (
                <div key={key}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="break-all">
                    {entry.person[key]?.name || "Not attached"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      {fields.map((person, index) => {
        if (
          isSignatories &&
          linked.length &&
          index === 0 &&
          isEmptyPerson(app.people.signatories[0])
        )
          return null;
        const shared = group.key === "proprietors" && same && index === 0;
        return (
          <div
            key={person.id}
            data-first-person={
              index === 0 && (!isSignatories || linked.length === 0)
            }
            className="space-y-4 rounded-[10px] border-b-4 border-[rgba(196,196,196,0.24)] bg-white p-[18px] min-[521px]:p-[30px]"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-medium text-primary">
                {personTitles[group.key]}{" "}
                {index + 1 + (isSignatories ? linked.length : 0)}
              </h4>
              {fields.length > group.min && !shared && !saved && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => remove(index)}
                  aria-label={`Remove ${personTitles[group.key]} ${index + 1}`}
                >
                  <Trash2 />
                  Remove
                </Button>
              )}
            </div>
            {canLink && (
              <Controller
                control={control}
                name={`people.${group.key}.${index}.isSignatory`}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id={`${checkboxId}-${person.id}-signatory`}
                      checked={!!field.value}
                      disabled={
                        saved || (!field.value && totalSignatories >= 6)
                      }
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (formState.isSubmitted) void trigger();
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      name={field.name}
                    />
                    <FieldLabel
                      htmlFor={`${checkboxId}-${person.id}-signatory`}
                    >
                      Also a signatory (use these details and documents)
                    </FieldLabel>
                  </Field>
                )}
              />
            )}
            {shared ? (
              <FieldDescription>
                Uses the admin officer’s details and documents, including any
                updates. Complete any missing details in the Admin officer
                section.
              </FieldDescription>
            ) : (
              <>
                <div
                  className={`${gridClass} [&_[data-slot=field]]:gap-2 [&_[data-slot=field-label]]:text-[13px] [&_[data-slot=field-label]]:font-medium [&_[data-slot=field-label]]:text-[#6b6558] [&_[data-slot=input]]:border-[#c4baa2] [&_[data-slot=input]]:shadow-none [&_[data-slot=input][aria-invalid=true]]:border-destructive`}
                >
                  {personFields.map(([key, label]) => (
                    <TextField
                      key={key}
                      name={`people.${group.key}.${index}.${key}`}
                      label={label}
                      full={key === "name"}
                    />
                  ))}
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-4">
                  {uploadFields.map(([key, label]) => (
                    <FileField
                      key={key}
                      name={`people.${group.key}.${index}.${key}`}
                      label={label}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
      {saved && (
        <p className="mt-3 text-sm text-muted-foreground">
          People already saved cannot be removed or relinked here. Contact the
          bank if those relationships need changing.
        </p>
      )}
      {groupError && <FieldError errors={[groupError]} />}
      {(isSignatories
        ? totalSignatories < group.max
        : fields.length < group.max) && (
        <Button
          type="button"
          variant="outline"
          className="border-dashed text-primary"
          onClick={() => append(emptyPerson())}
        >
          <Plus />
          Add another {personTitles[group.key].toLowerCase()}
        </Button>
      )}
    </SectionCard>
  );
}
