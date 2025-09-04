// src/theme.js
import { extendTheme } from "@chakra-ui/react";

// Configure dark mode
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export default theme;
