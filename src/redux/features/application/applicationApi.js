import { backendBaseApiSlice } from "../backendBaseApi/backendBaseApiSlice";
import { setApplications } from "./applicationApiSlice";

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
  }),
});

export const { useGetApplicationsQuery } = applicationApi;
