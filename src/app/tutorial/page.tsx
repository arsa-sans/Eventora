import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  UserPlus, Palette, FileEdit, CreditCard, Send,
  ArrowRight, CheckCircle, Heart
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Daftar Akun",
    description: "Buat akun Eventora menggunakan email atau akun Google. Prosesnya kurang dari 30 detik.",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    number: "02",
    icon: Palette,
    title: "Pilih Tema Undangan",
    description: "Jelajahi koleksi 4 tema pernikahan premium kami. Setiap tema dirancang dengan perhatian pada detail dan estetika.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    number: "03",
    icon: FileEdit,
    title: "Isi Data Pernikahan",
    description: "Isi informasi mempelai, detail acara, lokasi, love story, upload foto prewedding, dan atur rekening titip hadiah.",
    color: "#0284C7",
    bg: "#F0F9FF",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "Aktifkan Undangan",
    description: "Bayar sesuai harga template yang dipilih. Undangan langsung aktif dan siap dibagikan.",
    color: "#E11D48",
    bg: "#FFF1F2",
  },
  {
    number: "05",
    icon: Send,
    title: "Sebar ke Semua Tamu",
    description: "Bagikan link undangan personal ke setiap tamu via WhatsApp, Instagram, atau email. Pantau RSVP langsung dari dashboard.",
    color: "#D97706",
    bg: "#FFFBEB",
  },
];

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-light text-primary-dark text-xs font-semibold rounded-full mb-4">
              <Heart className="w-3 h-3" />
              Panduan Lengkap
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Cara Membuat Undangan{" "}
              <span className="text-primary">Digital</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Ikuti 5 langkah mudah berikut untuk membuat undangan pernikahan digital
              yang elegan dan siap dibagikan ke semua tamu.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8 mb-16">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex gap-6 items-start bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Icon */}
                  <div className="shrink-0">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
                      style={{ background: step.bg, border: `2px solid ${step.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: step.color }} />
                      <span
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                        style={{ background: step.color }}
                      >
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips Section */}
          <div className="bg-primary-50 rounded-2xl p-8 mb-16 border border-primary/10">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4">
              Tips Membuat Undangan yang Berkesan
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Upload foto prewedding beresolusi tinggi untuk hasil terbaik",
                "Isi love story agar tamu ikut merasakan perjalanan cintamu",
                "Tambahkan musik latar yang romantis dan bermakna",
                "Sertakan Google Maps agar tamu mudah menemukan lokasi",
                "Aktifkan fitur RSVP untuk memudahkan perencanaan acara",
                "Bagikan link undangan minimal 2 minggu sebelum hari-H",
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
              Siap Membuat Undangan?
            </h2>
            <p className="text-muted mb-6">
              Mulai buat undangan pernikahan digitalmu sekarang.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              style={{ background: "var(--gradient-cta)" }}
            >
              Mulai Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
