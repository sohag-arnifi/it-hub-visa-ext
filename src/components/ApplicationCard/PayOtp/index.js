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

  const [resent, setResent] = React.useState(0);
  const [otp, setOtp] = useState("");
  const [paymentUrl, setPaymentUrl] = useState(() => {
    return data?.paymentStatus?.url;
  });

  const [resMessage, setResMessage] = React.useState({
    message: "",
    type: "",
  });

  const [hashParam, setHashParam] = React.useState("");
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
      if (result) {
        setResent(resent + 1);
      }
      console.log("result", result);
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSlotTime = async () => {
    const payload = getTimeSlotPayload(data);
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

      if (result) {
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
        { ...payload, hash_param: hashParam },
        setResMessage,
        controller.signal,
        "pay-now"
      );

      if (result?.url) {
        const payURL = `${result?.url}${data?.selected_payment?.slug}`;
        console.log(payURL);
        setPaymentUrl(payURL);
        window.open(payURL, "_blank");
        if (!envConfig?.isTesting) {
          await updatePaymentStatus({
            phone: data?.phone,
            data: {
              paymentStatus: {
                status: "SUCCESS",
                url: payURL,
              },
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCaptchaSolved = async () => {
    try {
      const response = await getCaptchaToken({}).unwrap();
      if (response?.data) {
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
        }, 2000);
      }
    };

    // Listen for the "login-send-otp" event
    socket.on("pay-send-otp", handlePayOtpVefiry);
    // Cleanup function to remove the event listener
    return () => {
      socket.off("pay-send-otp", handlePayOtpVefiry);
    };
  }, [data?.phone]);

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
          disabled={otpSendLoading}
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
          Force Close
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
            disabled={otp.length !== 6 || otpVerifyLoading}
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

      <Stack direction={"row"} spacing={1} sx={{ marginTop: "12px" }}>
        <Button
          onClick={handleGetSlotTime}
          disabled={timeSlotLoading}
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
          {timeSlotLoading ? "Getting..." : "Get Slot Time"}
        </Button>
        <Button
          onClick={handleBookSlot}
          disabled={payNowLoading || (!hashParam && !paynowSectionCreated)}
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

      <Stack direction={"row"} spacing={1} sx={{ marginTop: "12px" }}>
        <Button
          onClick={handleCaptchaSolved}
          disabled={captchaLoading}
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "50%",
          }}
        >
          {captchaLoading ? "Captcha Request..." : "Captcha Request - API"}
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
