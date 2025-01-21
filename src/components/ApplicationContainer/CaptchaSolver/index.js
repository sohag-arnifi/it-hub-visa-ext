import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledTypography } from "..";
import { socket } from "../../../Main";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { setHashParams } from "../../../redux/features/application/applicationApiSlice";

const CaptchaSolver = ({ data }) => {
  const phone = data?.info[0]?.phone;
  const user = useAppSelector((state) => state?.auth?.user);
  const [captchaContainerOpen, setCaptchaContainerOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(-1); // 2 minutes in seconds

  const dispatch = useAppDispatch();

  const handleCaptchaReceived = (data) => {
    if (user?._id === data?.userId && phone === data?.phone) {
      setTimeLeft(90); // Reset timer to 2 minutes when captcha is received
    }
  };

  const requestCaptchaTokenHandlar = () => {
    // localStorage.setItem("userId", JSON.stringify(user?._id));
    socket.emit("captcha-neded", { phone, userId: user?._id });
  };

  useEffect(() => {
    socket.on("captcha-create", ({ userId }) => {
      if (userId === user?._id) {
        setCaptchaContainerOpen(true);
      }
    });

    socket.on("captcha-close", ({ userId }) => {
      if (userId === user?._id) {
        setCaptchaContainerOpen(false);
      }
    });

    socket.on("captcha-received", handleCaptchaReceived);

    // Cleanup function
    return () => {
      socket.off("captcha-create");
      socket.off("captcha-close");
      socket.off("captcha-neded");
      socket.off("captcha-received");
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time in minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  useEffect(() => {
    if (data?.hash_params?.token && data?.hash_params?.message === "Solved") {
      setTimeLeft(90);
    }
  }, [data]);

  useEffect(() => {
    if (timeLeft === 0) {
      dispatch(
        setHashParams({
          hash_params: {
            token: data?.hash_params?.token,
            message: "Captcha Expire soon.",
          },
          phone,
        })
      );
    }
  }, [timeLeft]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <StyledTypography sx={{ lineHeight: "10px" }}>
        Manual Captcha Solver
      </StyledTypography>

      <Button
        onClick={requestCaptchaTokenHandlar}
        disabled={captchaContainerOpen}
        variant="contained"
        size="small"
        sx={{
          textTransform: "none",
          fontSize: "10px",
          boxShadow: "none",
        }}
      >
        Captcha Solver
      </Button>

      <StyledTypography
        sx={{
          lineHeight: "10px",
          color: "red",
          textAlign: "center",
          fontSize: "12ps",
        }}
      >
        {timeLeft > 0
          ? `Token expire in ${formatTime(timeLeft)} mins`
          : "Token expired"}
      </StyledTypography>
    </Box>
  );
};

export default CaptchaSolver;
