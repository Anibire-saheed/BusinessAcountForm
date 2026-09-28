import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  OnboardingState,
  SaveApplicationSessionPayload,
  SelectBusinessTypePayload,
} from "@/types/onboardingState.types";

const initialState: OnboardingState = {
  sessions: {},
  selectedType: null,
  visitedTypes: [],
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    saveApplicationSession(
      state,
      { payload }: PayloadAction<SaveApplicationSessionPayload>,
    ) {
      state.sessions[payload.type] = payload.session;
    },
    selectBusinessType(
      state,
      { payload }: PayloadAction<SelectBusinessTypePayload>,
    ) {
      state.selectedType = payload;
      if (!state.visitedTypes.includes(payload))
        state.visitedTypes.push(payload);
    },
  },
});

export const { selectBusinessType, saveApplicationSession } =
  onboardingSlice.actions;
export default onboardingSlice.reducer;
