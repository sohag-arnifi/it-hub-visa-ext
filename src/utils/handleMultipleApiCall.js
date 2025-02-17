import {
  getDateReleaseInfo,
  getLoginInfo,
  getLoginOtpErrorMessage,
  setCSRFToken,
} from "./generateMessage";

const rootUrl = "https://payment.ivacbd.com/";
const regUrl = "https://payment.ivacbd.com/registration";
const authUrl = "https://payment.ivacbd.com/login-auth";
const otpUrl = "https://payment.ivacbd.com/login-otp";
const personalInfoUrl = "https://payment.ivacbd.com/personal-info";
const overviewInfoUrl = "https://payment.ivacbd.com/overview";
const paymentInfoUrl = "https://payment.ivacbd.com/payment";

const modifyUrl = (resUrl) => {
  const url = new URL(resUrl);
  const pathName = url.pathname;
  return `${"https://payment.ivacbd.com"}${pathName}`;
};

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

      const redirectUrl = response?.redirectUrl;
      console.log(response);

      console.log(modifyUrl(redirectUrl));

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
      } else if (action === "create-session") {
        if (redirectUrl === rootUrl) {
          setCSRFToken(response?.htmlContent);
          setMessage({
            message: "Session created successfully!",
            type: "success",
          });
          break;
        }
      } else if (action === "application-info-submit") {
        if (redirectUrl === personalInfoUrl) {
          const token = setCSRFToken(response?.htmlContent);
          setMessage({
            message: "Application submitted successfully!",
            type: "success",
          });
        }
      } else if (action === "personal-info-submit") {
        if (redirectUrl === overviewInfoUrl) {
          const token = setCSRFToken(response?.htmlContent);
          setMessage({
            message: "Personal Info submitted successfully!",
            type: "success",
          });
        }
      } else if (action === "overview-info-submit") {
        if (redirectUrl === paymentInfoUrl) {
          const token = setCSRFToken(response?.htmlContent);
          setMessage({
            message: "Overview Info submitted successfully!",
            type: "success",
          });
        }
      } else if (action === "pay-otp-send") {
        if (response?.htmlContent?.success) {
          setMessage({
            message: "OTP sent successfully!",
            type: "success",
            response: response,
          });
          return true;
        } else {
          setMessage({
            message: response?.htmlContent?.message ?? "Something went wrong!",
            type: "error",
          });
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }
      } else if (action === "pay-otp-verify") {
        if (response?.htmlContent?.success) {
          setMessage({
            message: "OTP verified successfully!",
            type: "success",
          });
          return response?.htmlContent;
        } else {
          setMessage({
            message: response?.htmlContent?.message ?? "Fail to verify OTP!",
            type: "error",
          });
        }
      } else if (action === "get-slot-time") {
        if (response?.htmlContent?.success) {
          setMessage({
            message: "Slot time fetched successfully!",
            type: "success",
          });
          return true;
        } else {
          setMessage({
            message: response?.htmlContent?.message ?? "Fail to get slot time!",
            type: "error",
          });
        }
      } else if (action === "pay-now") {
        if (response?.htmlContent?.success) {
          setMessage({
            message: response?.htmlContent?.message ?? "Slot booking initiated",
            type: "success",
          });
          return response?.htmlContent;
        }
      }
      break;
    } catch (error) {
      console.log(error);
      // break;
      if (error?.status === "FETCH_ERROR") {
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
