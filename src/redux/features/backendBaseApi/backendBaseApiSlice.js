import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import envConfig from "../../../configs/envConfig";

export const backendBaseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: envConfig.backendBaseUrl + "/api/v1",
    credentials: "include",
  }),
  tagTypes: ["applications"],
  endpoints: () => ({}),
});
