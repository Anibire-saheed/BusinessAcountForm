import { z } from "zod";
export const refereeDraft = z.object({
  accountName: z.string(),
  accountNumber: z.string(),
  bank: z.string(),
  email: z.string(),
  phone: z.string(),
});
export type { Referee } from "@/types/applicationForm.types";
