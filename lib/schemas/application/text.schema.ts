import { z } from "zod";
const requiredText = z.string().trim().min(1, "This field is required.");
const digits = (length: number) =>
  z
    .string()
    .regex(new RegExp(`^\\d{${length}}$`), `Enter exactly ${length} digits.`);
export const textSchemas: Record<string, z.ZodType<string>> = {
  companyName: z.string().trim().min(1, "must not be blank"),
  rcNumber: requiredText,
  tin: z.string().regex(/^\d{9,14}$/, "TIN must be 9 to 14 digits."),
  name: requiredText,
  accountName: requiredText,
  bank: requiredText,
  address: requiredText,
  bvn: digits(11),
  nin: digits(11),
  accountNumber: digits(10),
  email: z.email("Enter a valid email address."),
  phone: z
    .string()
    .regex(/^\+?[\d\s()-]+$/, "Enter a valid phone number.")
    .refine((value) => {
      const count = value.replace(/\D/g, "").length;
      return count >= 7 && count <= 15;
    }, "Enter a phone number with 7–15 digits."),
};
