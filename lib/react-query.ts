import { isServer, QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: (failureCount, error) => {
          // Retry transient failures once; client errors need corrected input.
          if (isAxiosError(error) && error.response) {
            const status = error.response.status;
            if (status >= 400 && status < 500) return false;
          }
          return failureCount < 1;
        },
      },
      mutations: { retry: false },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // Server requests must not share cached application data.
  if (isServer) return createQueryClient();
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
