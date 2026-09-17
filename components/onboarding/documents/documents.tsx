import { REQUIREMENTS, type BusinessType } from "@/lib/requirements";
import { SectionCard } from "../shared/section-card";
import { FileField } from "../shared/file-field";
export function DocumentsSection({ type }: { type: BusinessType }) {
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
