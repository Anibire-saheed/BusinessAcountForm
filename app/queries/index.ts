"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useHandledQuery } from "@/hooks/useHandledQuery";
import { useHandledMutation } from "@/hooks/useHandledMutation";
import { applicationResponses } from "@/app/apiService/applicationService";

export const applicationKeys = {
  all: ["applications"] as const,
  detail: (applicationUUID: string) =>
    [...applicationKeys.all, applicationUUID] as const,
  principals: (applicationUUID: string) =>
    [...applicationKeys.detail(applicationUUID), "principals"] as const,
  signatories: (applicationUUID: string) =>
    [...applicationKeys.detail(applicationUUID), "signatories"] as const,
};

export function usePrincipals(applicationUUID?: string) {
  return useHandledQuery({
    queryKey: applicationKeys.principals(applicationUUID ?? ""),
    queryFn: ({ signal }) =>
      applicationResponses.getPrincipals(applicationUUID!, signal),
    select: (response) => response.data,
    enabled: Boolean(applicationUUID),
  });
}
export function useSignatories(applicationUUID?: string) {
  return useHandledQuery({
    queryKey: applicationKeys.signatories(applicationUUID ?? ""),
    queryFn: ({ signal }) =>
      applicationResponses.getSignatories(applicationUUID!, signal),
    select: (response) => response.data,
    enabled: Boolean(applicationUUID),
  });
}
// Tuple variables preserve each service's exact parameters without duplicated DTOs.
function useApplicationMutation<TArgs extends unknown[], TResult>(
  operation: (
    ...args: TArgs
  ) => Promise<
    import("@/app/apiService/apiResponseHandler").ApiResult<TResult>
  >,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  return useHandledMutation({
    mutationFn: (args: TArgs) => operation(...args),
    retry: false,
    successMessage,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
  });
}
export function useCreateApplication() {
  return useApplicationMutation(
    applicationResponses.create,
    "Application created.",
  );
}
export function useUpdateBusinessDetails() {
  return useApplicationMutation(
    applicationResponses.updateBusinessDetails,
    "Business details saved.",
  );
}
export function useUploadDocument() {
  return useApplicationMutation(
    applicationResponses.uploadDocument,
    "Document uploaded.",
  );
}
export function useAddPrincipal() {
  return useApplicationMutation(
    applicationResponses.addPrincipal,
    "Person added.",
  );
}
export function useUpdatePrincipal() {
  return useApplicationMutation(
    applicationResponses.updatePrincipal,
    "Person updated.",
  );
}
export function useUploadPrincipalFile() {
  return useApplicationMutation(
    applicationResponses.uploadPrincipalFile,
    "File uploaded.",
  );
}
export function useAddSignatory() {
  return useApplicationMutation(
    applicationResponses.addSignatory,
    "Signatory added.",
  );
}
export function useUpdateSignatory() {
  return useApplicationMutation(
    applicationResponses.updateSignatory,
    "Signatory updated.",
  );
}
export function useUploadSignatoryFile() {
  return useApplicationMutation(
    applicationResponses.uploadSignatoryFile,
    "File uploaded.",
  );
}
export function useUpsertReferee() {
  return useApplicationMutation(
    applicationResponses.upsertReferee,
    "Referee saved.",
  );
}
export function useConfirmAccuracy() {
  return useApplicationMutation(
    applicationResponses.confirmAccuracy,
    "Confirmation saved.",
  );
}
export function useSubmitApplication() {
  return useApplicationMutation(
    applicationResponses.submit,
    "Application submitted.",
  );
}
