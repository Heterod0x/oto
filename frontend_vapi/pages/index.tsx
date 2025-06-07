"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Portal from "../components/graphics/portal";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => router.push("/agent"),
  });

  // Client-side authentication check - redirect if already authenticated
  useEffect(() => {
    if (authenticated) {
      router.push("/agent");
    }
  }, [authenticated, router]);

  return (
    <>
      <Head>
        <title>VAPI Voice Agent · Start Your Conversation</title>
      </Head>

      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-gradient-to-br from-blue-50 to-indigo-100 flex-1 p-6 justify-center items-center">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                VAPI Voice Agent
              </h1>
              <p className="text-gray-600">
                Experience seamless voice conversations with AI
              </p>
            </div>
            <div className="flex justify-center mb-8">
              <Portal style={{ maxWidth: "200px", height: "auto" }} />
            </div>
            <div className="flex justify-center">
              <Button
                onClick={login}
                className="w-full max-w-xs py-3 px-6 text-lg font-medium"
                size="lg"
              >
                Start Voice Chat
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
