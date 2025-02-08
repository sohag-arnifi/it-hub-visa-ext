import {
  alpha,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const PayOtp = () => {
  return (
    <Box
      sx={{
        bgcolor: "#C2FFC7",
        padding: "10px",
        borderRadius: "3px",
      }}
    >
      <Stack direction={"row"} spacing={1}>
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
          Send OTP
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

      <Box sx={{ marginY: "12px" }} component={"form"} onSubmit={() => {}}>
        <Stack direction={"row"} spacing={1}>
          <TextField
            size="small"
            sx={{ bgcolor: "#FFF" }}
            name="pay-otp"
            required
          />
          <Button
            type="submit"
            color="error"
            size={"small"}
            variant="contained"
            sx={{ textTransform: "none", fontSize: "12px", boxShadow: 0 }}
          >
            Verify
          </Button>
        </Stack>
      </Box>

      <Box sx={{ marginTop: "5px" }}>
        <Typography
          sx={{
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
      </Box>
    </Box>
  );
};

export default PayOtp;
