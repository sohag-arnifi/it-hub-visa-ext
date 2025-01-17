import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import envConfig from "../../../configs/envConfig";

export const backendBaseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: envConfig.backendBaseUrl + "/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["applications"],
  endpoints: () => ({}),
});
