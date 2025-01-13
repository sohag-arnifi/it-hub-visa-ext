import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import applicationReducer from "../features/application/applicationApiSlice";
import { backendBaseApiSlice } from "../features/backendBaseApi/backendBaseApiSlice";
import { appBaseApiSlice } from "../features/appBaseApi/appBaseApiSlice";
// import { dateApiSlice } from "../features/dateApi/dateApiSlice";

export const store = configureStore({
  reducer: {
    [backendBaseApiSlice.reducerPath]: backendBaseApiSlice.reducer,
    [appBaseApiSlice.reducerPath]: appBaseApiSlice.reducer,
    applications: applicationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(backendBaseApiSlice.middleware)
      .concat(appBaseApiSlice.middleware),
  // .concat(dateApiSlice.middleware),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
