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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setApplications(data.data));
        } catch (err) {
          console.log(err);
        }
      },
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
      async onQueryStarted({ phone }, { dispatch, queryFulfilled }) {
        dispatch(setHashParams({ hash_params: "solving", phone }));
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setHashParams({
              hash_params: data.data,
              phone,
            })
          );
          setTimeout(() => {
            dispatch(setHashParams({ hash_params: "", phone }));
          }, 120000);
        } catch (err) {
          console.log(err);
        }
      },
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
} = applicationApi;
