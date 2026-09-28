import { isServer, QueryClient } from "@tanstack/react-query";
import { isClientError } from "@/app/utils/axios";

/** Cache query results for one minute, limit query retries, and disable automatic mutation retries. */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: (failureCount, error) => {
          // Retry transient failures once; client errors need corrected input.
          if (isClientError(error)) return false;
          return failureCount < 1;
        },
      },
      mutations: { retry: false },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** Use a fresh cache on the server and reuse one cache in the browser. */
export function getQueryClient() {
  // Server requests must not share cached application data.
  if (isServer) return createQueryClient();
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
