import React, { FC, memo, Ref } from "react";

import "./style.scss";

import { InputAdornment, TextField, TextFieldProps } from "@mui/material";

import { ObjectKeysType } from "@/types";

interface ICustomInput {
  inputType?: "primary" | "secondary";
  isIconInput?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  iconInput?: React.ReactNode;
  sxStyles?: any;
  min?: number;
  max?: number;
  step?: number;
  variant?: string;
  maxRows?: number;
  padding?: number;
  inputRef?: Ref<HTMLInputElement>;
}

const CustomInput: FC<ICustomInput & TextFieldProps> = ({
  inputType = "primary",
  isIconInput = false,
  rows = 0,
  sxStyles,
  iconInput,
  maxLength,
  minLength,
  min,
  max,
  className,
  step,
  variant = "standard",
  inputRef,
  maxRows,
  padding,
  readOnly,
  ...inputRestParams
}) => {
  const style = {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderBottom: "none",
    ...sxStyles,
  };

  const customStyle: ObjectKeysType = {
    primary: {
      ...style,
      backgroundColor: "#F5F5F5",
    },
    secondary: {
      ...style,
    },
  };

  const MemoizedAdornment = memo(() => (
    <InputAdornment position="start">
      {iconInput || <span className={"wm-search"} />}
    </InputAdornment>
  ));

  return (
    <TextField
      {...inputRestParams}
      autoComplete="off"
      sx={customStyle[inputType]}
      variant={variant}
      className={`custom-input ${className || ""}`}
      rows={rows}
      maxRows={maxRows}
      inputProps={{
        maxLength,
        minLength,
        min,
        max,
        step,
        readOnly,
        style: {
          padding: isIconInput
            ? "0.5rem 0.5rem 0.5rem 0"
            : `${padding ?? 0.5}rem`,
        },
      }}
      inputRef={inputRef}
      InputProps={{
        startAdornment: isIconInput ? <MemoizedAdornment /> : null,
      }}
    />
  );
};

export default CustomInput;
