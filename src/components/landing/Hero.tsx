"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

export function Hero() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
  }, []);

  const ctaHref = user ? "/dashboard/invitations/new" : "/register";

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      style={{
        backgroundImage: "url('/hero.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative container mx-auto px-4 md:px-6 max-w-4xl py-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-6 border border-white/30"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Platform Undangan Pernikahan Digital #1
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.1] mb-6"
        >
          Undangan Pernikahan Digital yang{" "}
          <span className="text-emerald-300">Tak Terlupakan</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/80 text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
        >
          Buat undangan pernikahan digital elegan dalam 5 menit.
          Pilih dari 4 tema premium, RSVP online, countdown, galeri foto prewedding,
          love story, dan banyak fitur lainnya.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href={ctaHref}>
            <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2">
              <Heart className="w-4 h-4" />
              Buat Undangan Sekarang
            </Button>
          </Link>
          <Link href="/tema">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white/20">
              Lihat Semua Tema
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex flex-wrap gap-4 justify-center text-xs text-white/70"
        >
          {["Mulai dari Rp 39rb", "Bayar sekali saja", "Aktif selamanya"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
