import { red } from "@mui/material/colors";
import { createTheme } from '@mui/material/styles';
import { Roboto } from "next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const theme = createTheme({
  palette: {
    primary: {
      main: "#003F79",
    },
    secondary: {
      main: "#80bcd8",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#003F79",
      paper: "#003F79",
    },
    text: {
      primary: "#fff",
      secondary: "#80bcd8",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: "3rem",
    },
    h2: {
      fontSize: "2rem",
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
              body {
                  background: linear-gradient(180deg, #008BC7, rgb(0, 44, 84));
              }
            `,
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: "rgba(255,255,255,0.2)",
          "&.Mui-completed": {
            color: "rgba(255,255,255,0.5)",
            text: {
              fill: "#003F79",
            },
          },
          "&.Mui-active": {
            color: "rgba(255,255,255,0.5)",
            text: {
              fill: "#003F79",
              fontWeight: 1000,
            },
              },
        },
      }
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          "&.Mui-completed": {
            color: "#80bcd8",
          },
        }
      }
    }
  },
});
