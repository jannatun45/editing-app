import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// type untuk keseluruhan state
export const useAppSelector = useSelector.withTypes<RootState>();

// type untuk dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
