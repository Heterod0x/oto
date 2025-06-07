import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FooterNavigation } from "../components/FooterNavigation";
import { TaskList } from "../components/TaskList";

export default function TasksPage() {
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
        <title>Tasks · VAPI</title>
        <meta name="description" content="View and manage your extracted tasks" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
        <TaskList />
        <FooterNavigation />
      </div>
    </>
  );
}
