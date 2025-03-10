export const fetchBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers = {}, redirect, signal }) => {
    try {
      let fullUrl = baseUrl + url;

      if (params) {
        const queryParams = new URLSearchParams(params).toString();
        fullUrl += `?${queryParams}`;
      }

      const requestOptions = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        redirect,
        credentials: "include",
        signal, // Pass the signal here
      };

      // Add body if the method is not GET or HEAD
      if (method !== "GET" && method !== "HEAD") {
        requestOptions.body = JSON.stringify(data);
      }

      const response = await fetch(fullUrl, requestOptions);

      if (response?.status == 0) {
        return {
          data: {
            isRedirect: true,
          },
        };
      }

      if (!response.ok) {
        const errorData = await response.json();

        return {
          error: {
            status: response.status,
            data: errorData,
          },
        };
      }

      const responseData = await response.text();
      return { data: responseData };
    } catch (error) {
      console.error("Fetch error:", error);
      return {
        error: {
          status: "FETCH_ERROR",
          data: error.message || "Something went wrong!",
        },
      };
    }
  };
