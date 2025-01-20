const handleMultipleApiCall = async (
  apiFn,
  payload,
  setMessage,
  abortSignal
) => {
  let attempt = 0;
  let maxAttempts = 1000;
  let retryDelay = 2000;

  while (attempt < maxAttempts) {
    try {
      if (abortSignal?.aborted) {
        setMessage({
          message: "Request was aborted by the user.",
          type: "error",
        });
        break; // Exit the loop immediately if aborted
      }
      const response = await apiFn(payload, { signal: abortSignal }).unwrap();
      console.log(response);
      if (response?.code === 200) {
        if (payload?.action === "sendOtp" || payload?.action === "verifyOtp") {
          setMessage({
            message: response?.message[0] || "OTP Verified!",
            type: "success",
          });
        }
        return response;
      }
      if (response?.status === "FAIL") {
        setMessage({
          message:
            response?.message ?? response?.errors ?? "Time Slot not found!",
          type: "error",
        });
        return response;
      }

      if (response?.status === "OK") {
        if (response?.data?.url) {
          setMessage({
            message: "Slot booked successfully!",
            type: "success",
          });
          return response;
        }

        setMessage({
          message: response?.slot_times?.length
            ? "Time Slot Generated!"
            : "Time Slot not found!",
          type: response?.slot_times?.length ? "success" : "error",
        });

        return response;
      }

      if (response?.code === 422) {
        setMessage({
          message: response?.message[0],
          type: "error",
        });
        // attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }

      break;
    } catch (error) {
      console.log(error);
      if (error?.status === 429) {
        break;
      }

      const status = error?.status || 500;
      // Handle retryable status codes
      if ([500, 502, 504].includes(status)) {
        setMessage({
          message: `Server error: ${status}. Retrying... Attempt ${attempt}`,
          type: "error",
        });
      } else {
        setMessage({
          message: `Something went wrong! Attempt ${attempt}`,
          type: "error",
        });
      }

      // If max attempts reached, throw an error
      if (attempt >= maxAttempts) {
        setMessage({
          message: `Max attempts reached. Last status: ${status}`,
          type: "error",
        });
        throw new Error(`Max attempts reached. Last status: ${status}`);
      }
      // Wait for a delay before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

export default handleMultipleApiCall;
