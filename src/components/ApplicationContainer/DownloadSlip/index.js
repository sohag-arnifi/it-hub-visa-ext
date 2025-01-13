import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

const DownloadSlip = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <Button
        variant="contained"
        color="success"
        size="small"
        sx={{
          textTransform: "none",
          fontSize: "10px",
          boxShadow: "none",
        }}
      >
        Download Slip
      </Button>
    </Box>
  );
};

export default DownloadSlip;
