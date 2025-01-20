import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../axios/axiosBaseQuery";
import envConfig from "../../../configs/envConfig";

let headers = {};
if (envConfig.appBaseUrl === "https://payment.ivacbd.com") {
  headers = {
    "x-requested-with": "XMLHttpRequest",
    Accept: "application/x-www-form-urlencoded;charset=UTF-8;",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;",
  };
} else {
  headers = {
    "x-requested-with": "XMLHttpRequest",
    "content-type": "application/json",
  };
}

export const appBaseApiSlice = createApi({
  reducerPath: "appApi",
  baseQuery: axiosBaseQuery({
    baseUrl: envConfig.appBaseUrl,
    withCredentials: true,
  }),
  tagTypes: ["applications"],
  endpoints: (builder) => ({
    manageQueue: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/queue-manage`,
        method: "POST",
        headers,
        signal,
        data: payload,
      }),
    }),

    generateSlotTime: builder.mutation({
      query: (data) => ({
        url: `/get_payment_options_v2`,
        method: "POST",
        headers,
        data,
      }),
    }),

    payInvoice: builder.mutation({
      query: (data) => ({
        url: `/slot_pay_now`,
        method: "POST",
        headers,
        data,
      }),
    }),
  }),
});

export const {
  useManageQueueMutation,
  useGenerateSlotTimeMutation,
  usePayInvoiceMutation,
} = appBaseApiSlice;
