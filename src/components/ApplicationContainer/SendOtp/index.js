import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledTypography } from "..";
import handleMultipleApiCall from "../../../utils/handleMultipleApiCall";
import { useManageQueueMutation } from "../../../redux/features/appBaseApi/appBaseApiSlice";
import { getSendOtpPayload } from "../../../utils/appPayload";
import { socket } from "../../../Main";
import envConfig from "../../../configs/envConfig";
import { useAppDispatch } from "../../../redux/store";
import { setApplicatonOtp } from "../../../redux/features/application/applicationApiSlice";
import { setStopAutomation } from "../../../redux/features/automation/automationSlice";

const SendOtp = ({ data, otpRef, applications, index }) => {
  const [message, setMessage] = useState({
    message: "",
    type: "",
  });
  const phone = data?.info?.[0]?.phone;
  const [manageQueue, { isLoading }] = useManageQueueMutation();
  const dispatch = useAppDispatch();
  const [apiCallRunning, setApiCallRunning] = useState(false);
  const [otpSend, setOptSend] = useState(false);
  const [abortController, setAbortController] = useState(null);

  const handleSendOtp = async () => {
    // dispatch(setStopAutomation({ apiCallRunning: true, otpSend: false }));
    if ((!isLoading, !apiCallRunning, !otpSend)) {
      const controller = new AbortController(); // Create a new AbortController
      setAbortController(controller);
      setApiCallRunning(true);
      const payload = getSendOtpPayload(data);
      const result = await handleMultipleApiCall(
        manageQueue,
        payload,
        setMessage,
        controller.signal
      );

      setApiCallRunning(false);
      if (result?.code === 200) {
        dispatch(
          setApplicatonOtp({
            otp: "",
            phone,
            resend: data?.resend ? data?.resend + 1 : 1,
          })
        );
        setOptSend(true);
        socket.emit("otp-send", { phone, isTesting: envConfig?.isTesting });
        // dispatch(setStopAutomation({ apiCallRunning: false, otpSend: true }));
      } else {
        if (index === applications.length - 1) {
          // dispatch(
          //   setStopAutomation({ apiCallRunning: false, otpSend: false })
          // );
        }
      }
    }
  };

  const handleForceStop = () => {
    console.log("force stop call");
    if (abortController) {
      console.log("Force stop call");
      abortController.abort();
      setApiCallRunning(false);
      setAbortController(null);
    }
  };

  useEffect(() => {
    const handleOtpReceived = () => {
      if (!apiCallRunning && !otpSend) {
        setTimeout(() => {
          handleSendOtp();
        }, index * 1500);
      }
    };

    socket.once("otp-received", handleOtpReceived);
    return () => {
      socket.off("otp-received", handleOtpReceived);
    };
  }, []);

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
        disabled={isLoading}
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
        disabled={!abortController}
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

      <Typography
        sx={{
          fontSize: "12px",
          color: message?.type === "success" ? "green" : "red",
        }}
      >
        {message?.message}
      </Typography>
    </Box>
  );
};

export default SendOtp;
