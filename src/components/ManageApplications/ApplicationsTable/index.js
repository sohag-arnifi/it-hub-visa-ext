import React, { useState } from "react";
import { alpha, Box, Button, Grid, Modal, Typography } from "@mui/material";
import { StyledTypography } from "../../ApplicationContainer";
import {
  getCenter,
  getIVAC,
  getPaymentMethod,
  getVisaType,
} from "../../../constanse";
import GlobalLoader from "../../GlobalLoader";
import { useDeleteApplicationMutation } from "../../../redux/features/application/applicationApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  bgcolor: "background.paper",
  boxShadow: 24,
  border: "none",
  padding: "1rem",
  borderRadius: "5px",
};

const ApplicationsTable = ({
  data,
  isLoading,
  setOpenUpdateModal,
  setUpdatedValues,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [deletedInfo, setDeletedInfo] = useState({});

  const [deleteApplication, { isLoading: deleteLoading }] =
    useDeleteApplicationMutation();

  const handleDeleteApplication = async () => {
    try {
      const response = await deleteApplication(deletedInfo).unwrap();
      if (response?.success) {
        setOpenModal(false);
        setDeletedInfo({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Box sx={{ marginTop: "2rem" }}>
        {isLoading ? (
          <GlobalLoader height="40vh" />
        ) : !data?.length ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40vh",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "red",
              }}
            >
              No Applications Found!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {data?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  padding: "1rem",
                  bgcolor: item?.status
                    ? alpha("#5B913B", 0.15)
                    : alpha("#F93827", 0.15),
                  border: item?.status
                    ? "1px solid #5B913B"
                    : "1px solid #F93827",
                  borderRadius: "5px",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={1.5}>
                    <Box>
                      <StyledTypography>
                        {index + 1}. {getCenter(item?.center)?.c_name}
                      </StyledTypography>
                      <StyledTypography>
                        {getIVAC(item?.ivac)?.ivac_name}
                      </StyledTypography>
                      <StyledTypography>
                        {getVisaType(item?.visaType)?.type_name}
                      </StyledTypography>
                    </Box>
                  </Grid>

                  <Grid item xs={2.5}>
                    {item?.info?.map((item, i) => {
                      return (
                        <Box key={i}>
                          <StyledTypography>
                            {i + 1}. {item?.name} - {item?.web_id}
                          </StyledTypography>
                        </Box>
                      );
                    })}
                  </Grid>

                  <Grid item xs={2}>
                    <Box>
                      <StyledTypography>{item?.phone}</StyledTypography>
                      <StyledTypography>{item?.email}</StyledTypography>
                    </Box>
                  </Grid>

                  <Grid item xs={2}>
                    <Box>
                      <StyledTypography>
                        Payment Option:{" "}
                        {getPaymentMethod(item?.paymentMethod)?.name}
                      </StyledTypography>

                      <StyledTypography>
                        Payment Number: {item?.paymentNumber}
                      </StyledTypography>
                      <StyledTypography>
                        Payable Amount:{" "}
                        {(item?.info?.length * 824).toLocaleString()}
                      </StyledTypography>
                    </Box>
                  </Grid>

                  <Grid item xs={2}>
                    <Box>
                      <StyledTypography>
                        Current Status: {item?.status ? "Completed" : "Pending"}
                      </StyledTypography>

                      <StyledTypography>
                        Agent Payment: {item?.paymentAmount.toLocaleString()}
                      </StyledTypography>

                      <StyledTypography>
                        Created Date:{" "}
                        {new Date(item?.createdAt).toLocaleDateString()}
                      </StyledTypography>
                    </Box>
                  </Grid>

                  <Grid item xs={2}>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Button
                        disabled={item?.status}
                        onClick={() => {
                          setUpdatedValues(item);
                          setOpenUpdateModal(true);
                        }}
                        variant="contained"
                        size="small"
                        sx={{
                          width: "100%",
                          textTransform: "none",
                          boxShadow: "none",
                          padding: "0.5rem 1rem",
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        disabled={item?.status}
                        onClick={() => {
                          setDeletedInfo(item);
                          setOpenModal(true);
                        }}
                        variant="contained"
                        size="small"
                        color={"error"}
                        sx={{
                          width: "100%",
                          textTransform: "none",
                          boxShadow: "none",
                          padding: "0.5rem 1rem",
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Modal
        open={openModal}
        onClose={() => {
          setDeletedInfo({});
          setOpenModal(false);
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to delete this application?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <Button
              disabled={deleteLoading}
              size="small"
              onClick={() => {
                setOpenModal(false);
                setDeletedInfo({});
              }}
              variant="contained"
              color="error"
              sx={{
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={deleteLoading}
              size="small"
              onClick={handleDeleteApplication}
              variant="contained"
              sx={{
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ApplicationsTable;
