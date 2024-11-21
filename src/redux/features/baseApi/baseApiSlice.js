import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../axios/axiosBaseQuery";
import envConfig from "../../../configs/envConfig";

export const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: `${envConfig.backendBaseUrl}` }),
  tagTypes: ["service-slug"],
  endpoints: () => ({}),
});
