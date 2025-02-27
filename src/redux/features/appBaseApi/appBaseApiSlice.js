import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import envConfig from "../../../configs/envConfig";
// import { fetchBaseQuery } from "../../../axios/fetchBaseQuery";

const isTest =
  envConfig.appBaseUrl !== "https://payment.ivacbd.com" ? true : false;
const headers = new Headers();
if (envConfig.appBaseUrl === "https://payment.ivacbd.com") {
  headers.set("x-requested-with", "XMLHttpRequest");
  headers.set("Accept", "application/x-www-form-urlencoded;charset=UTF-8;");
  headers.set(
    "Content-Type",
    "application/x-www-form-urlencoded;charset=UTF-8;"
  );
} else {
  headers.set("x-requested-with", "XMLHttpRequest");
  headers.set("content-type", "application/json");
}

export const appBaseApiSlice = createApi({
  reducerPath: "appApi",
  // baseQuery: fetchBaseQuery({
  //   baseUrl: envConfig.appBaseUrl, // Pass the base URL here
  // }),
  baseQuery: fetchBaseQuery({
    baseUrl: envConfig.appBaseUrl,
    withCredentials: true,
    credentials: "include",
    // redirect: "manual",
  }),
  // baseQuery: fetchBaseQuery({
  //   baseUrl: envConfig.appBaseUrl,
  //   credentials: "include",
  // }),
  tagTypes: ["applications"],
  endpoints: (builder) => ({
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
        redirect: "manual",
        signal,
        body: !isTest ? new URLSearchParams(payload) : payload,
      }),
    }),

    personalInfoSubmit: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/personal-info-submit`,
        method: "POST",
        headers,
        redirect: "manual",
        signal,
        body: !isTest ? new URLSearchParams(payload) : payload,
      }),
    }),

    overviewInfoSubmit: builder.mutation({
      query: ({ payload, signal }) => ({
        url: `/overview-submit`,
        method: "POST",
        headers,
        redirect: "manual",
        signal,
        body: !isTest ? new URLSearchParams(payload) : payload,
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
