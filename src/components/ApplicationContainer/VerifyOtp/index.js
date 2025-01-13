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

const VerifyOtp = ({ data }) => {
  const [otp, setOtp] = useState(data?.otp);
  const [message, setMessage] = useState({
    message: "",
    type: "",
  });

  const formRef = useRef(null);

  const { applications } = useAppSelector((state) => state);

  const phone = data?.info?.[0]?.phone;

  const [manageQueue, { isLoading }] = useManageQueueMutation();
  const dispatch = useAppDispatch();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const currentApplication = data?.info?.[0];
    const payload = getVerifyOtpPayload({ ...data, otp });
    const result = await handleMultipleApiCall(
      manageQueue,
      payload,
      setMessage
    );

    const status = result?.status;
    const slot_dates = result?.data?.slot_dates ?? [];

    if (status === "SUCCESS") {
      dispatch(setApplicatonOtp({ otp, phone }));
      socket.emit("otp-verified", { phone, otp });
      const availableTimeSlot = applications?.find((application) => {
        const availableInfo = application?.info[0];
        if (
          availableInfo?.center?.id === currentApplication?.center?.id &&
          availableInfo?.ivac?.id === currentApplication?.ivac?.id &&
          availableInfo?.visa_type?.id === currentApplication?.visa_type?.id &&
          availableInfo?.slot_dates?.length &&
          availableInfo?.slot_times?.length
        ) {
          return true;
        } else {
          false;
        }
      });
      if (availableTimeSlot) {
        dispatch(
          setSlotTimes({
            slotTimes: availableTimeSlot?.slot_times,
            phone,
          })
        );
        dispatch(
          setSlotDates({
            slotDates: availableTimeSlot?.slot_dates,
            phone,
          })
        );
      } else {
        if (slot_dates?.length) {
          dispatch(
            setSlotDates({
              slotDates: slot_dates,
              phone,
            })
          );
        } else {
          const availableDateSlot = applications?.find((application) => {
            const availableInfo = application?.info[0];
            if (
              availableInfo?.center?.id === currentApplication?.center?.id &&
              availableInfo?.ivac?.id === currentApplication?.ivac?.id &&
              availableInfo?.visa_type?.id ===
                currentApplication?.visa_type?.id &&
              availableInfo?.slot_dates?.length
            ) {
              return true;
            } else {
              false;
            }
          });
          if (availableDateSlot?.slot_dates?.length) {
            dispatch(
              setSlotDates({
                slotDates: availableDateSlot?.slot_dates,
                phone,
              })
            );
          }
        }
      }
    }
  };

  useEffect(() => {
    socket.on("otp-get", (result) => {
      console.log(result);

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
