import { baseApiSlice } from "../baseApi/baseApiSlice";

const appApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserSlugData: builder.query({
      query: (userId) => ({
        url: `/v1/service-slug/${userId}`,
        method: "GET",
      }),
      providesTags: ["service-slug"],
    }),

    checkWebSession: builder.mutation({
      query: (webId) => ({
        url: `/payment/check-session/${webId}`,
        method: "GET",
        headers: { "x-requested-with": "XMLHttpRequest" },
      }),
    }),
    checkStepSession: builder.mutation({
      query: (step) => ({
        url: `/payment/check-step/${step}`,
        method: "GET",
        headers: { "x-requested-with": "XMLHttpRequest" },
      }),
    }),

    manageQueue: builder.mutation({
      query: (data) => ({
        url: `/queue-manage`,
        method: "POST",
        headers: {
          Accept: "application/x-www-form-urlencoded;charset=UTF-8;",
          priority: "u=1, i",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;",
          "x-requested-with": "XMLHttpRequest",
        },
        data,
      }),
    }),

    generateSlotTime: builder.mutation({
      query: (data) => ({
        url: `/get_payment_options_v2`,
        method: "POST",
        headers: {
          Accept: "application/x-www-form-urlencoded;charset=UTF-8;",
          priority: "u=1, i",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;",
          "x-requested-with": "XMLHttpRequest",
        },
        data,
      }),
    }),

    payInvoice: builder.mutation({
      query: (data) => ({
        url: `/slot_pay_now`,
        method: "POST",
        headers: {
          Accept: "application/x-www-form-urlencoded;charset=UTF-8;",
          priority: "u=1, i",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;",
          "x-requested-with": "XMLHttpRequest",
          maxRedirects: 0,
        },
        data,
      }),
    }),
  }),
});

export const {
  useGetUserSlugDataQuery,
  useCheckWebSessionMutation,
  useCheckStepSessionMutation,
  useManageQueueMutation,
  useGenerateSlotTimeMutation,
  usePayInvoiceMutation,
} = appApi;
