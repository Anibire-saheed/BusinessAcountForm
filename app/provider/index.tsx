"use client";
import type { ReactNode } from "react";

import { Toaster } from "sonner";
import { ReduxProviders as ReduxProvider } from "@/store/provider";
import { QueryProvider } from "./UseQuery";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        <Toaster richColors closeButton />
      </QueryProvider>
    </ReduxProvider>
  );
}
