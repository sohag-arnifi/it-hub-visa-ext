import axios from "axios";
import https from "https-browserify";

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 60 * 60 * 1000, // 30 minutes
  maxSockets: 1000, // Max concurrent sockets
  maxFreeSockets: 10, // Max free sockets
});

// Create an axios instance
const axiosInstance = axios.create({
  httpsAgent, // Use the HTTPS agent with keep-alive
  withCredentials: true,
  maxRedirects: 0, // Disable automatic redirects
});

// Add a response interceptor to handle 302 redirects
axiosInstance.interceptors.response.use(
  (response) => {
    const responseUrl = response.request.responseURL || response.config.url;

    if (responseUrl) {
      return {
        ...response,
        responseUrl,
      };
    } else {
      return response;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
