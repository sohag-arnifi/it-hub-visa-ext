import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { backendBaseApiSlice } from "../features/backendBaseApi/backendBaseApiSlice";
import { appBaseApiSlice } from "../features/appBaseApi/appBaseApiSlice";
import automationReducer from "../features/automation/automationSlice";
import authReducer from "../features/auth/authSlice";
import applicationReducer from "../features/application/applicationApiSlice";

export const store = configureStore({
  reducer: {
    [backendBaseApiSlice.reducerPath]: backendBaseApiSlice.reducer,
    [appBaseApiSlice.reducerPath]: appBaseApiSlice.reducer,
    applications: applicationReducer,
    automation: automationReducer,
    auth: authReducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(backendBaseApiSlice.middleware)
      .concat(appBaseApiSlice.middleware),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
