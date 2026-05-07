"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Template", href: "/tema" },
  { label: "Tutorial", href: "/tutorial" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between max-w-7xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm font-serif">E</span>
            </div>
            <span className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
              Eventora<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-primary-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  {user.user_metadata?.full_name?.split(" ")[0] || "Akun"}
                </Link>
                <Link href="/dashboard">
                  <Button size="sm" variant="primary" className="gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  Masuk
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="primary">
                    Buat Undangan
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-button"
            aria-label="Buka menu"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-primary-50 text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-serif font-bold text-lg text-foreground">
                  Eventora<span className="text-primary">.</span>
                </span>
                <button
                  aria-label="Tutup menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-primary-50 text-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t border-border space-y-2">
                {user ? (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" size="default" className="w-full gap-1.5">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" size="default" className="w-full">
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button variant="primary" size="default" className="w-full">
                        Buat Undangan
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
