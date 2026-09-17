# API services

Add endpoint request functions here, grouped by feature (for example,
`applications.ts`). Import `apiClient` from `@/lib/api` and return `response.data`.
Keep backend request and response types alongside the relevant service.

Pass React Query's `AbortSignal` to Axios for cancellable GET requests. For file
uploads, send `FormData` and allow Axios to set the multipart content type.

No endpoints are implemented yet. The onboarding form remains a local preview
until you connect a service to its submit handler.
