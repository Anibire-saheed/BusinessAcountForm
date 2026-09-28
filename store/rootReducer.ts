import { combineReducers } from "@reduxjs/toolkit";
import onboarding from "./slice/onboarding/onboarding";

export const rootReducer = combineReducers({ onboarding });

export default rootReducer;
