"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, Zap, Search, Flame, Sparkles, Palette, SearchX } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { templates, templateCategories } from "@/data/templatesData";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function TemplateCard({ t }: { t: (typeof templates)[0] }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-[4/3] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: t.bgColor }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${t.primaryColor} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 text-center px-6">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2 opacity-50"
            style={{ color: t.textColor }}>
            The Wedding of
          </p>
          <h3 className="text-2xl font-serif font-bold leading-tight"
            style={{ color: t.primaryColor }}>
            Ardy<br />&amp;<br />Dwivia
          </h3>
          <div className="mt-3 w-12 h-0.5 mx-auto rounded-full opacity-40"
            style={{ background: t.primaryColor }} />
          <p className="text-[10px] mt-2 opacity-40" style={{ color: t.textColor }}>
            21 Juni 2026 · Jakarta
          </p>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto z-10">
          <Link href={`/tema/${t.id}/preview`}>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-foreground text-xs font-semibold rounded-full hover:bg-primary-50 transition-colors shadow-md">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </Link>
          <Link href={`/register?theme=${t.id}`}>
            <button
              className="flex items-center gap-1.5 px-4 py-2 text-white text-xs font-semibold rounded-full shadow-md hover:opacity-90 transition-opacity"
              style={{ background: t.primaryColor }}
            >
              <Zap className="w-3.5 h-3.5" /> Pakai
            </button>
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {t.isHot && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-rose text-white text-[10px] font-bold rounded-full shadow-sm">
              <Flame className="w-2.5 h-2.5" /> HOT
            </span>
          )}
          {t.isNew && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-blue text-white text-[10px] font-bold rounded-full shadow-sm">
              <Sparkles className="w-2.5 h-2.5" /> BARU
            </span>
          )}
        </div>

        {/* Price badge top-right */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-black/40 text-white text-[10px] font-bold rounded-full backdrop-blur-sm">
            {`Rp ${(t.price / 1000).toFixed(0)}rb`}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="inline-block px-2 py-0.5 bg-primary-light text-primary-dark text-[10px] font-semibold rounded-full mb-1.5">
              {t.categoryLabel}
            </span>
            <h4 className="font-semibold text-foreground text-sm">{t.name}</h4>
          </div>
          <div className="flex gap-2 shrink-0">
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ background: t.primaryColor }}
              title="Warna utama"
            />
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ background: t.accentColor }}
              title="Warna aksen"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TemplateGalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = templates;
    if (activeCategory !== "all") {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.categoryLabel.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.includes(q))
      );
    }
    return list;
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner */}
      <section
        className="pt-28 pb-14 relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent-rose/6 blur-[80px]" />
        </div>
        <div className="relative container mx-auto px-4 md:px-6 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-light text-primary-dark text-xs font-semibold rounded-full mb-5">
              <Palette className="w-3 h-3" />
              4 Tema Pernikahan Premium
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Temukan Tema <span className="text-primary">Impianmu</span>
            </h1>
            <p className="text-muted text-lg max-w-xl mx-auto mb-8">
              Pilih dari koleksi tema undangan pernikahan premium — elegan, modern, dan siap pakai.
            </p>
            {/* Search bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                id="tema-search"
                placeholder="Cari tema undangan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {templateCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  activeCategory === cat.id
                    ? "bg-primary text-white border-primary shadow-sm shadow-primary/30"
                    : "bg-white text-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {cat.label}
                <span className="ml-1.5 text-xs opacity-60">
                  ({cat.id === "all"
                    ? templates.length
                    : templates.filter((t) => t.category === cat.id).length})
                </span>
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-muted mb-6">
            Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> tema
            {search && ` untuk "${search}"`}
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + search}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((t) => (
                <TemplateCard key={t.id} t={t} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24">
              <SearchX className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="font-semibold text-foreground mb-2">Tema tidak ditemukan</p>
              <p className="text-muted text-sm">
                Coba kata kunci lain atau pilih kategori berbeda
              </p>
            </div>
          )}

          {/* Custom theme CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 md:p-12 rounded-3xl text-center border border-primary/20 bg-primary-50"
          >
            <p className="text-2xl font-serif font-bold text-foreground mb-3">
              Tidak menemukan tema yang cocok?
            </p>
            <p className="text-muted mb-6 max-w-lg mx-auto">
              Tim desainer kami siap membuat tema custom sesuai keinginanmu — dari brief sederhana hingga referensi desain detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Request Tema Custom
                </Button>
              </Link>
              <a
                href="https://wa.me/6282114073679"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  Chat Admin WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
