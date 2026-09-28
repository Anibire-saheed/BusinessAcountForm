import type { DocumentsSectionProps } from "@/types/onboardingProps.types";
import { REQUIREMENTS } from "@/lib/requirements";
import { SectionCard } from "@/components/ui/shared/section-card";
import { FileField } from "@/components/ui/shared/file-field";
export function DocumentsSection({ type }: DocumentsSectionProps) {
  const req = REQUIREMENTS[type];
  return (
    <SectionCard
      title="Documents"
      description="Upload clear scans or photos of each document."
    >
      <div>
        {req.documents.map((doc) => (
          <FileField
            key={doc.id}
            name={`documents.${doc.id}`}
            label={doc.name}
            hint={doc.hint}
            layout="row"
          />
        ))}
      </div>
    </SectionCard>
  );
}
