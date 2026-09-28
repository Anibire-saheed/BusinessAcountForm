"use client";

import { useCallback } from "react";
import type { BusinessType } from "@/lib/requirements";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBusinessType } from "@/store/slice/onboarding/onboarding";

export function useBusinessSelection() {
  const dispatch = useAppDispatch();
  const type = useAppSelector((state) => state.onboarding.selectedType);
  const visited = useAppSelector((state) => state.onboarding.visitedTypes);
  const selectType = useCallback(
    (next: BusinessType) => {
      dispatch(selectBusinessType(next));
    },
    [dispatch],
  );
  return { type, visited, selectType };
}
