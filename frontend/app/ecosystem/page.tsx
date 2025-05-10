"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

// アプリケーションの型定義
interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function EcosystemPage() {
  // ダミーアプリケーションデータ
  const apps: App[] = [
    {
      id: "1",
      name: "App Name",
      description: "Description Description Description Description Description Description",
      icon: "/icons/logo.jpeg?height=80&width=80",
    },
    {
      id: "2",
      name: "App Name",
      description: "Description Description Description Description Description Description",
      icon: "/icons/logo.jpeg?height=80&width=80",
    },
    {
      id: "3",
      name: "App Name",
      description: "Description Description Description Description Description Description",
      icon: "/icons/logo.jpeg?height=80&width=80",
    },
    {
      id: "4",
      name: "App Name",
      description: "Description Description Description Description Description Description",
      icon: "/icons/logo.jpeg?height=80&width=80",
    },
    {
      id: "5",
      name: "App Name",
      description: "Description Description Description Description Description Description",
      icon: "/icons/logo.jpeg?height=80&width=80",
    },
    {
      id: "6",
      name: "App Name",
      description: "Description Description Description Description Description Description",
      icon: "/icons/logo.jpeg?height=80&width=80",
    },
  ];

  return (
    <div className="container p-4">
      <div className="grid grid-cols-2 gap-4">
        {apps.map((app) => (
          <Link href="#" key={app.id}>
            <Card className="h-full">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl border mb-2 flex items-center justify-center overflow-hidden">
                  <Image
                    src={app.icon || "/placeholder.svg"}
                    alt={app.name}
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className="font-medium text-center">{app.name}</h3>
                <p className="text-xs text-muted-foreground text-center line-clamp-3">
                  {app.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
