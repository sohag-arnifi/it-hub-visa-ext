import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useManageQueueMutation } from "../../../redux/features/appBaseApi/appBaseApiSlice";
import handleMultipleApiCall from "../../../utils/handleMultipleApiCall";
import { getVerifyOtpPayload } from "../../../utils/appPayload";
import { socket } from "../../../Main";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
  setApplicatonOtp,
  setSlotDates,
  setSlotTimes,
} from "../../../redux/features/application/applicationApiSlice";
import { useGetCaptchaTokenMutation } from "../../../redux/features/application/applicationApi";

const VerifyOtp = ({ data, otpRef }) => {
  const [otp, setOtp] = useState(data?.otp);
  const [message, setMessage] = useState({
    message: "",
    type: "",
  });

  const user = useAppSelector((state) => state?.auth?.user);
  const [getCaptchaToken] = useGetCaptchaTokenMutation();

  const abortControllerRef = useRef(null);

  const formRef = useRef(null);

  const phone = data?.info?.[0]?.phone;

  const [manageQueue, { isLoading }] = useManageQueueMutation();
  const dispatch = useAppDispatch();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentApplication = data?.info?.[0];
    const payload = getVerifyOtpPayload({ ...data, otp });
    const result = await handleMultipleApiCall(
      manageQueue,
      payload,
      setMessage,
      controller.signal,
      1000
    );

    if (result?.message[0] === "OTP expired. Please try again") {
      otpRef.current.click();
    }

    const status = result?.status;
    const slot_dates = result?.data?.slot_dates ?? [];

    if (status === "SUCCESS") {
      dispatch(setApplicatonOtp({ otp, phone, resend: data?.resend + 1 }));
      if (slot_dates?.length) {
        const data = {
          center: currentApplication?.center?.id,
          ivac: currentApplication?.ivac?.id,
          visa_type: currentApplication?.visa_type?.id,
          slot_dates,
        };
        socket.emit("sendSlotDate", data);
      }
      // await getCaptchaToken({ phone, userId: user?._id });
    }
  };

  useEffect(() => {
    socket.on("otp-get", (result) => {
      if (!otp && phone?.trim() === result?.to?.trim()) {
        setOtp(result?.otp);
        if (formRef.current) {
          setTimeout(() => {
            formRef.current.dispatchEvent(
              new Event("submit", { bubbles: true })
            );
          }, 500);
        }
      }
    });
    return () => {
      socket.off("otp-get");
    };
  }, []);

  useEffect(() => {
    if (data?.resend && !data?.otp) {
      setOtp("");
    }
  }, [data]);

  return (
    <Box
      ref={formRef} // Assign the formRef to the form element
      onSubmit={handleOtpSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
      }}
      component={"form"}
    >
      <TextField
        onChange={(e) => setOtp(e.target.value)}
        value={otp}
        size="small"
        placeholder="Enter OTP"
        required
        type="number"
        sx={{
          fontSize: "12px",
        }}
      />
      <Button
        disabled={isLoading || otp?.length !== 6}
        type="submit"
        variant="contained"
        size="small"
        sx={{
          textTransform: "none",
          fontSize: "10px",
          boxShadow: "none",
        }}
      >
        {isLoading ? "Loading..." : "Verify OTP"}
      </Button>
      <Typography
        sx={{
          fontSize: "10px",
          color: message.type === "success" ? "green" : "red",
        }}
      >
        {message.message}
      </Typography>
    </Box>
  );
};

export default VerifyOtp;
