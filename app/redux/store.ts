import { configureStore } from "@reduxjs/toolkit";
import clubProfileReducer from "./features/clubProfile/clubProfileSlice";

export const store = configureStore({
  reducer: {
    clubProfile: clubProfileReducer,
  },
});

// type untuk keseluruhan state redux
export type RootState = ReturnType<typeof store.getState>;

// rtpe untuk dispatch
export type AppDispatch = typeof store.dispatch;
