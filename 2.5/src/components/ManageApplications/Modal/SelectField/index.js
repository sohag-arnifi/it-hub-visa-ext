import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Field } from "formik";
import React from "react";

const SelectField = ({ name, label, options }) => {
  return (
    <Box>
      <Field name={name}>
        {({ field, meta, form }) => {
          // const selectedOptions = options.find(
          //   (option) => option.value === field.value
          // );
          return (
            <FormControl size="small" fullWidth>
              <InputLabel id={name}>{label}</InputLabel>
              <Select
                {...field}
                labelId={name}
                label={label}
                sx={{ width: "100%" }}
                name={name}
                size="small"
                value={field.value}
                // displayEmpty
                // renderValue={() => {
                //   if (
                //     field.value === null ||
                //     field.value === undefined ||
                //     field.value === ""
                //   ) {
                //     return placeholder;
                //   }
                //   return field.value;
                // }}
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={{ disableScrollLock: true }}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={meta.touched && Boolean(meta.error)}
              >
                {options?.map((item, i) => {
                  return (
                    <MenuItem
                      key={i}
                      value={item?.value}
                      size="small"
                      sx={{
                        fontSize: { xs: "14px", md: "14px" },
                        fontWeight: 500,
                      }}
                    >
                      {item?.label}
                    </MenuItem>
                  );
                })}
              </Select>

              <FormHelperText error>
                {meta.touched && meta.error}
              </FormHelperText>
            </FormControl>
          );
        }}
      </Field>
    </Box>
  );
};

export default SelectField;
