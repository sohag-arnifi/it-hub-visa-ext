import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../axios/axiosBaseQuery";
import envConfig from "../../../configs/envConfig";

// let headers = {};
const headers = new Headers();
if (envConfig.appBaseUrl === "https://payment.ivacbd.com") {
  headers.set("x-requested-with", "XMLHttpRequest");
  headers.set("Accept", "application/x-www-form-urlencoded;charset=UTF-8;");
  headers.set(
    "Content-Type",
    "application/x-www-form-urlencoded;charset=UTF-8;"
  );
  // headers.set("Origin", "https://payment.ivacbd.com");
  // headers.set("Referer", "https://payment.ivacbd.com/");
  // headers = {
  //   "x-requested-with": "XMLHttpRequest",
  //   Accept: "application/x-www-form-urlencoded;charset=UTF-8;",
  //   "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;",
  // };
} else {
  headers.set("x-requested-with", "XMLHttpRequest");
  headers.set("content-type", "application/json");
  // headers = {
  //   "x-requested-with": "XMLHttpRequest",
  //   "content-type": "application/json",
  // };
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
      query: ({ payload, signal }) => ({
        url: `/get_payment_options_v2`,
        method: "POST",
        headers,
        signal,
        data: payload,
      }),
    }),

    payInvoice: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/slot_pay_now`,
        method: "POST",
        headers,
        signal,
        data: payload,
      }),
    }),

    mobileVerify: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/mobile-verify`,
        method: "POST",
        headers,
        signal,
        data: payload,
      }),
    }),
    authVerify: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/login-auth-submit`,
        method: "POST",
        headers,
        signal,
        data: payload,
      }),
    }),

    loginOtpVerify: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/login-otp-submit`,
        method: "POST",
        headers,
        signal,
        data: payload,
      }),
    }),

    createNewSession: builder.mutation({
      query: ({ signal }) => ({
        url: `/`,
        method: "GET",
        headers,
        signal,
      }),
    }),

    applicationInfoSubmit: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/application-info-submit`,
        method: "POST",
        headers,
        signal,
        data: new URLSearchParams(payload),
      }),
    }),

    personalInfoSubmit: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/personal-info-submit`,
        method: "POST",
        headers,
        signal,
        data: new URLSearchParams(payload),
      }),
    }),

    overviewInfoSubmit: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/overview-submit`,
        method: "POST",
        headers,
        signal,
        data: payload,
        // data: new URLSearchParams(payload),
      }),
    }),

    payOtpSend: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/pay-otp-sent`,
        method: "POST",
        headers,
        signal,
        data: payload,
        // data: new URLSearchParams(payload),
      }),
    }),

    payOtpVerify: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/pay-otp-verify`,
        method: "POST",
        headers,
        signal,
        // data: new URLSearchParams(payload),
        data: payload,
      }),
    }),

    payTimeSlot: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/pay-slot-time`,
        method: "POST",
        headers,
        signal,
        // data: new URLSearchParams(payload),
        data: payload,
      }),
    }),

    bookSlot: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/paynow`,
        method: "POST",
        headers,
        signal,
        // data: new URLSearchParams(payload),
        data: payload,
      }),
    }),
  }),
});

export const {
  useManageQueueMutation,
  useGenerateSlotTimeMutation,
  usePayInvoiceMutation,
  useMobileVerifyMutation,
  useAuthVerifyMutation,
  useLoginOtpVerifyMutation,
  useCreateNewSessionMutation,
  useApplicationInfoSubmitMutation,
  usePersonalInfoSubmitMutation,
  useOverviewInfoSubmitMutation,
  usePayOtpSendMutation,
  usePayOtpVerifyMutation,
  usePayTimeSlotMutation,
  useBookSlotMutation,
} = appBaseApiSlice;
