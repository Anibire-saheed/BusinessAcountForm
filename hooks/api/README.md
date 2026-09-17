# API hooks

Add React Query hooks here, grouped by feature. Import request functions from
`@/lib/api/services` and use `useQuery` for reads or `useMutation` for writes.
The root layout already provides `QueryClientProvider`.

Example pattern once your backend endpoint and types exist:

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getApplication } from "@/lib/api/services/applications";

export function useApplication(id: string) {
  return useQuery({
    queryKey: ["applications", id],
    queryFn: ({ signal }) => getApplication(id, signal),
    enabled: Boolean(id),
  });
}
```

Include request parameters in query keys. After a successful mutation, invalidate
relevant query keys using `useQueryClient().invalidateQueries(...)`.
