"use client";

import { useState, useEffect } from "react";
import { Menu, User } from "lucide-react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title = "Dashboard" }: HeaderProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });
  }, []);

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Hamburger - mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-text-secondary transition-colors"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-medium text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/dashboard/settings" className="block w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all">
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
          ) : user?.user_metadata?.full_name ? (
            <span className="text-primary font-medium text-sm">
              {user.user_metadata.full_name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="w-4 h-4 text-primary" />
          )}
        </Link>
      </div>
    </header>
  );
}
