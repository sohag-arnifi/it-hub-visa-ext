import axios from "axios";
import axiosInstance from "./axiosInstance";

export const GetRequest = async (url, headers, timeout = 60000) => {
  const urlsArray = Array(10).fill(url);
  const controllers = urlsArray.map(() => new AbortController());

  try {
    const result = await Promise.race(
      urlsArray.map(async (url, index) => {
        try {
          const response = await axiosInstance.get(url, {
            headers,
            signal: controllers[index].signal,
            timeout,
          });
          controllers.forEach((controller) => controller.abort());
          return response;
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log(`Request to ${url} was aborted.`);
          } else if (error.code === "ECONNABORTED") {
            console.log(`Request to ${url} timed out.`);
          } else {
            console.error(`Error in request to ${url}: ${error.message}`);
          }

          return error;
        }
      })
    );

    return result;
  } catch (error) {
    throw error;
  }
};
