"use client";
import { useBusinessSelection } from "@/hooks/use-onboarding";
import { BusinessStructureSection } from "../business-structure/business-structure";
import { ApplicationForm } from "../application-form/application-form";
import type { BusinessType } from "@/lib/requirements";

export function ApplicationSection() {
  const { type, visited, selectType: selectBusiness } = useBusinessSelection();
  function selectType(next: BusinessType) {
    selectBusiness(next);
    setTimeout(
      () => document.getElementById(`step-form-${next}`)?.scrollIntoView(),
      50,
    );
  }
  return (
    <>
      <BusinessStructureSection type={type} onSelect={selectType} />
      {visited.map((key) => (
        <div key={key} hidden={key !== type}>
          <ApplicationForm type={key} />
        </div>
      ))}
    </>
  );
}
