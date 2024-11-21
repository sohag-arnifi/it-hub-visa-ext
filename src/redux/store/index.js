import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { baseApiSlice } from "../features/baseApi/baseApiSlice";
import appReducer from "../features/appApi/appSlice";

export const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApiSlice.middleware)
      .concat(baseApiSlice.middleware),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
