import { CompletionSection } from "../completion/completion";
import { REQUIREMENTS, type BusinessType } from "@/lib/requirements";
import { DocumentsSection } from "../documents/documents";
import { PeopleSection } from "../people/people";
import { RefereeSection } from "../referee/referee";
import { BusinessAddressSection } from "../business-address/business-address";
import { sectionClass } from "../shared/styles";
export function RequirementsSection({ type }: { type: BusinessType }) {
  const req = REQUIREMENTS[type];
  return (
    <section className={sectionClass} id={`step-form-${type}`}>
      <p className="mb-2.5 text-[13px] font-medium text-gold">Step 2</p>
      <h2 className="mb-2.5 text-[27px] font-medium text-primary">
        Requirements for a {req.name} account
      </h2>
      <p className="mb-[30px] text-[15px] text-muted-foreground">
        {req.subtitle}
      </p>
      <CompletionSection type={type} />
      <DocumentsSection type={type} />
      {req.people.map((group) => (
        <PeopleSection key={group.key} group={group} />
      ))}
      <RefereeSection type={type} />
      <BusinessAddressSection />
    </section>
  );
}
