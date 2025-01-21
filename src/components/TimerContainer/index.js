import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useWakeLock from "../../hooks/useWakeLock";
import { RestartAlt } from "@mui/icons-material";

const TimerContainer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = React.useState({
    color: "",
    message: "",
  });

  useWakeLock();

  const handleUpdateCaseCookie = async () => {
    const MAX_RETRIES = 10;
    let retries = 0;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchWithRetry = async () => {
      try {
        setMessage({
          color: "blue",
          message: `Attempting to fetch data... (${
            retries + 1
          }/${MAX_RETRIES})`,
        });

        const response = await fetch("https://payment.ivacbd.com/");

        if (!response.ok && [500, 502, 504].includes(response.status)) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const htmlText = await response.text();
        console.log(htmlText);

        setMessage({
          color: "green",
          message: "Data fetched successfully! Case updated successfully.",
        });
      } catch (error) {
        if (retries < MAX_RETRIES - 1) {
          retries += 1;
          setMessage({
            color: "orange",
            message: `Retrying... (${retries}/${MAX_RETRIES})`,
          });
          await delay(retries * 1000); // Exponential backoff
          await fetchWithRetry(); // Retry the request
        } else {
          setMessage({
            color: "red",
            message:
              "Failed to fetch data after multiple attempts. Please try again later.",
          });
          console.error("Max retries reached. Error:", error.message);
          throw error; // Throw error after max retries
        }
      }
    };

    setLoading(true);
    setMessage({
      color: "blue",
      message: "Starting the update process...",
    });

    try {
      await fetchWithRetry();
    } catch (error) {
      console.error("Final Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

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

      <Box
        sx={{
          marginY: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Button
          onClick={handleUpdateCaseCookie}
          sx={{ textTransform: "none" }}
          color="error"
          variant="contained"
          endIcon={<RestartAlt />}
        >
          {loading ? "Updating..." : "Update Case"}
        </Button>

        {message?.message && (
          <Typography
            sx={{
              marginTop: "12px",
              fontWeight: 600,
              fontSize: "12px",
              color: message?.color,
            }}
          >
            {message?.message}
          </Typography>
        )}
      </Box>

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
