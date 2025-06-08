import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AgentChat } from "../components/AgentChat";
import { FooterNavigation } from "../components/FooterNavigation";

/**
 * AgentPage component
 * @returns
 */
export default function AgentPage() {
  const router = useRouter();
  const { authenticated } = usePrivy();

  useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return null; // or a loading spinner
  }

  return (
    <>
      <Head>
        <title>Voice Agent · VAPI</title>
        <meta name="description" content="Have a voice conversation with your AI agent" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
        <AgentChat />
        <FooterNavigation />
      </div>
    </>
  );
}
