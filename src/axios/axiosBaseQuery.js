import axios from "axios";

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      // Make the request using axios
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        withCredentials: true, // Ensure credentials are included
        timeout: 60000,
      });

      return { data: result.data }; // Return the result in the expected format
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status || "FETCH_ERROR",
          data: err.response?.data || "Something went wrong!",
        },
      };
    }
  };
