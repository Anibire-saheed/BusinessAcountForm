import { z } from "zod";
import { optionalFile } from "./file.schema";
import { personDraft } from "./person.schema";
import { refereeDraft } from "./referee.schema";
export const draftSchema = z.object({
  documents: z.record(z.string(), optionalFile),
  people: z.record(z.string(), z.array(personDraft)),
  referee: refereeDraft,
  address: z.string(),
  same: z.boolean(),
});
export type Application = z.infer<typeof draftSchema>;
