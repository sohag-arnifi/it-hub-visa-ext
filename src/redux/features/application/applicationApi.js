import { socket } from "../../../Main";
import { backendBaseApiSlice } from "../backendBaseApi/backendBaseApiSlice";
import { setApplications, setHashParams } from "./applicationApiSlice";

const applicationApi = backendBaseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query({
      query: () => ({
        url: `/applications/get-process`,
        method: "GET",
        headers: { "content-type": "application/json" },
      }),
      providesTags: ["applications"],
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setApplications(
              data.data?.map((item) => {
                return {
                  ...item,
                  hash_params: {
                    token: "",
                    message: "Captcha not found.",
                  },
                };
              })
            )
          );

          socket.on("get-dates", (slotDatesData) => {
            const { center, ivac, visa_type, slot_dates } = slotDatesData;
            const updatedApplications = getState()?.applications?.map(
              (item) => {
                if (
                  item?.info[0]?.center?.id === center &&
                  item?.info[0]?.ivac?.id === ivac &&
                  item?.info[0]?.visa_type?.id === visa_type
                ) {
                  return {
                    ...item,
                    slot_dates,
                  };
                } else {
                  return item;
                }
              }
            );
            dispatch(setApplications(updatedApplications));
          });

          socket.on("get-times", (slotTimesData) => {
            const { center, ivac, visa_type, slot_times } = slotTimesData;
            const updatedApplications = getState()?.applications?.map(
              (item) => {
                if (
                  item?.info[0]?.center?.id === center &&
                  item?.info[0]?.ivac?.id === ivac &&
                  item?.info[0]?.visa_type?.id === visa_type
                ) {
                  return {
                    ...item,
                    slot_times,
                  };
                } else {
                  return item;
                }
              }
            );
            dispatch(setApplications(updatedApplications));
          });
        } catch (err) {
          console.log(err);
        }
      },
    }),

    getCompletedApplications: builder.query({
      query: () => ({
        url: `/applications/get-all-complete`,
        method: "GET",
        headers: { "content-type": "application/json" },
      }),
      providesTags: ["applications"],
    }),

    createNewApplication: builder.mutation({
      query: (data) => ({
        url: `/applications`,
        method: "POST",
        headers: { "content-type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["applications"],
    }),

    getAllApplications: builder.query({
      query: () => ({
        url: `/applications`,
        method: "GET",
        headers: { "content-type": "application/json" },
      }),
      providesTags: ["applications"],
    }),
    deleteApplication: builder.mutation({
      query: (data) => ({
        url: `/applications/${data?._id}`,
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["applications"],
    }),

    updateApplication: builder.mutation({
      query: (data) => ({
        url: `/applications/${data?._id}`,
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["applications"],
    }),
    getCaptchaToken: builder.mutation({
      query: ({ phone }) => ({
        url: `/recaptcha-token`,
        method: "GET",
        headers: { "content-type": "application/json" },
      }),
      // async onQueryStarted({ phone, userId }, { dispatch, queryFulfilled }) {
      //   dispatch(
      //     setHashParams({
      //       hash_params: { token: "", message: "Solving.." },
      //       phone,
      //     })
      //   );
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(
      //       setHashParams({
      //         hash_params: { token: data?.data, message: "Solved" },
      //         phone,
      //       })
      //     );
      //   } catch (err) {
      //     console.log(err);
      //   }
      // },
    }),

    updatePaymentStatus: builder.mutation({
      query: ({ phone, data }) => ({
        url: `/applications/payment-status/${phone}`,
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: data,
      }),
    }),

    getProcessApplication: builder.query({
      query: ({ id }) => ({
        url: `/applications/get-process/${id}`,
        method: "GET",
        headers: { "content-type": "application/json" },
      }),
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useGetCaptchaTokenMutation,
  useCreateNewApplicationMutation,
  useGetAllApplicationsQuery,
  useDeleteApplicationMutation,
  useUpdateApplicationMutation,
  useUpdatePaymentStatusMutation,
  useGetProcessApplicationQuery,
  useGetCompletedApplicationsQuery,
} = applicationApi;
