"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowLeft, Smartphone, Monitor, Zap, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templatesData";
import type { InvitationData } from "@/types/invitation";

// Dynamic import all available theme components
const themeComponents: Record<string, React.ComponentType<{ data: InvitationData }>> = {
  "emerald-garden": dynamic(() => import("@/components/themes/EmeraldGarden").then((m) => m.EmeraldGarden)),
  "rose-blush": dynamic(() => import("@/components/themes/RoseBlush").then((m) => m.RoseBlush)),
  "midnight-noir": dynamic(() => import("@/components/themes/MidnightNoir").then((m) => m.MidnightNoir)),
  "minimalist-white": dynamic(() => import("@/components/themes/MinimalistWhite").then((m) => m.MinimalistWhite)),
};

interface Props {
  templateId: string;
  templateName: string;
  templatePrice: number;
  templateCategory: string;
  hasThemeComponent: boolean;
  sampleData: InvitationData;
}

export function PreviewWrapper({ templateId, templateName, templatePrice, templateCategory, hasThemeComponent, sampleData }: Props) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [showInfoBar, setShowInfoBar] = useState(true);

  const ThemeComponent = themeComponents[templateId];
  const template = templates.find((t) => t.id === templateId);

  // Find prev/next templates for navigation
  const currentIdx = templates.findIndex((t) => t.id === templateId);
  const prevTemplate = currentIdx > 0 ? templates[currentIdx - 1] : null;
  const nextTemplate = currentIdx < templates.length - 1 ? templates[currentIdx + 1] : null;

  // Auto-hide info bar after scroll
  useEffect(() => {
    const timer = setTimeout(() => setShowInfoBar(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // If we have a real theme component, render it in a device frame
  if (ThemeComponent) {
    return (
      <div className="min-h-screen bg-[#111] flex flex-col">
        {/* Top bar */}
        <div className="bg-[#1A1A1A] border-b border-white/10 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/tema" className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Link>
              <div className="hidden sm:block h-5 w-px bg-white/10" />
              <div className="hidden sm:block">
                <p className="text-white text-sm font-semibold">{templateName}</p>
                <p className="text-white/40 text-xs">{templateCategory} · Rp {(templatePrice / 1000).toFixed(0)}rb</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
                <button onClick={() => setViewMode("mobile")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "mobile" ? "bg-primary text-white" : "text-white/50 hover:text-white"}`}>
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
                <button onClick={() => setViewMode("desktop")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "desktop" ? "bg-primary text-white" : "text-white/50 hover:text-white"}`}>
                  <Monitor className="w-3.5 h-3.5" /> Desktop
                </button>
              </div>

              <Link href={`/register?theme=${templateId}`}>
                <Button size="sm" variant="primary" className="text-xs">
                  <Zap className="w-3.5 h-3.5" /> Pakai Tema Ini
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Device Frame */}
        <div className="flex-1 flex items-start justify-center py-6 px-4 overflow-auto">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`bg-white shadow-2xl overflow-hidden ${
              viewMode === "mobile"
                ? "w-[375px] rounded-[2.5rem] border-[8px] border-[#222] relative"
                : "w-full max-w-5xl rounded-xl border border-white/10"
            }`}
            style={{ maxHeight: viewMode === "mobile" ? "812px" : "none" }}
          >
            {/* Notch for mobile */}
            {viewMode === "mobile" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-[#222] rounded-b-2xl z-50" />
            )}
            <div className={`overflow-y-auto ${viewMode === "mobile" ? "h-[796px]" : ""}`}>
              <ThemeComponent data={sampleData} />
            </div>
          </motion.div>
        </div>

        {/* Bottom navigation bar */}
        <div className="bg-[#1A1A1A] border-t border-white/10 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {prevTemplate ? (
              <Link href={`/tema/${prevTemplate.id}/preview`}
                className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
                <ChevronLeft className="w-4 h-4" /> {prevTemplate.name}
              </Link>
            ) : <div />}
            <p className="text-white/30 text-xs">
              {currentIdx + 1} dari {templates.length} tema
            </p>
            {nextTemplate ? (
              <Link href={`/tema/${nextTemplate.id}/preview`}
                className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
                {nextTemplate.name} <ChevronRight className="w-4 h-4" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>
    );
  }

  // Fallback: No component yet — show color preview
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/tema" className="flex items-center gap-1.5 text-muted hover:text-foreground text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Tema
          </Link>
          <Link href={`/register?theme=${templateId}`}>
            <Button size="sm" variant="primary" className="text-xs">
              <Zap className="w-3.5 h-3.5" /> Pakai Tema Ini
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Color swatch preview */}
        <div className="mb-8 mx-auto w-64 aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-[6px] border-foreground/10"
          style={{ background: template?.bgColor }}>
          <div className="h-full flex flex-col items-center justify-center px-8">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `radial-gradient(circle, ${template?.primaryColor} 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
            <p className="text-xs tracking-[0.3em] uppercase font-semibold opacity-50 mb-4"
              style={{ color: template?.textColor }}>
              The Wedding of
            </p>
            <h2 className="text-4xl font-serif font-bold leading-tight mb-1"
              style={{ color: template?.primaryColor }}>
              Ardy
            </h2>
            <p className="text-xl opacity-40 my-1" style={{ color: template?.textColor }}>&amp;</p>
            <h2 className="text-4xl font-serif font-bold leading-tight"
              style={{ color: template?.primaryColor }}>
              Dwivia
            </h2>
            <div className="w-16 h-0.5 mt-4 rounded-full opacity-40"
              style={{ background: template?.primaryColor }} />
            <p className="text-xs mt-3 opacity-40" style={{ color: template?.textColor }}>21 Juni 2026</p>
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">{templateName}</h1>
        <p className="text-muted text-sm mb-2">{templateCategory}</p>
        <p className="text-lg font-bold text-primary mb-6">
          Rp {templatePrice.toLocaleString("id-ID")}
        </p>

        {/* Color palette display */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl border-2 border-white shadow-md" style={{ background: template?.primaryColor }} />
            <span className="text-[10px] text-muted">Primary</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl border-2 border-white shadow-md" style={{ background: template?.accentColor }} />
            <span className="text-[10px] text-muted">Accent</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl border-2 border-white shadow-md" style={{ background: template?.bgColor }} />
            <span className="text-[10px] text-muted">Background</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl border-2 border-white shadow-md" style={{ background: template?.textColor }} />
            <span className="text-[10px] text-muted">Text</span>
          </div>
        </div>

        <p className="text-muted text-sm mb-8">
          Preview interaktif untuk tema ini sedang dalam pengembangan.<br />
          Kamu tetap bisa langsung menggunakan tema ini untuk undanganmu!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/register?theme=${templateId}`}>
            <Button variant="primary" size="lg">
              <Zap className="w-4 h-4" /> Pakai Tema Ini
            </Button>
          </Link>
          <Link href="/tema">
            <Button variant="outline" size="lg">
              <Eye className="w-4 h-4" /> Lihat Tema Lain
            </Button>
          </Link>
        </div>

        {/* Prev/Next */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          {prevTemplate ? (
            <Link href={`/tema/${prevTemplate.id}/preview`} className="text-sm text-muted hover:text-primary transition-colors">
              ← {prevTemplate.name}
            </Link>
          ) : <div />}
          {nextTemplate ? (
            <Link href={`/tema/${nextTemplate.id}/preview`} className="text-sm text-muted hover:text-primary transition-colors">
              {nextTemplate.name} →
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
