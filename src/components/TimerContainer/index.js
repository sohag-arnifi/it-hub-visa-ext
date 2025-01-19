import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { RestartAlt } from "@mui/icons-material";
import {
  setLastUpdate,
  setStartAutomation,
} from "../../redux/features/automation/automationSlice";
import useWakeLock from "../../hooks/useWakeLock";
import CircleIcon from "@mui/icons-material/Circle";

const TimerContainer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useWakeLock(); // Prevent the screen from turning off

  const timeRefs = useRef([]);

  const { isAutomationOn, lastUpdate, apiCallRunning, otpSend } =
    useAppSelector((state) => state?.automation);
  const dispatch = useAppDispatch();
  const checkingTimes = [
    "1:55:00 PM",
    "1:58:00 PM",
    "11:00:00 PM",
    "11:20:00 PM",
    "11:40:00 PM",
    "2:00:00 PM",
    "3:07:00 AM",
    "3:00:00 PM",
    "3:15:00 PM",
    "3:30:00 PM",
    "3:45:00 PM",
    "4:00:00 PM",
    "4:15:00 PM",
    "4:30:00 PM",
    "4:45:00 PM",
    "5:00:00 PM",
    "5:15:00 PM",
    "5:30:00 PM",
    "5:45:00 PM",
    "6:00:00 PM",
    "6:15:00 PM",
    "6:30:00 PM",
    "6:45:00 PM",
    "7:00:00 PM",
    "7:15:00 PM",
    "7:30:00 PM",
    "7:45:00 PM",
    "8:00:00 PM",
  ];

  const getButtonColor = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(/[: ]/);
    const ampm = timeString.split(" ")[1];
    // Create a date object for comparison
    let targetTime = new Date(currentTime);
    targetTime.setHours(
      ampm === "PM" && parseInt(hours) !== 12
        ? parseInt(hours) + 12
        : parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    );
    // Compare currentTime to targetTime
    return currentTime < targetTime ? "primary" : "error";
  };

  const getEventText = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(/[: ]/);
    const ampm = timeString.split(" ")[1];
    // Create a date object for comparison
    let targetTime = new Date(currentTime);
    targetTime.setHours(
      ampm === "PM" && parseInt(hours) !== 12
        ? parseInt(hours) + 12
        : parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    );
    // Compare currentTime to targetTime
    return currentTime < targetTime ? "Upcoming" : "Pass";
  };

  useEffect(() => {
    if (isAutomationOn) {
      const interval = setInterval(() => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString();

        if (checkingTimes.includes(formattedTime)) {
          if (!apiCallRunning && !otpSend) {
            dispatch(
              setLastUpdate({
                lastUpdate: formattedTime,
                hitNow: true,
              })
            );
          }
          const index = checkingTimes.indexOf(formattedTime);
          if (timeRefs.current[index]) {
            timeRefs.current[index].scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center",
            });
          }
        }
        setCurrentTime(now);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAutomationOn]);

  const handleStartAutomation = () => {
    dispatch(setStartAutomation(!isAutomationOn));
  };

  return (
    <Box
      sx={{
        padding: "2rem",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: 600,
          color: "blue",
        }}
      >
        {currentTime?.toLocaleTimeString()}
      </Typography>
      {lastUpdate && (
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: 500,
            color: "red",
          }}
        >
          Last update: {lastUpdate}
        </Typography>
      )}

      <Box
        sx={{
          my: "16px",
          maxWidth: "700px",
          display: "flex",
          justifyContent: "start",
          mx: "auto",
          alignItems: "center",
          gap: "10px",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {checkingTimes?.map((time, i) => (
          <Box
            key={i}
            ref={(el) => (timeRefs.current[i] = el)}
            sx={{
              bgcolor: getButtonColor(time),
              padding: "5px",
              borderRadius: "5px",
              minWidth: "120px",
              flex: "0 0 auto",
              bgcolor: getButtonColor(time) === "primary" ? "green" : "red",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                width: "100%",
                textAlign: "center",
                color: "#FFF",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {time}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "2px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircleIcon sx={{ fontSize: "10px", color: "#FFF" }} />
              <Typography sx={{ fontSize: "10px", color: "#FFF" }}>
                {getEventText(time)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", paddingY: "1rem" }}>
        <Button
          onClick={handleStartAutomation}
          variant="contained"
          color={!isAutomationOn ? "error" : "success"}
          sx={{ textTransform: "none", boxShadow: "none" }}
          endIcon={<RestartAlt />}
        >
          {isAutomationOn ? "Stop Now!" : "Start Now!"}
        </Button>
      </Box>
    </Box>
  );
};

export default TimerContainer;
