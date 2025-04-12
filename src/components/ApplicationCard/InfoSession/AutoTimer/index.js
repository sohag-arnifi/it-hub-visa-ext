import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ManageHistoryRoundedIcon from "@mui/icons-material/ManageHistoryRounded";
import { MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const AutoTimer = ({ applicationSubmitRef }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAuto, setIsAuto] = useState(() => {
    const storedValue = localStorage.getItem("isAuto");
    return storedValue === "true";
  });

  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(() => {
    const storedTime = localStorage.getItem("selectedTime");
    return storedTime
      ? dayjs(JSON.parse(storedTime))
      : dayjs().set("hour", 18).set("minute", 0).set("second", 0);
  });

  const handleIconClick = () => {
    setIsTimePickerOpen(true);
  };

  const handleTimeChange = (time) => {
    localStorage.setItem("selectedTime", JSON.stringify(time));
    setSelectedTime(time);
    setIsTimePickerOpen(false);
  };

  const handleToggleAuto = () => {
    setIsAuto(!isAuto);
    localStorage.setItem("isAuto", !isAuto);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuto) {
      const nowTimestamp = currentTime.getTime();
      const selectedTimestamp = selectedTime.valueOf();

      const tolerance = 500;
      if (Math.abs(nowTimestamp - selectedTimestamp) <= tolerance) {
        applicationSubmitRef.current.click();
      }
    }
  }, [isAuto, currentTime, selectedTime]);

  return (
    <Box
      sx={{
        my: "14px",
        borderRadius: "6px",
        padding: "1rem",
        bgcolor: "#FFF",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#E52020",
          }}
        >
          {currentTime?.toLocaleTimeString("en-US", {
            hour12: true,
          })}
        </Typography>

        {isAuto ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <AccessTimeRoundedIcon sx={{ fontSize: "1rem", color: "blue" }} />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "blue",
              }}
            >
              {dayjs(selectedTime).format("hh:mm A")}
            </Typography>

            <ManageHistoryRoundedIcon
              onClick={handleIconClick}
              sx={{
                fontSize: "1rem",
                color: "green",
                marginLeft: "5px",
                cursor: "pointer",
              }}
            />

            <LocalizationProvider
              adapterLocale={"en"}
              dateAdapter={AdapterDayjs}
            >
              <MobileTimePicker
                sx={{ display: "none" }}
                open={isTimePickerOpen}
                onClose={() => setIsTimePickerOpen(false)}
                value={selectedTime}
                onChange={handleTimeChange}
              />
            </LocalizationProvider>
          </Box>
        ) : (
          ""
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            bgcolor: "#F8F5E9",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>Auto Mode</Typography>
          <Button
            onClick={handleToggleAuto}
            sx={{ textTransform: "none" }}
            variant="contained"
            color={isAuto ? "success" : "error"}
            size="small"
          >
            {isAuto ? "On" : "Off"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AutoTimer;
