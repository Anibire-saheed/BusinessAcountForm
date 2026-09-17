import { z } from "zod";
export const fileSchema = z
  .custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    "Attach a document.",
  )
  .refine((file) => !file || file.size > 0, "The selected file is empty.")
  .refine(
    (file) => !file || file.size <= 10 * 1024 * 1024,
    "Files must be 10 MB or smaller.",
  )
  .refine(
    (file) =>
      !file ||
      (/\.(pdf|jpe?g|png)$/i.test(file.name) &&
        ["application/pdf", "image/jpeg", "image/png", ""].includes(file.type)),
    "Choose a PDF, JPG or PNG file.",
  );
export const optionalFile = z.custom<File | null>(
  (value) =>
    value === null || (typeof File !== "undefined" && value instanceof File),
);
