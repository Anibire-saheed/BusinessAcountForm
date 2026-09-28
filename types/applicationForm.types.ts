import type { z } from "zod";
import type { draftSchema } from "@/lib/schemas/application/draft.schema";
import type { personDraft } from "@/lib/schemas/application/person.schema";
import type { refereeDraft } from "@/lib/schemas/application/referee.schema";
import type { applicationChecks } from "@/lib/schemas/application/checks";

export type Application = z.infer<typeof draftSchema>;
export type Person = z.infer<typeof personDraft>;
export type Referee = z.infer<typeof refereeDraft>;
export type ApplicationCheck = ReturnType<typeof applicationChecks>[number];
