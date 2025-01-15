const handleMultipleApiCall = async (apiFn, payload, setMessage) => {
  let attempt = 0;
  const maxAttempts = 5;
  const retryDelay = 500;

  while (attempt < maxAttempts) {
    try {
      const response = await apiFn(payload).unwrap();
      console.log(response);
      if (response?.code === 200) {
        if (payload?.action === "sendOtp" || payload?.action === "verifyOtp") {
          if (response?.message[0]) {
            setMessage({
              message: response?.message[0],
              type: "success",
            });
          } else {
            setMessage({
              message: "OTP Verified!",
              type: "success",
            });
          }
        }
        return response;
      } else if (response.status === "FAIL") {
        setMessage({
          message: response?.message ?? "Time Slot not found!",
          type: "error",
        });
        return response;
      } else if (response.status === "OK") {
        if (response?.data?.url) {
          setMessage({
            message: "Slot booked successfully!",
            type: "success",
          });
          return response;
        }
        if (response?.slot_times?.length) {
          setMessage({
            message: "Time Slot Generated!",
            type: "success",
          });
        } else {
          setMessage({
            message: "Time Slot not found!",
            type: "error",
          });
        }
        return response;
      } else if (response.code === 422) {
        setMessage({
          message: response?.message[0],
          type: "error",
        });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        attempt++;
        continue;
      }
      break;
    } catch (error) {
      if (signal?.aborted) {
        setMessage({ message: "Request aborted!", type: "error" });
        break;
      }
      attempt++;
      const status = error?.status || 504;

      if (status === 502) {
        setMessage({
          message: `Request failed! Attempt-${attempt}`,
          type: "error",
        });
      } else if (status === 504) {
        setMessage({
          message: `Request timeout! Attempt-${attempt}`,
          type: "error",
        });
      } else {
        setMessage({
          message: `Something went wrong! Attempt-${attempt}`,
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

      // Wait for a short delay before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

export default handleMultipleApiCall;
