import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const GlobalLoader = ({ height = "40vh" }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={height}
      flexDirection="column"
    >
      <CircularProgress variant="indeterminate" />
      <Typography sx={{ padding: "16px", fontSize: "2rem", fontWeight: 600 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default GlobalLoader;
