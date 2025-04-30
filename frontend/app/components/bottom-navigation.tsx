"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Mic, History, Settings, User, Layers } from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  // 現在のパスに基づいてアクティブなアイコンを決定
  const isActive = (path: string) => pathname === path;

  // ナビゲーションアイテム
  const navItems = [
    {
      path: "/ecosystem",
      icon: <Layers className="h-6 w-6" />,
      label: "エコシステム",
    },
    {
      path: "/digital-twin",
      icon: <User className="h-6 w-6" />,
      label: "デジタルツイン",
    },
    {
      path: "/record",
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-yellow-200 rounded-full opacity-50" />
          <Mic className="h-6 w-6 relative z-10" />
        </div>
      ),
      label: "録音",
    },
    {
      path: "/history",
      icon: <History className="h-6 w-6" />,
      label: "会話履歴",
    },
    {
      path: "/settings",
      icon: <Settings className="h-6 w-6" />,
      label: "設定",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-muted/80 backdrop-blur-sm border-t">
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="icon"
            className={`rounded-full ${isActive(item.path) ? "bg-muted-foreground/10" : ""}`}
            onClick={() => router.push(item.path)}
            aria-label={item.label}
          >
            {item.path === "/record" && isActive(item.path) ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-yellow-300 rounded-full" />
                <Mic className="h-6 w-6 relative z-10" />
              </div>
            ) : (
              item.icon
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
