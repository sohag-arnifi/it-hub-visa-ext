import { Box, Typography } from "@mui/material";
import React from "react";
import { getIVAC, getVisaType } from "../../../constanse";

const Header = ({ data }) => {
  const ivac = getIVAC(data?.ivac);
  const visaType = getVisaType(data?.visaType);

  return (
    <Box
      sx={{
        bgcolor: "#F8F5E9",
        padding: "10px",
        borderRadius: "3px",
      }}
    >
      <Typography
        sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "18px" }}
      >
        {ivac?.ivac_name}
      </Typography>
      <Typography
        sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "18px" }}
      >
        {visaType?.type_name}
      </Typography>
      <Typography
        sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "18px" }}
      >
        Total Application: {data?.info?.length}
      </Typography>
    </Box>
  );
};

export default Header;
