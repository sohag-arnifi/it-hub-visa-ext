import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { StyledTypography } from "..";
import handleMultipleApiCall from "../../../utils/handleMultipleApiCall";
import { useManageQueueMutation } from "../../../redux/features/appBaseApi/appBaseApiSlice";
import { getSendOtpPayload } from "../../../utils/appPayload";
import { socket } from "../../../Main";
import { useAppDispatch } from "../../../redux/store";
import { setApplicatonOtp } from "../../../redux/features/application/applicationApiSlice";
import envConfig from "../../../configs/envConfig";

const SendOtp = ({ data, applications, index }) => {
  const [message, setMessage] = useState({
    message: "",
    type: "",
  });
  const phone = data?.info?.[0]?.phone;
  const [manageQueue, { isLoading }] = useManageQueueMutation();
  const dispatch = useAppDispatch();
  const [otpSend, setOptSend] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  const abortControllerRef = useRef(null);
  const [isRequestActive, setIsRequestActive] = useState(false);

  const handleSendOtp = async ({ apiDelay = 4000 }) => {
    if (isRequestActive || otpSend) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const payload = getSendOtpPayload(data);
    setIsRequestActive(true);

    const result = await handleMultipleApiCall(
      manageQueue,
      payload,
      setMessage,
      controller.signal,
      apiDelay
    );

    setIsRequestActive(false);
    if (result?.code === 200) {
      dispatch(
        setApplicatonOtp({
          otp: "",
          phone,
          resend: data?.resend ? data?.resend + 1 : 1,
        })
      );
      setOptSend(true);
      setCountdown(300);
      startCountdown();
      socket.emit("otp-send", { phone, isTesting: envConfig?.isTesting });
    }
  };

  const startCountdown = () => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (countdown === 0 && otpSend) {
      setOptSend(false);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? "0" + secondsLeft : secondsLeft}`;
  };

  const handleForceStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort the ongoing request using ref
      abortControllerRef.current = null; // Reset the ref to null
      setIsRequestActive(false); // Disable Force Stop button
      console.log("API call aborted");
    }
  };

  useEffect(() => {
    socket.once("otp-received", () => {
      if (!isRequestActive && !otpSend) {
        handleSendOtp({ apiDelay: 1500 });
      }
    });
    return () => {
      socket.off("otp-received");
    };
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <StyledTypography>Send to - {phone}</StyledTypography>
      <Button
        disabled={isLoading || otpSend}
        onClick={handleSendOtp}
        variant="contained"
        color="error"
        size="small"
        sx={{
          textTransform: "none",
          fontSize: "10px",
          boxShadow: "none",
        }}
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>

      <Button
        disabled={!isRequestActive}
        onClick={handleForceStop}
        variant="contained"
        color="error"
        size="small"
        sx={{
          textTransform: "none",
          fontSize: "10px",
          boxShadow: "none",
        }}
      >
        Force Stop
      </Button>

      {otpSend ? (
        <StyledTypography
          sx={{ fontSize: "12px", color: countdown > 50 ? "green" : "red" }}
        >
          {countdown > 0
            ? `OTP sent. Time remaining: ${formatTime(countdown)}`
            : `OTP expired. Please resend.`}
        </StyledTypography>
      ) : (
        <Typography
          sx={{
            fontSize: "12px",
            textAlign: "center",
            color: message?.type === "success" ? "green" : "red",
          }}
        >
          {message?.message}
        </Typography>
      )}

      {/* <Box>
        {otpSend && (
          <StyledTypography
            sx={{ fontSize: "12px", color: countdown > 50 ? "green" : "red" }}
          >
            {countdown > 0
              ? `OTP sent. Time remaining: ${formatTime(countdown)}`
              : `OTP expired. Please resend.`}
          </StyledTypography>
        )}
      </Box> */}
    </Box>
  );
};

export default SendOtp;
