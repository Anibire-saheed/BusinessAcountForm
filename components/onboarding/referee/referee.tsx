import type { RefereeSectionProps } from "@/types/onboardingProps.types";
import { REQUIREMENTS } from "@/lib/requirements";
import { refereeFields } from "@/lib/schemas/application";
import { SectionCard } from "@/components/ui/shared/section-card";
import { TextField } from "@/components/ui/shared/text-field";
import { gridClass } from "@/components/ui/shared/styles";
export function RefereeSection({ type }: RefereeSectionProps) {
  const req = REQUIREMENTS[type];
  return (
    <SectionCard title="Referee" description={req.referee.note}>
      <div className={gridClass}>
        {refereeFields.map(([key, label]) => (
          <TextField
            key={key}
            name={`referee.${key}`}
            label={label}
            full={key === "accountName"}
          />
        ))}
      </div>
    </SectionCard>
  );
}
