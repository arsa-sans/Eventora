"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, Zap, Flame, Sparkles, Palette, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templatesData";
import { createClient } from "@/lib/supabase";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function TemplateCard({ template, isLoggedIn }: { template: (typeof templates)[0]; isLoggedIn: boolean }) {
  const isDark = template.bgColor === "#0A0A0A" || template.bgColor === "#0F172A" || template.bgColor === "#1E1031";

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
        style={{ background: template.bgColor }}
      >
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 30%, ${template.primaryColor} 1px, transparent 1px),
              radial-gradient(circle at 70% 70%, ${template.accentColor} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Mock invitation content */}
        <div className="relative z-10 text-center px-6">
          <p className="text-xs tracking-[0.3em] uppercase mb-2 opacity-60"
            style={{ color: template.textColor }}>
            The Wedding of
          </p>
          <h3 className="text-2xl font-serif font-bold leading-tight"
            style={{ color: template.primaryColor }}>
            Ardy
            <br />&amp;<br />
            Dwivia
          </h3>
          <div className="mt-3 w-16 h-0.5 mx-auto rounded-full"
            style={{ background: template.primaryColor + "60" }} />
          <p className="text-xs mt-2 opacity-50" style={{ color: template.textColor }}>
            21 Juni 2026
          </p>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto z-10">
          <Link href={`/tema/${template.id}/preview`}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-foreground text-xs font-semibold rounded-full hover:bg-primary-50 transition-colors">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </Link>
          <Link href={isLoggedIn ? `/dashboard/invitations/new?theme=${template.id}` : `/register?theme=${template.id}`}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-semibold rounded-full transition-colors"
              style={{ background: template.primaryColor }}>
              <Zap className="w-3.5 h-3.5" /> Pakai
            </button>
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {template.isHot && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-rose text-white text-[10px] font-bold rounded-full">
              <Flame className="w-2.5 h-2.5" /> HOT
            </span>
          )}
          {template.isNew && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-blue text-white text-[10px] font-bold rounded-full">
              <Sparkles className="w-2.5 h-2.5" /> BARU
            </span>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-block px-2 py-0.5 bg-primary-light text-primary-dark text-[10px] font-semibold rounded-full mb-1.5">
              {template.categoryLabel}
            </span>
            <h4 className="font-semibold text-foreground text-sm">{template.name}</h4>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-foreground">
              {`Rp ${(template.price / 1000).toFixed(0)}rb`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TemplateShowcase() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
  }, []);

  return (
    <section id="template" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Pilih Tema yang Sesuai <span className="text-primary">Selera</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Dari elegan minimalis hingga mewah modern — temukan tema yang sempurna untuk hari pernikahanmu.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} isLoggedIn={!!user} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/tema">
            <Button variant="outline" size="lg" className="gap-2">
              Lihat Semua Tema
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
