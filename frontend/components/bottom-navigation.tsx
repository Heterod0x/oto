"use client";

import { Button } from "@/components/ui/button";
import { History, Layers, Mic, Settings, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active icon based on current path
  const isActive = (path: string) => pathname === path;

  // Navigation items
  const navItems = [
    {
      path: "/ecosystem",
      icon: <Layers className="h-6 w-6" />,
      label: "Ecosystem",
    },
    {
      path: "/digital-twin",
      icon: <User className="h-6 w-6" />,
      label: "Digital Twin",
    },
    {
      path: "/record",
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-yellow-200 rounded-full opacity-50" />
          <Mic className="h-6 w-6 relative z-10" />
        </div>
      ),
      label: "Record",
    },
    {
      path: "/history",
      icon: <History className="h-6 w-6" />,
      label: "Conversation History",
    },
    {
      path: "/settings",
      icon: <Settings className="h-6 w-6" />,
      label: "Settings",
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
