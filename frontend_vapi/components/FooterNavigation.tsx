import { usePrivy } from '@privy-io/react-auth';
import { FileText, LogOut, Mic } from 'lucide-react';
import { useRouter } from 'next/router';
import { cn } from '../lib/utils';

export interface FooterNavigationProps {
  className?: string;
}

/**
 * Footer navigation component
 * Floating navigation for screen transitions
 */
export function FooterNavigation({ className }: FooterNavigationProps) {
  const router = useRouter();
  const { logout } = usePrivy();
  const currentPath = router.pathname;

  // Navigation items definition
  const navigationItems = [
    {
      id: 'agent',
      label: 'Agent',
      icon: Mic,
      path: '/agent',
      isActive: currentPath === '/agent',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: FileText,
      path: '/tasks',
      isActive: currentPath === '/tasks',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      path: '/logout',
      isActive: false,
    },
  ];

  const handleNavigation = (path: string, id: string) => {
    if (id === 'logout') {
      // Call Privy's logout method
      logout();
      return;
    }
    router.push(path);
  };

  return (
    <footer 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 safe-area-inset-bottom",
        className
      )}
    >
      <nav className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200",
                "hover:bg-gray-100 active:scale-95",
                item.isActive
                  ? "bg-violet-100 text-violet-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "transition-transform duration-200",
                  item.isActive && "scale-110"
                )} 
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
