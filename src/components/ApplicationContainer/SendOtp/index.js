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

const SendOtp = ({ data, applications, index, otpRef }) => {
  const [message, setMessage] = useState({
    message: "",
    type: "",
  });
  const phone = data?.info?.[0]?.phone;
  const [manageQueue, { isLoading }] = useManageQueueMutation();
  const dispatch = useAppDispatch();
  const [countdown, setCountdown] = useState(-1); // 5 minutes in seconds

  const abortControllerRef = useRef(null);
  const isRequestActiveRef = useRef(null);
  const isSendOtpRef = useRef(null);

  const handleSendOtp = async ({ apiDelay = 3000 }) => {
    if (isRequestActiveRef.current || isSendOtpRef.current) return;
    isRequestActiveRef.current = true; // Update the ref immediately
    isSendOtpRef.current = false;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const payload = getSendOtpPayload(data);

    const result = await handleMultipleApiCall(
      manageQueue,
      payload,
      setMessage,
      controller.signal,
      apiDelay
    );

    isRequestActiveRef.current = false;
    isSendOtpRef.current = true;

    if (result?.code === 200) {
      dispatch(
        setApplicatonOtp({
          otp: data?.otp,
          phone,
          resend: data?.resend + 1,
        })
      );
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
    if (countdown === 0 && isSendOtpRef?.current) {
      isSendOtpRef.current = false;
      // if (!data?.paymentUrl) {
      //   console.log("time up. reasy to next try -1500");
      //   setTimeout(() => {
      //     handleSendOtp({ apiDelay: 1500 });
      //   }, 3000);
      // }
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
      isRequestActiveRef.current = false;
      console.log("API call aborted");
    }
  };

  useEffect(() => {
    socket.once("otp-received", () => {
      if (
        !isRequestActiveRef.current &&
        !isSendOtpRef.current &&
        !data?.selected_payment?.link
      ) {
        handleSendOtp({ apiDelay: 1500 });
      }
    });
    return () => {
      socket.off("otp-received");
    };
  }, [index]);

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
        ref={otpRef}
        disabled={isLoading || isSendOtpRef?.current}
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
        disabled={!isRequestActiveRef?.current}
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

      {isSendOtpRef?.current && (
        <StyledTypography
          sx={{ fontSize: "12px", color: countdown > 50 ? "green" : "red" }}
        >
          {countdown > 0
            ? `OTP sent. Time remaining: ${formatTime(countdown)}`
            : `OTP expired. try again.`}
        </StyledTypography>
      )}

      {message?.message && (
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
    </Box>
  );
};

export default SendOtp;
