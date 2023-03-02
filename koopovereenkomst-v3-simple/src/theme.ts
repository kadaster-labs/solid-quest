import { PaletteMode } from "@mui/material";
import { red } from "@mui/material/colors";
import { Roboto } from "next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const commonTokens = {
  palette: {
    primary: {
      main: "#00889e",
    },
    secondary: {
      main: "#0f496f",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#06588e",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: "3rem",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
              body {
                  background: linear-gradient(180deg, #64d4ef, #06588e);
              }
              @media (prefers-color-scheme: dark) {
                  body {
                    background: linear-gradient(180deg, #06588e, black);
                  }
                }
            `,
    },
  },
};

export const buildTheme = (mode: PaletteMode) => {
  //   let t = {
  //       ...getDesignTokens(mode),
  //     ...commonTokens,
  //   };
  let t = merge(commonTokens, getDesignTokens(mode));
  console.log(t);
  return t;
};

// support light and dark theme modes
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    text: {
      ...(mode === "light"
        ? {
            primary: "#fff",
            secondary: "#000",
          }
        : {
            primary: "#fff",
            secondary: "#ccc",
          }),
    },
  },
});

// Merge a `source` object to a `target` recursively
const merge = (target, source) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object)
      Object.assign(source[key], merge(target[key], source[key]));
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
};
