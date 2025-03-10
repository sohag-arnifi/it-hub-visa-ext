import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import SelectField from "./SelectField";
import { centers, ivacs, paymentMethod, visaTypes } from "../../../constanse";
import InputField from "./InputField";
import { useAppSelector } from "../../../redux/store";
import FormRadioField from "./RadioField";

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  boxShadow: "none",
  padding: "0.5rem 1rem",
  borderRadius: "5px",
  fontSize: "14px",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  minHight: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  border: "none",
  padding: "1rem",
  borderRadius: "5px",
};

const FormModal = ({ handleModalClose, isLoading, initialValues }) => {
  const { values, setFieldValue } = useFormikContext();
  const { companyId } = useAppSelector((state) => state?.auth?.user);

  const selectedIvacs = ivacs?.filter(
    (item) => item?.center_info_id === values?.center
  );

  const handleAddFile = () => {
    if (values?.info?.length < 5) {
      setFieldValue("info", [...values?.info, { web_id: "", name: "" }]);
    }
  };

  const handleRemoveFile = (index) => {
    const arr = [...values?.info];
    arr.splice(index, 1);
    setFieldValue("info", arr);
  };

  useEffect(() => {
    if (values?.info?.length) {
      setFieldValue(
        "paymentAmount",
        values?.info?.length * companyId?.tokenAmount
      );
    }
  }, [values?.info?.length]);

  return (
    <Box sx={{ ...style }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ fontSize: "1rem", fontWeight: 700, paddingY: "10px" }}
        >
          {initialValues?._id ? "Update" : "Create New"} Application
        </Typography>

        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            paddingY: "10px",
            color: "red",
          }}
        >
          BDT: {values?.paymentAmount.toLocaleString("en-US")}
        </Typography>
      </Box>

      <Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <SelectField
              name="center"
              label="Select a mission"
              options={centers?.map((item) => ({
                value: item?.id,
                label: item?.c_name,
              }))}
            />
          </Grid>

          <Grid item xs={4}>
            <SelectField
              name="ivac"
              label="Select IVAC Center"
              options={selectedIvacs?.map((item) => ({
                value: item?.id,
                label: item?.ivac_name,
              }))}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectField
              name="visaType"
              label="Visa Type"
              options={visaTypes?.map((item) => ({
                value: item?.id,
                label: item?.type_name,
              }))}
            />
          </Grid>

          <Grid item xs={4}>
            <InputField name="email" label="Enter Email" type="email" />
          </Grid>

          <Grid item xs={4}>
            <InputField name="phone" label="Enter Phone Number" type="number" />
          </Grid>
          <Grid item xs={4}>
            <InputField name="password" label="Enter Password" />
          </Grid>

          {values?.info?.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <InputField
                    name={`info.${index}.web_id`}
                    label="Enter Web ID"
                  />
                </Grid>
                <Grid item xs={5}>
                  <InputField name={`info.${index}.name`} label="Enter Name" />
                </Grid>
                <Grid item xs={2}>
                  {index === 0 ? (
                    <StyledButton variant="contained" onClick={handleAddFile}>
                      Add File
                    </StyledButton>
                  ) : (
                    <StyledButton
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Remove
                    </StyledButton>
                  )}
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Box sx={{ paddingX: "16px", width: "100%" }}>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "red",
              }}
            >
              Note: Please make sure 1st Application must be Account Holder.
            </Typography>
          </Box>

          <Grid item xs={5}>
            <InputField name="visit_purpose" label="Visit Purpose" />
          </Grid>

          <Grid item xs={4}>
            <SelectField
              name="paymentMethod"
              label="Payment Method"
              options={paymentMethod?.map((item) => ({
                value: item?.slug,
                label: item?.name,
              }))}
            />
          </Grid>
          {values?.paymentMethod === "dbblmobilebanking" ? (
            <>
              <Grid item xs={12}>
                <FormRadioField
                  inline={true}
                  name="autoPayment"
                  label="Are you went to automated payment?"
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                />
              </Grid>

              {values?.autoPayment ? (
                <>
                  <Grid item xs={3}>
                    <InputField
                      name="accountNumber"
                      label="Enter Account Number"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputField name="pinNumber" label="Enter Pin" />
                  </Grid>
                </>
              ) : null}
            </>
          ) : null}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Stack direction={"row"} spacing={2}>
            <StyledButton
              disabled={isLoading}
              variant="contained"
              color="error"
              onClick={handleModalClose}
            >
              Cancle
            </StyledButton>

            <StyledButton
              disabled={isLoading}
              type="submit"
              size="small"
              variant="contained"
              sx={{ width: "100px" }}
            >
              {isLoading ? (
                <CircularProgress
                  color="primary"
                  size={24}
                  sx={{
                    color: "white",
                  }}
                />
              ) : initialValues?._id ? (
                "Update"
              ) : (
                "Create"
              )}
            </StyledButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default FormModal;
