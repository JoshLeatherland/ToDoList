import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#141F2F",
    },
    secondary: {
      main: "#205D5E",
    },
    backgrounds: {
      main: "#f5f5f5",
      column: "#fff",
    },
    tasks: {
      completed: "#f0f4ff",
      active: "#F5F8FF",
      text: {
        completed: "gray",
        active: "black",
      },
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

export default theme;
