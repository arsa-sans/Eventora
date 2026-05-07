"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Mail, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Undangan", href: "/dashboard/invitations", icon: Mail },
  { name: "RSVP", href: "/dashboard/rsvp", icon: Users },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border lg:hidden safe-area-inset-bottom">
      <div className="grid grid-cols-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 px-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-text-secondary hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "scale-110 transition-transform")} />
              <span className="font-medium">{link.name}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
