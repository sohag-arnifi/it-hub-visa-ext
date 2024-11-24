import axios from "axios";
import https from "https-browserify";
import axiosRetry from "axios-retry";

// // Create HTTPS agent with keep-alive enabled
const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 60 * 60 * 1000, // 30 minutes
  maxSockets: 1000, // Max concurrent sockets
  maxFreeSockets: 10, // Max free sockets
});

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

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
        httpsAgent, // Use the HTTPS agent with keep-alive
        withCredentials: true, // Ensure credentials are included
        // timeout: 60000,
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
