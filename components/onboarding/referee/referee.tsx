import { REQUIREMENTS, type BusinessType } from "@/lib/requirements";
import { refereeFields } from "@/lib/schemas/application";
import { SectionCard } from "../shared/section-card";
import { TextField } from "../shared/text-field";
import { gridClass } from "../shared/styles";
export function RefereeSection({ type }: { type: BusinessType }) {
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
