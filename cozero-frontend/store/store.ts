import { configureStore } from "@reduxjs/toolkit";
import projectsSlice from "./projectsSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    projects: projectsSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
