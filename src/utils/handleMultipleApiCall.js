import { setCSRFToken } from "./generateMessage";
import generateRedirectResponse from "./getRedirectResponse";

const handleMultipleApiCall = async (
  apiFn,
  payload,
  setMessage,
  abortSignal,
  action,
  retryDelay = 2000
) => {
  let attempt = 0;
  let maxAttempts = 1000;

  while (attempt < maxAttempts) {
    try {
      const response = await apiFn({ payload, signal: abortSignal }).unwrap();

      if (action === "create-session") {
        setCSRFToken(response);
        setMessage({
          message: "Session created successfully!",
          type: "success",
        });
        return response;
      } else if (action === "pay-otp-send") {
        console.log("response", response);
        if (
          response?.success &&
          response?.message === "Sms send successfully"
        ) {
          setMessage({
            message: "OTP sent successfully!",
            type: "success",
          });
          return true;
        } else {
          const errMessage =
            typeof response?.message === "string"
              ? response?.message
              : response?.message?.error ?? "Fail to send OTP!";
          if (errMessage === "Slot is not available") {
            setMessage({
              message: errMessage,
              type: "error",
            });
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          } else {
            setMessage({
              message: errMessage,
              type: "error",
            });
            return false;
          }
        }
      } else if (action === "pay-otp-verify") {
        if (response?.success) {
          setMessage({
            message: "OTP verified successfully!",
            type: "success",
          });
          return response;
        } else {
          setMessage({
            message:
              typeof response?.message === "string"
                ? response?.message
                : response?.message?.error ?? "Fail to verify OTP!",
            type: "error",
          });
        }
      } else if (action === "get-slot-time") {
        if (response?.success) {
          setMessage({
            message: "Slot time fetched successfully!",
            type: "success",
          });
          return response;
        } else {
          setMessage({
            message:
              typeof response?.message === "string"
                ? response?.message
                : response?.message?.error ?? "Fail to get slot time!",
            type: "error",
          });
        }
      } else if (action === "pay-now") {
        if (response?.success) {
          setMessage({
            message: "Slot booking initiated",
            type: "success",
          });
          return response;
        } else {
          if (response?.message === "Slot is not available.") {
            setMessage({
              message: response?.message,
              type: "error",
            });
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          } else {
            setMessage({
              message:
                typeof response?.message === "string"
                  ? response?.message
                  : response?.message?.error ?? "Fail to book slot!",
              type: "error",
            });
            break;
          }
        }
      }
      break;
    } catch (error) {
      console.log("error", error);

      if (error?.status === 0) {
        const redirectResponse = await generateRedirectResponse();
        return redirectResponse;
      }

      if (error?.status === 419) {
        setMessage({
          message: error?.data?.message ?? "Session Expired(419) - Trying...",
          type: "error",
        });

        return {
          isRedirect: false,
          redirectPath: "/login",
          statusCode: 419,
        };
      }

      if (error?.status === "FETCH_ERROR") {
        break;
      }

      if (error?.status === 404) {
        break;
      }

      const status = error?.status || 500;
      if (status === 502) {
        setMessage({
          message: "Bad Gateway(502) - Trying...",
          type: "error",
        });
      } else if (status === 504) {
        setMessage({
          message: "Timeout(504) - Trying...",
          type: "error",
        });
      } else if (status === 500) {
        setMessage({
          message: "Internal Server Error(500) - Trying...",
          type: "error",
        });
      } else if (status === 419) {
        setMessage({
          message: "Session Expired(419) - Trying...",
          type: "error",
        });
      } else if (status === 400) {
        setMessage({
          message: "Bad Request(400) - Trying...",
          type: "error",
        });
      } else if (error?.status === 429) {
        setMessage({
          message: "Too Many Requests(429)",
          type: "error",
        });
        break;
      } else if (error.name === "AbortError") {
        setMessage({
          message: "Request aborted",
          type: "error",
        });
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

export default handleMultipleApiCall;
