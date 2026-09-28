import { z } from "zod";
import { optionalFile } from "./file.schema";
import { personDraft } from "./person.schema";
import { refereeDraft } from "./referee.schema";
export const draftSchema = z.object({
  documents: z.record(z.string(), optionalFile),
  people: z.record(z.string(), z.array(personDraft)),
  referee: refereeDraft,
  companyName: z.string(),
  rcNumber: z.string(),
  tin: z.string(),
  address: z.string(),
  same: z.boolean(),
});
export type { Application } from "@/types/applicationForm.types";
