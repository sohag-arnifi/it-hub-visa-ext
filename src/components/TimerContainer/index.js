import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useWakeLock from "../../hooks/useWakeLock";
import { RestartAlt } from "@mui/icons-material";

const TimerContainer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useWakeLock();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

      {/* <Typography
        sx={{
          paddingTop: "1rem",
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "red",
        }}
      >
        Last update: 20/20/20
      </Typography> */}

      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "0.5rem" }}
      >
        {/* <Button
          onClick={handleCheckLastUpdate}
          variant="contained"
          color={"error"}
          sx={{ textTransform: "none", boxShadow: "none" }}
          endIcon={<RestartAlt />}
        >
          {"Check last update!"}
        </Button> */}
      </Box>
    </Box>
  );
};

export default TimerContainer;
