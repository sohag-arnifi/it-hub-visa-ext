import { Box, FormHelperText, TextField } from "@mui/material";
import { Field } from "formik";
import React from "react";

const InputField = ({ name, label, type = "text" }) => {
  return (
    <Box>
      <Field name={name} type={type}>
        {({ field, meta }) => {
          return (
            <>
              <TextField
                label={label}
                size="small"
                {...field}
                type={type === "number" ? "text" : type}
                variant="outlined"
                sx={{ width: "100%" }}
              />
              <FormHelperText error>
                {meta.touched && meta.error}
              </FormHelperText>
            </>
          );
        }}
      </Field>
    </Box>
  );
};

export default InputField;
