"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiMessage } from "@/app/apiService/apiResponseHandler";
import { apiErrorMessage } from "@/app/apiService/apiResponseHandler";

import type { HandledMutationOptions } from "@/types/apiHooks.types";
export type { HandledMutationOptions } from "@/types/apiHooks.types";

/** Shared notifications with the full React Query mutation lifecycle preserved. */
export function useHandledMutation<
  TData = unknown,
  TVariables = void,
  TError = Error,
  TContext = unknown,
>({
  successMessage,
  errorMessage,
  showSuccessNotification = true,
  showErrorNotification = true,
  onSuccess,
  onError,
  ...options
}: HandledMutationOptions<TData, TVariables, TError, TContext>) {
  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    onSuccess: async (...args) => {
      if (showSuccessNotification) {
        toast.success(
          apiMessage(args[0]) ?? successMessage ?? "Saved successfully.",
        );
      }
      await onSuccess?.(...args);
    },
    onError: async (...args) => {
      if (showErrorNotification) {
        toast.error(apiErrorMessage(args[0], errorMessage));
      }
      await onError?.(...args);
    },
  });
}
