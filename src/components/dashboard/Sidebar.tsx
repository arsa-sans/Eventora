"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Mail, Users, Settings, LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Undangan Saya', href: '/dashboard/invitations', icon: Mail },
    { name: 'Data RSVP', href: '/dashboard/rsvp', icon: Users },
    { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-white border-r border-border flex flex-col z-50 transition-transform duration-300",
          // Mobile: slide in/out; Desktop: always visible
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo row */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link href="/" className="text-2xl font-serif text-primary font-bold" onClick={onClose}>
            Eventora.
          </Link>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 text-text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary hover:bg-gray-50 hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
