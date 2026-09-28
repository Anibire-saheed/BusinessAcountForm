import type { ApplicationSection } from "./onboardingSubmission.types";
import type { ReactNode } from "react";
import type { FieldPath } from "react-hook-form";
import type { Application } from "@/lib/schemas/application";
import type { BusinessType, PeopleGroup } from "@/lib/requirements";

export type RefereeSectionProps = { type: BusinessType };

export type ApplicationFormProps = { type: BusinessType };

export type CompletionSectionProps = { type: BusinessType };

export type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  contentClassName?: string;
};

export type TextFieldProps = {
  name: FieldPath<Application>;
  label: string;
  full?: boolean;
  placeholder?: string;
};

export type FileFieldProps = {
  name: FieldPath<Application>;
  label: string;
  hint?: string;
  layout?: "stacked" | "row" | "compact";
};

export type RequirementsSectionProps = {
  type: BusinessType;
  locked: boolean;
  review: ReactNode;
  saving: boolean;
  saveSection: (section: ApplicationSection) => Promise<unknown>;
};

export type ReviewProps = {
  type: BusinessType;
  complete: boolean;
  confirmed: boolean;
  onConfirm: (confirmed: boolean) => void;
  submitted: boolean;
  locked: boolean;
  pending: boolean;
  step: string;
  applicationUUID?: string;
  error: Error | null;
  createUncertain: boolean;
  confirmationId: string;
};

export type PeopleSectionProps = {
  group: PeopleGroup;
  type: BusinessType;
};

export type BusinessStructureSectionProps = {
  type: BusinessType | null;
  onSelect: (type: BusinessType) => void;
};

export type DocumentsSectionProps = { type: BusinessType };
