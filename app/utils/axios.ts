import axios, { isAxiosError } from "axios";
import { API_BASE_URL } from "@/config";

// API Response Error
export class ApiResponseError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors: unknown = null,
  ) {
    super(message);
    this.name = "ApiResponseError";
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { Accept: "application/json" },
});

api.interceptors.response.use((response) => {
  if (response.data?.statusCode >= 400) {
    throw new ApiResponseError(
      response.data.description || "The request failed.",
      response.data.statusCode,
      response.data.errors,
    );
  }
  return response;
});

// Check Client Error
export function isClientError(error: unknown): boolean {
  if (error instanceof ApiResponseError)
    return error.statusCode >= 400 && error.statusCode < 500;
  if (isAxiosError(error) && error.response) {
    const status = error.response.status;
    return status >= 400 && status < 500;
  }
  return false;
}
