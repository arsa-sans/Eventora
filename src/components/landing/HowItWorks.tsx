"use client";

import { motion } from "framer-motion";
import { UserPlus, LayoutTemplate, Send, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Daftar & Pilih Template",
    description:
      "Buat akun, lalu pilih template undangan pernikahan yang sesuai selera.",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    number: "02",
    icon: LayoutTemplate,
    title: "Isi Data Acara",
    description:
      "Isi detail acara: nama mempelai, tanggal, lokasi, foto galeri, dan musik latar.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    number: "03",
    icon: Send,
    title: "Bayar & Sebar Undangan",
    description:
      "Bayar sesuai harga template, lalu bagikan link personal ke semua tamu via WhatsApp, Instagram, atau email.",
    color: "#E11D48",
    bg: "#FFF1F2",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-16 md:py-24" style={{ background: "var(--primary-50)" }}>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Cara Membuat Undangan{" "}
            <span className="text-primary">Sangat Mudah</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Hanya 3 langkah sederhana untuk memiliki undangan digital yang
            indah dan siap disebarkan.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 border-t-2 border-dashed border-primary/25 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step circle */}
                  <div className="relative mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-0"
                      style={{ background: step.bg, border: `2px solid ${step.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: step.color }} />
                    </div>
                    {/* Number badge */}
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-sm"
                      style={{ background: step.color }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-border w-full">
                    <h3 className="font-semibold text-foreground text-base mb-3 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted text-sm mb-4">
            Anti rugi! Dibuatkan admin dulu, bayar setelah jadi dan suka hasilnya.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            style={{ background: "var(--gradient-cta)" }}
          >
            Mulai Sekarang
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
