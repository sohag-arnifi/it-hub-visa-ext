import { alpha, Box, Button, Stack, Typography } from "@mui/material";
import React from "react";

const Booking = () => {
  return (
    <Box
      sx={{
        bgcolor: "#C2FFC7",
        padding: "10px",
        borderRadius: "3px",
      }}
    >
      <Typography
        sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}
      >
        Application Date: {new Date().toDateString()}
      </Typography>
      <Typography
        sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}
      >
        Application Time: {new Date().toDateString()}
      </Typography>
      <Stack direction={"row"} spacing={1} sx={{ marginTop: "5px" }}>
        <Button
          color="error"
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "100%",
          }}
        >
          Get Time
        </Button>
        <Button
          color="error"
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "100%",
          }}
        >
          Force Close
        </Button>
      </Stack>

      <Typography
        sx={{
          marginY: "5px",
          fontSize: "14px",
          padding: "3px",
          bgcolor: alpha("#F72C5B", 0.2),
          borderRadius: "3px",
          textAlign: "center",
          fontWeight: 600,
          color: "red",
        }}
      >
        Successfully Logged In
      </Typography>

      <Stack direction={"row"} spacing={1} sx={{ marginTop: "5px" }}>
        <Button
          color="error"
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "100%",
          }}
        >
          Book Slot
        </Button>
        <Button
          color="error"
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "100%",
          }}
        >
          Force Close
        </Button>
      </Stack>

      <Stack direction={"row"} spacing={1} sx={{ marginTop: "5px" }}>
        <Button
          color="error"
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "100%",
          }}
        >
          Pay Now
        </Button>
        <Button
          color="error"
          size={"small"}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            boxShadow: 0,
            width: "100%",
          }}
        >
          Copy Link
        </Button>
      </Stack>
    </Box>
  );
};

export default Booking;
