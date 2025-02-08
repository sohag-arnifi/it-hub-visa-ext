import axiosInstance from "./axiosInstance";

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers, signal }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        signal,
      });

      if (result.responseUrl) {
        return {
          data: {
            htmlContent: result?.data,
            redirectUrl: result.responseUrl,
          },
        };
      }

      return { data: result.data };
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
