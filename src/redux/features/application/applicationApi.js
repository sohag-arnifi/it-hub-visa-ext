import { backendBaseApiSlice } from "../backendBaseApi/backendBaseApiSlice";
import { setApplications, setHashParams } from "./applicationApiSlice";

const applicationApi = backendBaseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query({
      query: () => ({
        url: `/applications/get-all`,
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

export const { useGetApplicationsQuery, useGetCaptchaTokenMutation } =
  applicationApi;
