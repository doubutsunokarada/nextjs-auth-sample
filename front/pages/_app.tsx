import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { theme, darkTheme } from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { useMediaQuery } from "@mui/material";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = ({
  Component,
  pageProps: { session, ...pageProps },
  emotionCache,
}: MyAppProps) => {
  emotionCache = clientSideEmotionCache;
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SessionProvider session={session} refetchInterval={0}>
        <ThemeProvider theme={isDark ? darkTheme : theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </CacheProvider>
  );
};

export default App;
