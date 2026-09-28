"use client";

import { useEffect, useRef } from "react";
import {
  hashKey,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { apiMessage } from "@/app/apiService/apiResponseHandler";
import { apiErrorMessage } from "@/app/apiService/apiResponseHandler";

import type { HandledQueryOptions } from "@/types/apiHooks.types";
export type { HandledQueryOptions } from "@/types/apiHooks.types";

/** Typed queries with optional notifications after fetching and retries finish. */
export function useHandledQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  successMessage,
  errorMessage,
  showSuccessNotification = false,
  showErrorNotification = true,
  ...options
}: HandledQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const queryClient = useQueryClient();
  const query = useQuery<TQueryFnData, TError, TData, TQueryKey>(options);
  const queryHash = options.queryKeyHashFn
    ? options.queryKeyHashFn(options.queryKey)
    : hashKey(options.queryKey);
  const lastNotification = useRef<string | null>(null);
  const {
    data,
    error,
    status,
    fetchStatus,
    dataUpdatedAt,
    errorUpdatedAt,
    isFetchedAfterMount,
    isPlaceholderData,
  } = query;

  useEffect(() => {
    // Avoid notifications for cached/placeholder data or intermediate retries.
    if (!isFetchedAfterMount || isPlaceholderData || fetchStatus !== "idle")
      return;
    if (status === "pending") return;
    const updatedAt = status === "error" ? errorUpdatedAt : dataUpdatedAt;
    const notificationId = `${queryHash}:${status}:${updatedAt}`;
    if (lastNotification.current === notificationId) return;
    lastNotification.current = notificationId;

    // Stable IDs also coalesce notifications from multiple observers of a query.
    if (status === "error" && showErrorNotification) {
      toast.error(apiErrorMessage(error, errorMessage), {
        id: notificationId,
      });
    } else if (status === "success" && showSuccessNotification) {
      toast.success(
        apiMessage(queryClient.getQueryData(options.queryKey)) ??
          apiMessage(data) ??
          successMessage ??
          "Loaded successfully.",
        {
          id: notificationId,
        },
      );
    }
  }, [
    queryClient,
    options.queryKey,
    data,
    error,
    status,
    fetchStatus,
    dataUpdatedAt,
    errorUpdatedAt,
    isFetchedAfterMount,
    isPlaceholderData,
    queryHash,
    successMessage,
    errorMessage,
    showSuccessNotification,
    showErrorNotification,
  ]);

  return query;
}
