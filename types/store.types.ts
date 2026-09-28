import type { makeStore } from "@/store/index";
import type { rootReducer } from "@/store/rootReducer";

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<typeof rootReducer>;
