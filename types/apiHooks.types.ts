import type {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export interface NotificationOptions {
  successMessage?: string;
  errorMessage?: string;
  showSuccessNotification?: boolean;
  showErrorNotification?: boolean;
}
export type HandledMutationOptions<
  TData,
  TVariables,
  TError = Error,
  TContext = unknown,
> = UseMutationOptions<TData, TError, TVariables, TContext> &
  NotificationOptions;
export type HandledQueryOptions<
  TQueryFnData,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> &
  NotificationOptions;
