import { backendBaseApiSlice } from "../backendBaseApi/backendBaseApiSlice";
import { setLoggedInUser } from "./authSlice";

const authApi = backendBaseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoginUser: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success) {
            dispatch(setLoggedInUser(data?.data));
          }
        } catch (err) {
          console.error(err);
        }
      },
    }),
  }),
});

export const { useGetLoginUserQuery } = authApi;
