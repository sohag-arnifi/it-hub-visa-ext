import { getLoginInfo, getLoginOtpErrorMessage } from "./generateMessage";

const rootUrl = "https://payment.ivacbd.com/";
const regUrl = "https://payment.ivacbd.com/registration";
const authUrl = "https://payment.ivacbd.com/login-auth";
const otpUrl = "https://payment.ivacbd.com/login-otp";

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
      console.log(response?.htmlContent);

      const redirectUrl = response?.redirectUrl;
      if (action === "mobile-verify") {
        if (redirectUrl === regUrl) {
          setMessage({
            message: "Account not found!",
            type: "error",
          });
          return false;
        } else if (redirectUrl === authUrl) {
          setMessage({
            message: "Mobile verified successfully!",
            type: "success",
          });
          return true;
        }
      } else if (action === "auth-verify") {
        if (redirectUrl === otpUrl) {
          setMessage({
            message: "OTP sent successfully!",
            type: "success",
          });
          return true;
        } else if (redirectUrl === authUrl) {
          setMessage({
            message: "Password did not match!",
            type: "error",
          });
          return false;
        } else {
          setMessage({
            message: "Authentication failed!",
            type: "error",
          });
          return false;
        }
      } else if (action === "otp-verify") {
        if (redirectUrl === otpUrl) {
          const errorMessage = getLoginOtpErrorMessage(response?.htmlContent);
          setMessage({
            message: errorMessage,
            type: "error",
          });
          return false;
        } else {
          const loginInfo = getLoginInfo(response?.htmlContent);
          if (loginInfo?.userImg && loginInfo?.csrfToken) {
            setMessage({
              message: "Login successful!",
              type: "success",
            });

            return loginInfo;
          } else {
            setMessage({
              message: "Authentication failed!",
              type: "error",
            });
            return false;
          }
        }
      }
      // if (response?.code === 200) {
      //   if (payload?.action === "sendOtp" || payload?.action === "verifyOtp") {
      //     setMessage({
      //       message: response?.message[0] || "OTP Verified!",
      //       type: "success",
      //     });
      //   }
      //   return response;
      // }
      // if (response?.status === "FAIL") {
      //   setMessage({
      //     message:
      //       response?.message ?? response?.errors ?? "Time Slot not found!",
      //     type: "error",
      //   });
      //   return response;
      // }

      // if (response?.status === "OK") {
      //   if (response?.url) {
      //     setMessage({
      //       message: "Slot booked successfully!",
      //       type: "success",
      //     });
      //     return response;
      //   }

      //   setMessage({
      //     message: response?.slot_times?.length
      //       ? "Time Slot Generated!"
      //       : "Time Slot not found!",
      //     type: response?.slot_times?.length ? "success" : "error",
      //   });

      //   return response;
      // }

      // if (response?.code === 422) {
      //   setMessage({
      //     message: response?.message[0],
      //     type: "error",
      //   });
      //   if (payload?.action === "sendOtp") {
      //     // attempt++;
      //     await new Promise((resolve) => setTimeout(resolve, retryDelay));
      //     continue;
      //   } else {
      //     break;
      //   }
      // }

      break;
    } catch (error) {
      console.log(error);

      if (error?.status === "FETCH_ERROR") {
        break;
      }
      if (error?.status === 429) {
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
          message: "Too Many Requests(429)- Please change Network",
          type: "error",
        });
        break;
      } else if (error.name === "AbortError") {
        setMessage({
          message: "Request aborted",
          type: "error",
        });
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

export default handleMultipleApiCall;
