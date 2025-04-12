import {
  alpha,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  useBookSlotMutation,
  usePayOtpSendMutation,
  usePayOtpVerifyMutation,
  usePayTimeSlotMutation,
} from "../../../redux/features/appBaseApi/appBaseApiSlice";
import {
  getBookSlotPayload,
  getPayOtpSendPayload,
  getPayOtpVerifyPayload,
  getTimeSlotPayload,
} from "../../../utils/appPayload";
import handleMultipleApiCall from "../../../utils/handleMultipleApiCall";
import {
  useGetCaptchaTokenByAntiMutation,
  useGetCaptchaTokenMutation,
  useUpdatePaymentStatusMutation,
} from "../../../redux/features/application/applicationApi";
import { socket } from "../../../Main";
import envConfig from "../../../configs/envConfig";

const PayOtp = ({ data, otpSendRef }) => {
  const payOtpVerifyButtonRef = useRef();

  const [payOtpSend, { isLoading: otpSendLoading }] = usePayOtpSendMutation();

  const [payOtpVerify, { isLoading: otpVerifyLoading }] =
    usePayOtpVerifyMutation();

  const [payTimeSlot, { isLoading: timeSlotLoading }] =
    usePayTimeSlotMutation();

  const [payNow, { isLoading: payNowLoading }] = useBookSlotMutation();

  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  const [getCaptchaToken, { isLoading: captchaLoading }] =
    useGetCaptchaTokenMutation();

  const [getCaptchaTokenByAnti, { isLoading: captchaLoadingByAnti }] =
    useGetCaptchaTokenByAntiMutation();

  const [resent, setResent] = React.useState(0);
  const [otp, setOtp] = useState("");
  const [paymentUrl, setPaymentUrl] = useState(() => {
    return data?.paymentStatus?.url;
  });

  const [resMessage, setResMessage] = React.useState({
    message: "",
    type: "",
  });

  const [timeSlot, setTimeSlot] = useState({});
  const [specificDate, setSpecificDate] = useState("");

  const [hashParam, setHashParam] = React.useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [captchaMessage, setCaptchaMessage] = useState({
    type: "",
    message: "",
  });

  const [otpRemainTime, setOtpRemainTime] = useState(-1);
  const [otpSendMessage, setOtpSendMessage] = useState({
    type: "",
    message: "",
  });

  const [paynowSectionCreated, setPayNowSectionCreated] = useState(false);

  const sessionAbortControllerRef = useRef(null);

  const handlePayOtpSend = async () => {
    const payload = getPayOtpSendPayload(resent);
    const controller = new AbortController();
    sessionAbortControllerRef.current = controller;
    try {
      const result = await handleMultipleApiCall(
        payOtpSend,
        payload,
        setResMessage,
        controller.signal,
        "pay-otp-send"
      );

      if (result === true) {
        setOtpRemainTime(5 * 60);
        setResent(resent + 1);
        if (envConfig.isTesting) {
          socket.emit("otp-send", {
            phone: data?.phone,
            isTesting: envConfig.isTesting,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const payload = getPayOtpVerifyPayload(otp);
    const controller = new AbortController();
    sessionAbortControllerRef.current = controller;
    try {
      const result = await handleMultipleApiCall(
        payOtpVerify,
        payload,
        setResMessage,
        controller.signal,
        "pay-otp-verify"
      );

      if (result?.success) {
        setOtpRemainTime(-1);
        setOtpSendMessage({
          type: "",
          message: "",
        });

        const date = result?.data?.slot_dates[0];
        if (date) {
          setSpecificDate(date);
        } else {
          setSpecificDate(data?.slot_dates[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSlotTime = async () => {
    const payload = getTimeSlotPayload(
      specificDate ? specificDate : data?.slot_dates[0]
    );
    const controller = new AbortController();
    sessionAbortControllerRef.current = controller;
    try {
      const result = await handleMultipleApiCall(
        payTimeSlot,
        payload,
        setResMessage,
        controller.signal,
        "get-slot-time"
      );

      if (result?.success) {
        const timeData = result?.data?.slot_times?.length
          ? result?.data?.slot_times[0]
          : {};

        if (timeData?.hour) {
          setTimeSlot(timeData);
        } else {
          setTimeSlot({});
        }
        setPayNowSectionCreated(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookSlot = async () => {
    const payload = getBookSlotPayload(data);
    const controller = new AbortController();
    sessionAbortControllerRef.current = controller;
    try {
      const result = await handleMultipleApiCall(
        payNow,
        {
          ...payload,
          hash_param: hashParam,
          appointment_date: specificDate ? specificDate : data?.slot_dates[0],
          appointment_time: timeSlot?.hour ? timeSlot?.hour : 10,
        },
        setResMessage,
        controller.signal,
        "pay-now"
      );
      if (result?.url) {
        const payURL = `${result?.url}${data?.selected_payment?.slug}`;
        setPaymentUrl(payURL);
        if (!envConfig?.isTesting) {
          await updatePaymentStatus({
            id: data?._id,
            data: {
              paymentStatus: {
                status: "SUCCESS",
                url: payURL,
              },
              paymentDate: new Date().toISOString(),
            },
          });
        }
        window.open(payURL, "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCaptchaSolvedAnti = async () => {
    try {
      const response = await getCaptchaTokenByAnti({}).unwrap();
      if (response?.data) {
        if (payNowLoading && hashParam) {
          setHashParam("");
          for (let i = 0; i < 5; i++) {
            sessionAbortControllerRef.current?.abort();
            sessionAbortControllerRef.current = null;
          }
        }
        setHashParam(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCaptchaSolved = async () => {
    try {
      const response = await getCaptchaToken({}).unwrap();
      if (response?.data) {
        if (payNowLoading && hashParam) {
          setHashParam("");
          for (let i = 0; i < 5; i++) {
            sessionAbortControllerRef.current?.abort();
            sessionAbortControllerRef.current = null;
          }
        }
        setHashParam(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenCaptchaContainer = async () => {
    console.log("handleOpenCaptchaContainer", "click");
    socket.emit("captcha-neded", { _id: data?._id });
  };

  const allApiCallForceStop = () => {
    sessionAbortControllerRef.current?.abort();
    sessionAbortControllerRef.current = null;
    console.log("API call aborted");
  };

  useEffect(() => {
    if (otpRemainTime > 0) {
      let countdownInterval;
      countdownInterval = setInterval(() => {
        setOtpRemainTime((prevTime) => {
          const newTime = prevTime - 1;
          setOtpRemainTime(newTime);
          if (newTime <= 0) {
            clearInterval(countdownInterval);
            setOtpSendMessage({
              type: "error",
              message: "OTP has expired! Please resend OTP.",
            });
          } else if (newTime <= 120 && newTime > 0) {
            setOtpSendMessage({
              type: "warning",
              message: `OTP Expires Soon - ${Math.floor(newTime / 60)}:${
                newTime % 60 < 10 ? `0${newTime % 60}` : newTime % 60
              } mins`,
            });
          } else {
            setOtpSendMessage({
              type: "success",
              message: `OTP Expires in ${Math.floor(newTime / 60)}:${
                newTime % 60 < 10 ? `0${newTime % 60}` : newTime % 60
              } mins`,
            });
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [otpRemainTime]);

  useEffect(() => {
    let warningTimeout, countdownInterval;

    if (hashParam) {
      setRemainingTime(120);

      // Set initial message
      setCaptchaMessage({
        type: "success",
        message: `Captcha Token Found - Expires in 2:00 mins`,
      });

      warningTimeout = setTimeout(() => {
        console.log("warningTimeout");
        console.log("call captcha token here");

        setCaptchaMessage({
          type: "warning",
          message: `Captcha Token Expires Soon - 0:30 mins`,
        });
      }, 90000); // 90 seconds

      // Set up countdown interval
      countdownInterval = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(countdownInterval);
            setCaptchaMessage({
              type: "error",
              message: "Captcha Token Expired",
            });
          } else if (newTime <= 30 && newTime > 0) {
            setCaptchaMessage({
              type: "warning",
              message: `Captcha Token Expires Soon - ${Math.floor(
                newTime / 60
              )}:${newTime % 60 < 10 ? `0${newTime % 60}` : newTime % 60} mins`,
            });
          } else {
            setCaptchaMessage({
              type: "success",
              message: `Captcha Token Found - Expires in ${Math.floor(
                newTime / 60
              )}:${newTime % 60 < 10 ? `0${newTime % 60}` : newTime % 60} mins`,
            });
          }
          return newTime;
        });
      }, 1000);
    } else {
      setCaptchaMessage({ type: "error", message: "Captcha Token Not Found" });
      setRemainingTime(0); // Reset remaining time
    }

    return () => {
      clearTimeout(warningTimeout);
      clearInterval(countdownInterval);
    };
  }, [hashParam]);

  useEffect(() => {
    const fetchData = async () => {
      if (paynowSectionCreated && hashParam) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await handleBookSlot();
      }
    };

    fetchData();
  }, [paynowSectionCreated, hashParam]);

  useEffect(() => {
    socket.on("captcha-received", (cData) => {
      if (data?._id === cData?._id) {
        setHashParam(cData?.token);
      }
    });

    return () => {
      socket.off("captcha-received");
    };
  }, []);

  useEffect(() => {
    const handlePayOtpVefiry = ({ otp, phone }) => {
      if (otp?.length === 6 && data?.phone === phone) {
        setOtp(otp); // Set the OTP state
        setTimeout(async () => {
          payOtpVerifyButtonRef.current.click();
        }, 1500);
      }
    };

    // Listen for the "login-send-otp" event
    socket.on("pay-send-otp", handlePayOtpVefiry);
    // Cleanup function to remove the event listener
    return () => {
      socket.off("pay-send-otp", handlePayOtpVefiry);
    };
  }, [data?.phone]);

  useEffect(() => {
    if (specificDate && !timeSlot?.hour && !paynowSectionCreated) {
      handleCaptchaSolved();
      handleCaptchaSolvedAnti();
      setTimeout(() => {
        handleGetSlotTime();
      }, 500);
    }
  }, [specificDate]);

  return (
    <Box
      sx={{
        bgcolor: "#FBF6E9",
        padding: "10px",
        borderRadius: "3px",
      }}
    >
      <Stack direction={"row"} spacing={1}>
        <Button
          ref={otpSendRef}
          onClick={handlePayOtpSend}
          // disabled={otpSendLoading}
          color="error"
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "100%",
          }}
        >
          {otpSendLoading ? "Sending..." : "Send OTP"}
        </Button>
        <Button
          onClick={allApiCallForceStop}
          color="error"
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "100%",
          }}
        >
          Force Stop All Process
        </Button>
      </Stack>

      <Box sx={{ marginY: "12px" }} component={"form"} onSubmit={() => {}}>
        <Stack direction={"row"} spacing={1}>
          <TextField
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            size="small"
            sx={{ bgcolor: "#FFF", width: "50%" }}
            name="pay-otp"
            required
          />
          <Button
            ref={payOtpVerifyButtonRef}
            onClick={handleOtpVerify}
            disabled={otp.length !== 6}
            // disabled={otp.length !== 6 || otpVerifyLoading}
            type="submit"
            color="error"
            size={"small"}
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: "12px",
              boxShadow: 0,
              width: "50%",
            }}
          >
            {otpVerifyLoading ? "Verifying..." : "Verify"}
          </Button>
        </Stack>
      </Box>

      {resMessage?.message ? (
        <Box sx={{ marginTop: "5px" }}>
          <Typography
            sx={{
              fontSize: "14px",
              padding: "3px",
              bgcolor:
                resMessage?.type === "success"
                  ? "#C2FFC7"
                  : alpha("#FFC7C7", 0.5),
              borderRadius: "3px",
              textAlign: "center",
              fontWeight: 600,
              color: resMessage?.type === "success" ? "green" : "red",
            }}
          >
            {resMessage?.message}
          </Typography>
        </Box>
      ) : (
        ""
      )}

      {resent > 0 && otpRemainTime >= 0 ? (
        <Box sx={{ marginTop: "5px" }}>
          <Typography
            sx={{
              fontSize: "14px",
              padding: "3px",
              bgcolor:
                otpSendMessage?.type === "success"
                  ? "#FFF7C7"
                  : otpSendMessage?.type === "warning"
                  ? alpha("#FFF7C7", 0.5)
                  : alpha("#FFC7C7", 0.5),
              borderRadius: "3px",
              textAlign: "center",
              fontWeight: 600,
              color:
                otpSendMessage?.type === "success"
                  ? "orange"
                  : otpSendMessage?.type === "warning"
                  ? "orange"
                  : "red",
            }}
          >
            {otpSendMessage?.message}
          </Typography>
        </Box>
      ) : (
        ""
      )}

      <Stack direction={"row"} spacing={1} sx={{ marginTop: "12px" }}>
        <Button
          onClick={handleGetSlotTime}
          // disabled={timeSlotLoading || !specificDate}
          // disabled={!specificDate}
          color="error"
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "50%",
          }}
        >
          {timeSlotLoading
            ? "Getting..."
            : `Get Slot Time ${
                timeSlot?.availableSlot ? `(${timeSlot?.availableSlot})` : ""
              }`}
        </Button>
        <Button
          onClick={handleBookSlot}
          // disabled={!hashParam || !paynowSectionCreated}
          // disabled={payNowLoading || !hashParam || !paynowSectionCreated}
          color="error"
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "50%",
          }}
        >
          {payNowLoading ? "Booking..." : "Book Slot"}
        </Button>
      </Stack>

      <Box sx={{ marginY: "10px" }}>
        <Typography
          sx={{
            fontSize: "14px",
            padding: "3px",
            bgcolor:
              captchaMessage?.type === "success"
                ? "#C2FFC7"
                : captchaMessage?.type === "warning"
                ? alpha("#FFF7C7", 0.5)
                : alpha("#FFC7C7", 0.5),
            borderRadius: "3px",
            textAlign: "center",
            fontWeight: 600,
            color:
              captchaMessage?.type === "success"
                ? "green"
                : captchaMessage?.type === "warning"
                ? "orange"
                : "red",
          }}
        >
          {captchaMessage?.message}
        </Typography>
      </Box>

      <Stack direction={"row"} spacing={1} sx={{ marginTop: "12px" }}>
        <Button
          onClick={handleCaptchaSolvedAnti}
          disabled={captchaLoadingByAnti}
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "50%",
          }}
        >
          {captchaLoadingByAnti
            ? "Captcha Request..."
            : "Captcha Request - API"}
        </Button>
        <Button
          onClick={handleOpenCaptchaContainer}
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "50%",
          }}
        >
          Captcha Solved - Manual
        </Button>
      </Stack>

      {paymentUrl && (
        <Stack direction={"row"} spacing={1} sx={{ marginTop: "12px" }}>
          <Button
            onClick={() => window.open(paymentUrl, "_blank")}
            disabled={!paymentUrl}
            size={"small"}
            variant="contained"
            color="success"
            sx={{
              textTransform: "none",
              fontSize: "12px",
              boxShadow: 0,
              width: "50%",
            }}
          >
            Pay Now - {data?.info?.length * 824}tk
          </Button>
          <Button
            onClick={() => navigator.clipboard.writeText(paymentUrl)}
            size={"small"}
            disabled={!paymentUrl}
            variant="contained"
            color="success"
            sx={{
              textTransform: "none",
              fontSize: "12px",
              boxShadow: 0,
              width: "50%",
            }}
          >
            Copy Payment Link
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default PayOtp;
