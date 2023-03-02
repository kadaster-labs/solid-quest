import { CacheProvider, EmotionCache } from "@emotion/react";
import { PaletteMode, useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import * as React from "react";
import createEmotionCache from "../src/createEmotionCache";
import { buildTheme } from "../src/theme";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// const darkModeTheme = createTheme(buildTheme('light'));

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // optionally a use sets the mode (not implemented yet)
  const [mode, setMode] = React.useState<PaletteMode>(prefersDarkMode ? 'dark' : 'light');

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(buildTheme(mode)), [mode]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}


