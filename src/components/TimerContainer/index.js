import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { RestartAlt } from "@mui/icons-material";
import {
  setLastUpdate,
  setStartAutomation,
} from "../../redux/features/automation/automationSlice";
import useWakeLock from "../../hooks/useWakeLock";

const TimerContainer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useWakeLock(); // Prevent the screen from turning off

  const { isAutomationOn, lastUpdate, hitNow } = useAppSelector(
    (state) => state?.automation
  );
  const dispatch = useAppDispatch();
  const checkingTimes = [
    "1:55:00 PM",
    "1:58:00 PM",
    "2:00:00 PM",
    "2:05:00 PM",
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

  useEffect(() => {
    if (isAutomationOn) {
      const interval = setInterval(() => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString();

        if (checkingTimes.includes(formattedTime)) {
          dispatch(
            setLastUpdate({
              lastUpdate: formattedTime,
              hitNow: true,
            })
          );
        }
        setCurrentTime(now);
        // const checkTime = checkingTimes.find(
        //   (time) => time === now.toLocaleTimeString()
        // );

        // if (checkTime) {
        //   dispatch(
        //     setLastUpdate({
        //       lastUpdate: currentTime.toLocaleTimeString(),
        //       hitNow: true,
        //     })
        //   );
        // }
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
        {currentTime.toLocaleTimeString()}
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
          maxWidth: "70vw",
          marginX: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          paddingY: "1rem",
          flexWrap: "wrap",
        }}
      >
        {checkingTimes.map((time) => {
          return (
            <Button
              key={time}
              size="small"
              variant="contained"
              color={getButtonColor(time)}
              sx={{ textTransform: "none", boxShadow: "none" }}
            >
              {time}
            </Button>
          );
        })}
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
