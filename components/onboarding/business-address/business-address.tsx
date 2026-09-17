import { SectionCard } from "../shared/section-card";
import { TextField } from "../shared/text-field";
export function BusinessAddressSection() {
  return (
    <SectionCard
      title="Business address"
      description="Registered or principal operating address."
    >
      <TextField
        name="address"
        label="Business address"
        placeholder="12 Adeola Odeku Street, Victoria Island, Lagos"
      />
    </SectionCard>
  );
}
