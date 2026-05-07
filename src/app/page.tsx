import { Navbar }           from "@/components/landing/Navbar";
import { Hero }             from "@/components/landing/Hero";
import { TemplateShowcase } from "@/components/landing/TemplateShowcase";
import { Features }         from "@/components/landing/Features";
import { HowItWorks }       from "@/components/landing/HowItWorks";
import { Pricing }          from "@/components/landing/Pricing";
import { Testimonials }     from "@/components/landing/Testimonials";
import { FAQ }              from "@/components/landing/FAQ";
import { Footer }           from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main>
        {/* 1. Hero — tagline, event type pills, floating mockup */}
        <Hero />

        {/* 2. Template Showcase — 8 cards with category filter */}
        <TemplateShowcase />

        {/* 4. Features — 14 feature cards grid */}
        <Features />

        {/* 5. How It Works — 3 steps */}
        <HowItWorks />

        {/* 6. Pricing — 6 tiers + feature comparison table */}
        <Pricing />

        {/* 7. Testimonials — auto-scroll carousel */}
        <Testimonials />

        {/* 8. FAQ — accordion */}
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
