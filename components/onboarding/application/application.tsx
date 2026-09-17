"use client";
import { useState } from "react";
import { BusinessStructureSection } from "../business-structure/business-structure";
import { ApplicationForm } from "../application-form/application-form";
import type { BusinessType } from "@/lib/requirements";

export function ApplicationSection() {
  const [type, setType] = useState<BusinessType | null>(null);
  const [visited, setVisited] = useState<BusinessType[]>([]);
  function selectType(next: BusinessType) {
    setType(next);
    setVisited((old) => (old.includes(next) ? old : [...old, next]));
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
