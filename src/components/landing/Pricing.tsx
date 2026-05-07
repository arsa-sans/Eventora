"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Tag, Shield, CheckCircle, Headphones, Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templatesData";

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export function Pricing() {
  return (
    <section id="harga" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Bayar Sekali, <span className="text-primary">Aktif Selamanya</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Pilih template yang kamu suka, bayar sesuai harga template — semua fitur langsung aktif. Tanpa langganan bulanan.
          </p>
        </motion.div>

        {/* Template Price Cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
        >
          {templates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-border bg-white p-6 flex flex-col hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              {/* Theme color preview */}
              <div
                className="w-full h-28 rounded-xl mb-5 flex items-center justify-center overflow-hidden"
                style={{ background: t.bgColor, border: `1px solid ${t.accentColor}` }}
              >
                <div className="text-center">
                  <p className="font-serif font-bold text-lg" style={{ color: t.primaryColor }}>
                    {t.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: t.primaryColor, opacity: 0.6 }}>
                    Tema Pernikahan
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-foreground">{formatPrice(t.price)}</p>
                <p className="text-[11px] text-muted mt-1">per undangan</p>
              </div>

              {/* Features included */}
              <ul className="space-y-2 mb-6 flex-1">
                {["RSVP & Ucapan", "Countdown & Kalender", "Galeri Foto", "Lokasi Maps", "Unlimited Tamu"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted">
                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex gap-2">
                <Link href={`/tema/${t.id}/preview`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </Button>
                </Link>
                <Link href={`/register?theme=${t.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full text-xs gap-1">
                    <ShoppingBag className="w-3.5 h-3.5" /> Pilih
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 justify-center text-sm text-muted"
        >
          <span className="inline-flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" /> Pembayaran aman
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-primary" /> Aktif otomatis setelah bayar
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-primary" /> Support 07.00–24.00 WIB
          </span>
        </motion.div>
      </div>
    </section>
  );
}
