"use client";
import { useId } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { REQUIREMENTS, type BusinessType } from "@/lib/requirements";
export function BusinessStructureSection({
  type,
  onSelect,
}: {
  type: BusinessType | null;
  onSelect: (type: BusinessType) => void;
}) {
  const groupId = useId();
  return (
    <section
      className="scroll-mt-[86px] border-t border-border py-[30px]"
      id="step-type"
    >
      <p className="mb-2.5 text-[13px] font-medium text-gold">Step 1</p>
      <h2 className="mb-2.5 text-[27px] font-medium text-primary">
        How is your business structured?
      </h2>
      <p className="mb-[30px] max-w-[56ch] text-[15px] text-muted-foreground">
        This determines exactly which documents and details we’ll ask for below.
        Choose the option that matches your CAC registration.
      </p>
      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <legend className="sr-only">Business structure</legend>
        {(["RC", "BN", "IT"] as const).map((key, i) => {
          const isSelected = type === key;
          return (
            <Card
              key={key}
              className={`relative gap-0 rounded-[14px] transition-colors motion-reduce:transition-none ${
                isSelected
                  ? "border border-primary border-b-[5px] border-b-primary shadow-xs"
                  : "border border-transparent border-b-4 border-b-[rgba(196,196,196,0.24)] hover:border-b-[#c4baa2]"
              }`}
            >
              <input
                type="radio"
                name={groupId}
                value={key}
                checked={isSelected}
                onChange={() => onSelect(key)}
                aria-labelledby={`${groupId}-${key}-title`}
                aria-describedby={`${groupId}-${key}-description ${groupId}-${key}-count`}
                className="absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0"
              />
              <CardContent className="pointer-events-none gap-0">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <span className="text-[26px] leading-tight font-semibold text-primary">
                    {key}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full transition-colors ${
                      isSelected
                        ? "bg-primary text-white"
                        : "border-[1.5px] border-[#c4baa2] bg-white"
                    }`}
                  >
                    {isSelected && (
                      <Check className="size-3.5 text-white" strokeWidth={3} />
                    )}
                  </span>
                </div>
                <div
                  id={`${groupId}-${key}-title`}
                  className="mb-2 text-sm font-medium text-black"
                >
                  {REQUIREMENTS[key].name}
                </div>
                <p
                  id={`${groupId}-${key}-description`}
                  className="mb-2.5 text-[13px] leading-[1.3] text-[#6b6558]"
                >
                  {
                    [
                      "Incorporated with the CAC as a limited liability company.",
                      "Registered as a sole proprietorship or partnership.",
                      "An NGO, association, or other not-for-profit body.",
                    ][i]
                  }
                </p>
                <div
                  id={`${groupId}-${key}-count`}
                  className="text-xs font-medium text-[#ad8536]"
                >
                  {REQUIREMENTS[key].documents.length +
                    REQUIREMENTS[key].people.length +
                    2}{" "}
                  requirements
                </div>
              </CardContent>
            </Card>
          );
        })}
      </fieldset>
    </section>
  );
}
