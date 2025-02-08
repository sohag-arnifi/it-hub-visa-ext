import { alpha, Box, Typography } from "@mui/material";
import React from "react";

const InfoSession = ({ data }) => {
  return (
    <Box
      sx={{
        bgcolor: "#FBF6E9",
        padding: "10px",
        borderRadius: "3px",
      }}
    >
      <Typography
        sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}
      >
        Application Info
      </Typography>
      <Box>
        {data?.info?.map((item, i) => {
          return (
            <Typography
              key={i}
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: "16px",
              }}
            >
              {i + 1}. {item?.web_id}, {item?.name}
            </Typography>
          );
        })}
      </Box>
      <Typography
        sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
      >
        Mobile: <span style={{ fontWeight: 600 }}>{data?.phone}</span>
      </Typography>
      <Typography
        sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
      >
        Email: <span style={{ fontWeight: 600 }}>{"abc@gmail.com"}</span>
      </Typography>
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

export default InfoSession;
