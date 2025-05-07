import React, { FC } from "react";

import { ThemeProvider } from "@mui/material";

import { theme } from "@/assets/mui/mui-customize";

interface IThemProviderProps {
  children: React.ReactNode;
}

const ThemProvider: FC<IThemProviderProps> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemProvider;
