"use client";

import { apiErrorMessage } from "@/app/apiService/apiResponseHandler";
import type { ApplicationSection } from "@/types/onboardingSubmission.types";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useFormContext, type FieldPath } from "react-hook-form";
import type { Application } from "@/types/applicationForm.types";
import { Button } from "@/components/ui/button";
import type { RequirementsSectionProps } from "@/types/onboardingProps.types";
import { CompletionSection } from "../completion/completion";
import { REQUIREMENTS } from "@/lib/requirements";
import { DocumentsSection } from "../documents/documents";
import { PeopleSection } from "../people/people";
import { RefereeSection } from "../referee/referee";
import { BusinessDetailsSection } from "../business-details/business-details";
import { sectionClass } from "@/components/ui/shared/styles";
export function RequirementsSection({
  type,
  locked,
  review,
  saving,
  saveSection,
}: RequirementsSectionProps) {
  const [saveError, setSaveError] = useState<string>();
  const savingRef = useRef(false);
  const req = REQUIREMENTS[type];
  const { trigger } = useFormContext<Application>();
  const [activeSection, setActiveSection] = useState("details");
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const navigation = navigationRef.current;
    const activeTab = navigation?.querySelector<HTMLButtonElement>(
      '[aria-current="location"]',
    );
    if (!navigation || !activeTab) return;

    const container = navigation.getBoundingClientRect();
    const tab = activeTab.getBoundingClientRect();
    if (tab.left >= container.left && tab.right <= container.right) return;

    // Move only the tab bar, keeping the page's vertical position unchanged.
    navigation.scrollBy({
      left: tab.left - container.left - (container.width - tab.width) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [activeSection]);
  const principalGroup = req.people.find(
    (group) => group.key !== "admin" && group.key !== "signatories",
  );
  const tabs = [
    { key: "details", label: "Details" },
    { key: "documents", label: "Documents" },
    { key: "admin", label: "Admin Officer" },
    {
      key: "principals",
      label:
        type === "RC"
          ? "Director Info"
          : type === "BN"
            ? "Proprietor Info"
            : "Trustee Info",
    },
    { key: "signatories", label: "Signatory Info" },
    { key: "referee", label: "Referee" },
    { key: "review", label: "Review" },
  ];
  const activeIndex = tabs.findIndex((tab) => tab.key === activeSection);
  async function next() {
    if (locked || savingRef.current) return;
    savingRef.current = true;
    setSaveError(undefined);
    try {
      const fields: Record<string, FieldPath<Application>[]> = {
        details: ["companyName", "rcNumber", "address", "tin"],
        admin: ["people.admin"],
        documents: ["documents"],
        referee: ["referee"],
        principals: ["same", `people.${principalGroup?.key}`],
        signatories: ["people.signatories"],
      };
      if (!(await trigger(fields[activeSection], { shouldFocus: true })))
        return;
      await saveSection(activeSection as ApplicationSection);
      setActiveSection(tabs[activeIndex + 1].key);
    } catch (error) {
      setSaveError(apiErrorMessage(error));
    } finally {
      savingRef.current = false;
    }
  }
  const sectionId = (key: string) => `application-${type}-${key}`;
  return (
    <section className={sectionClass} id={`step-form-${type}`}>
      <nav
        ref={navigationRef}
        aria-label="Application sections"
        className="mb-8 flex gap-3 overflow-x-auto pb-2 sm:gap-5"
      >
        {tabs.map(({ key, label }, index) => (
          <button
            key={key}
            type="button"
            disabled={saving || index > activeIndex}
            aria-current={activeSection === key ? "location" : undefined}
            aria-controls={sectionId(key)}
            onClick={() => {
              setSaveError(undefined);
              setActiveSection(key);
            }}
            className={`flex shrink-0 items-center gap-3 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-base ${
              activeSection === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-muted text-foreground hover:bg-secondary"
            }`}
          >
            <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm">
              {index + 1}
            </span>
            {label}
          </button>
        ))}
      </nav>
      <fieldset
        disabled={locked}
        hidden={activeSection === "review"}
        className="min-w-0"
      >
        <p className="mb-2.5 text-[13px] font-medium text-gold">Step 2</p>
        <h2 className="mb-2.5 text-[27px] leading-[1.2] font-medium text-primary">
          Requirements for a {req.name} account
        </h2>
        <p className="mb-[30px] text-[15px] text-muted-foreground">
          {req.subtitle}
        </p>
        <CompletionSection type={type} />
        <div id={sectionId("details")} hidden={activeSection !== "details"}>
          <BusinessDetailsSection />
        </div>
        <div id={sectionId("documents")} hidden={activeSection !== "documents"}>
          <DocumentsSection type={type} />
        </div>
        <div id={sectionId("admin")} hidden={activeSection !== "admin"}>
          {req.people
            .filter((group) => group.key === "admin")
            .map((group) => (
              <PeopleSection key={group.key} group={group} type={type} />
            ))}
        </div>
        <div id={sectionId("referee")} hidden={activeSection !== "referee"}>
          <RefereeSection type={type} />
        </div>
        <div
          id={sectionId("principals")}
          hidden={activeSection !== "principals"}
        >
          {principalGroup && (
            <PeopleSection group={principalGroup} type={type} />
          )}
        </div>
        <div
          id={sectionId("signatories")}
          hidden={activeSection !== "signatories"}
        >
          {req.people
            .filter((group) => group.key === "signatories")
            .map((group) => (
              <PeopleSection key={group.key} group={group} type={type} />
            ))}
        </div>
      </fieldset>
      <div id={sectionId("review")} hidden={activeSection !== "review"}>
        {review}
      </div>
      {saveError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {saveError}
        </p>
      )}
      <div className="mt-6 flex justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={saving || activeIndex === 0}
          onClick={() => setActiveSection(tabs[activeIndex - 1].key)}
        >
          Back
        </Button>
        {activeSection !== "review" && (
          <Button
            type="button"
            disabled={locked || saving}
            aria-busy={saving}
            onClick={() => void next()}
          >
            {saving ? (
              <>
                <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                <span className="sr-only">Saving section</span>
              </>
            ) : activeSection === "referee" ? (
              "Next: Review"
            ) : (
              "Next"
            )}
          </Button>
        )}
      </div>
    </section>
  );
}
