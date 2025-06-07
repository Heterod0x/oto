import { PrivyProvider } from "@privy-io/react-auth";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import { PWAInstallPrompt } from "../components/PWAInstallPrompt";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff2"
          as="font"
          crossOrigin=""
        />

        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/manifest.json" />

        <title>VAPI Voice Agent</title>
        <meta name="description" content="AI-powered voice conversations with task extraction and calendar integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VAPI Agent" />
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          embeddedWallets: {
            createOnLogin: "all-users",
          },
        }}
      >
        <Component {...pageProps} />
        {showInstallPrompt && (
          <PWAInstallPrompt onClose={() => setShowInstallPrompt(false)} />
        )}
      </PrivyProvider>
    </>
  );
}

export default MyApp;
