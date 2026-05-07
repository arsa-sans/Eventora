"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonialsData";

// Duplicate for seamless loop
const allTestimonials = [...testimonials, ...testimonials];

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const speed = 0.4; // px per frame
    const animate = () => {
      if (!isPaused && trackRef.current) {
        posRef.current += speed;
        const half = trackRef.current.scrollWidth / 2;
        if (posRef.current >= half) posRef.current = 0;
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused]);

  return (
    <section id="testimoni" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Apa Pendapat{" "}
            <span className="text-primary">Pengguna</span>
            ?
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Dengarkan pengalaman nyata dari pelanggan yang sudah menggunakan Eventora untuk acara spesial mereka.
          </p>
        </motion.div>
      </div>

      {/* Carousel — full width */}
      <div
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, white, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }} />

        <div className="overflow-hidden">
          <div ref={trackRef} className="flex gap-5 will-change-transform" style={{ width: "max-content" }}>
            {allTestimonials.map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="w-72 shrink-0 bg-background rounded-2xl border border-border p-6 relative"
              >
                {/* Quote icon */}
                <Quote className="w-6 h-6 text-primary/20 absolute top-4 right-4" />

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 fill-accent-amber text-accent-amber" />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-foreground/80 text-sm leading-relaxed mb-5 line-clamp-3">
                  "{t.review}"
                </p>

                {/* Customer */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-none">{t.name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary-light text-primary-dark text-[10px] font-semibold rounded-full">
                      {t.eventType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
