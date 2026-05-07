"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title = "Dashboard" }: HeaderProps) {
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
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
          A
        </div>
      </div>
    </header>
  );
}
