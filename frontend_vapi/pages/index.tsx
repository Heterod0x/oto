"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Portal from "../components/graphics/portal";

export default function LoginPage() {
  const router = useRouter();
  const { authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  // Client-side authentication check - redirect if already authenticated
  useEffect(() => {
    if (authenticated) {
      router.push("/dashboard");
    }
  }, [authenticated, router]);

  return (
    <>
      <Head>
        <title>Login · Privy</title>
      </Head>

      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-privy-light-blue flex-1 p-6 justify-center items-center">
          <div>
            <div>
              <Portal style={{ maxWidth: "100%", height: "auto" }} />
            </div>
            <div className="mt-6 flex justify-center text-center">
              <button
                className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
                onClick={login}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
