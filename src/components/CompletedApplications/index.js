import { Box, Typography } from "@mui/material";
import React from "react";
import { useGetCompletedApplicationsQuery } from "../../redux/features/application/applicationApi";
import ApplicationsTable from "./CompletedTable";

const CompletedApplications = () => {
  const { data, isLoading } = useGetCompletedApplicationsQuery();

  const totalApplications = data?.data?.length ?? 0;
  const totalFiles =
    data?.data?.reduce((acc, item) => acc + item?.info?.length, 0) ?? 0;

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "1.5rem",
          fontWeight: 700,
        }}
      >
        Completed Applications
      </Typography>

      <Box sx={{ display: "flex", gap: "10px" }}>
        <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>
          Total - {totalApplications}, Web Files - {totalFiles}
        </Typography>
      </Box>

      <ApplicationsTable isLoading={isLoading} data={data?.data} />
    </Box>
  );
};

export default CompletedApplications;
