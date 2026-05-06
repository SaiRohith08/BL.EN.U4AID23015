import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565c0"
    },
    secondary: {
      main: "#6a1b9a"
    },
    background: {
      default: "#f5f7fb"
    }
  },
  shape: {
    borderRadius: 12
  }
});

export default theme;
