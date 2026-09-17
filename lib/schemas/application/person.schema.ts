import { z } from "zod";
import { optionalFile } from "./file.schema";
export const personDraft = z.object({
  isSignatory: z.boolean().optional(),
  name: z.string(),
  bvn: z.string(),
  nin: z.string(),
  phone: z.string(),
  email: z.string(),
  passport: optionalFile,
  validId: optionalFile,
  signature: optionalFile,
});
export type Person = z.infer<typeof personDraft>;
