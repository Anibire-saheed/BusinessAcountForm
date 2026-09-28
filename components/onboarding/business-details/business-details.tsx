import { businessFields } from "@/lib/schemas/application/fields";
import { SectionCard } from "@/components/ui/shared/section-card";
import { TextField } from "@/components/ui/shared/text-field";

export function BusinessDetailsSection() {
  return (
    <SectionCard
      title="Business Details"
      description="Enter your company registration and business details."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {businessFields.map(([name, label]) => (
          <TextField key={name} name={name} label={label} />
        ))}
      </div>
    </SectionCard>
  );
}
