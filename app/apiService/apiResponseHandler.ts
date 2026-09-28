import { isAxiosError } from "axios";
import type { ApiResult } from "@/types/apiResponse.types";
export type { ApiResult } from "@/types/apiResponse.types";
import { z } from "zod";

// Parse API Result
export function parseApiResult<T>(
  value: unknown,
  schema: z.ZodType<T>,
): ApiResult<T> {
  const data = parseApiResponse(value, schema);
  return { data, description: apiMessage(value) };
}

// Validate API Response
export function parseApiResponse<T>(value: unknown, schema: z.ZodType<T>): T {
  if (typeof value === "object" && value !== null && "statusCode" in value) {
    const envelope = z
      .object({
        statusCode: z.number(),
        description: z.string(),
        data: z.unknown(),
        errors: z.unknown().optional(),
      })
      .parse(value);
    return schema.parse(envelope.data);
  }
  return schema.parse(value);
}

// Read Description or Message
function messageFrom(value: unknown): string | undefined {
  if (typeof value !== "object" || value === null) return;
  if (
    "description" in value &&
    typeof value.description === "string" &&
    value.description.trim()
  )
    return value.description;
  if (!("message" in value)) return;
  return typeof value.message === "string" && value.message.trim()
    ? value.message
    : undefined;
}

// Get API Message
export function apiMessage(value: unknown): string | undefined {
  return (
    messageFrom(value) ??
    (typeof value === "object" && value !== null && "data" in value
      ? messageFrom(value.data)
      : undefined)
  );
}

// Get API Error Message
export function apiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  return (
    (isAxiosError(error) ? apiMessage(error.response?.data) : undefined) ??
    messageFrom(error) ??
    fallback
  );
}
