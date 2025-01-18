import { Box, Button, TextField, Typography, Modal } from "@mui/material";
import React, { useState } from "react";
import FormModal from "./Modal";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "../../redux/store/index";
import {
  useCreateNewApplicationMutation,
  useGetAllApplicationsQuery,
  useUpdateApplicationMutation,
} from "../../redux/features/application/applicationApi";
import ApplicationsTable from "./ApplicationsTable";

const validationSchema = Yup.object({
  center: Yup.string().required("Mission is required"),
  ivac: Yup.string().required("IVAC is required"),
  visaType: Yup.string().required("Visa Type is required"),
  email: Yup.string()
    .email("Pleaes enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Enter a valid number")
    .length(11, "Phone must be exactly 11 characters")
    .required("Phone number is required"),
  paymentMethod: Yup.string().required("Payment Method is required"),
  paymentNumber: Yup.string()
    .matches(/^\d+$/, "Enter a valid number")
    .length(11, "Phone must be exactly 11 characters")
    .required("Phone number is required"),
  info: Yup.array().of(
    Yup.object().shape({
      web_id: Yup.string().required("Web ID is required"),
      name: Yup.string().required("Name is required"),
    })
  ),
  paymentAmount: Yup.string().required("Payment Amount is required"),
});

const emptyInidialvalues = {
  companyId: "",
  assignTo: "",
  center: "",
  ivac: "",
  visaType: "",
  phone: "",
  email: "",
  info: [
    {
      web_id: "",
      name: "",
    },
  ],
  paymentMethod: "",
  paymentNumber: "",
  paymentAmount: 0,
};

const ManageApplications = () => {
  const [openModal, setOpenModal] = useState(false);
  const [initialValues, setInitialValues] = useState(emptyInidialvalues);
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetAllApplicationsQuery();

  const totalApplications = data?.data?.length ?? 0;
  const completedApplications =
    data?.data?.filter((item) => item?.status)?.length ?? 0;
  const pendingApplications =
    data?.data?.filter((item) => !item?.status)?.length ?? 0;

  const [createNewApplication, { isLoading: createLoading }] =
    useCreateNewApplicationMutation();
  const [updateApplication, { isLoading: updateLoading }] =
    useUpdateApplicationMutation();

  const handleSubmit = async (values) => {
    const data = {
      ...values,
      companyId: user?.companyId?._id,
      assignTo: user?._id,
    };
    try {
      if (!initialValues?.status) {
        let response;
        if (initialValues?._id) {
          response = await updateApplication(data).unwrap();
        } else {
          response = await createNewApplication(data).unwrap();
        }

        if (response?.success) {
          setOpenModal(false);
          setInitialValues(emptyInidialvalues);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setInitialValues(emptyInidialvalues);
  };

  return (
    <Box>
      <Box>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          Manage Applications
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>
              Total - {totalApplications}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>
              Completed - {completedApplications}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>
              Pending - {pendingApplications}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: "10px" }}>
            <TextField label="Search" about="Search" size="small" />
            <Button
              onClick={() => setOpenModal(true)}
              size="small"
              variant="contained"
              sx={{
                textTransform: "none",
                boxShadow: "none",
                paddingX: "20px",
              }}
            >
              Add New
            </Button>
          </Box>
        </Box>
      </Box>

      <ApplicationsTable
        isLoading={isLoading}
        data={data?.data}
        setOpenUpdateModal={setOpenModal}
        setUpdatedValues={setInitialValues}
      />

      <Modal open={openModal}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {() => (
            <Form>
              <FormModal
                handleModalClose={handleModalClose}
                isLoading={createLoading || updateLoading}
                initialValues={initialValues}
              />
            </Form>
          )}
        </Formik>
      </Modal>
    </Box>
  );
};

export default ManageApplications;
