import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

// Each provider gets its own store so application state is not shared across requests.
export const makeStore = () => configureStore({ reducer: rootReducer });
