"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast";

function RegisterContent() {
  const searchParams = useSearchParams();
  const selectedTheme = searchParams.get("theme");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState(false);
  const { success, error: toastError } = useToast();

  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError("Password minimal 6 karakter."); return; }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?redirectTo=/dashboard`,
      },
    });

    if (error) {
      const msg = error.message.includes("already registered")
        ? "Email sudah terdaftar. Silakan login."
        : error.message;
      setError(msg);
      toastError("Registrasi Gagal", msg);
      setLoading(false);
    } else {
      setSuccessStatus(true);
      success("Registrasi Berhasil! 🎉", "Silakan cek email kamu untuk verifikasi.");
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?redirectTo=/dashboard`,
      },
    });
    if (error) { 
      setError("Gagal daftar dengan Google."); 
      toastError("Registrasi Google Gagal", "Terjadi kesalahan saat mendaftar dengan Google.");
      setLoading(false); 
    }
  }

  if (successStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--gradient-hero)" }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-border p-10 max-w-md text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-serif font-bold text-foreground mb-2">Cek Email Kamu</h2>
          <p className="text-sm text-muted leading-relaxed mb-6">
            Kami sudah mengirim link konfirmasi ke <strong className="text-foreground">{email}</strong>.
            Klik link tersebut untuk mengaktifkan akun dan mulai membuat undangan.
          </p>
          <Link href="/login">
            <Button variant="primary" size="default">Kembali ke Login</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-hero)" }}>
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden"
        style={{ background: "var(--gradient-cta)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 text-white px-16 max-w-lg">
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold font-serif text-lg">E</span>
            </div>
            <span className="text-2xl font-serif font-bold">Eventora<span className="text-primary-light">.</span></span>
          </Link>
          <h2 className="text-3xl font-serif font-bold leading-snug mb-4">
            Buat undangan digital impianmu sekarang
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Daftar akun, pilih tema, isi data acara, dan sebarkan undangan dalam hitungan menit.
          </p>
          <div className="space-y-3 text-sm text-white/60">
            <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-primary-light" /> Mulai dari Rp 39rb per undangan</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-primary-light" /> 4 tema pernikahan premium</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-primary-light" /> Bayar sekali, aktif selamanya</div>
          </div>
          {selectedTheme && (
            <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20">
              <p className="text-xs text-white/50 mb-1">Tema yang dipilih:</p>
              <p className="text-white font-semibold text-sm">{selectedTheme.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Right — Register form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-white font-bold font-serif">E</span>
              </div>
              <span className="text-xl font-serif font-bold text-foreground">Eventora<span className="text-primary">.</span></span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-border p-8 md:p-10">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-1">Buat Akun Baru</h1>
            <p className="text-sm text-muted mb-8">Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">Masuk di sini</Link>
            </p>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1" /> {error}
              </div>
            )}

            {/* Google button */}
            <button onClick={handleGoogleRegister} disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-border bg-white text-foreground text-sm font-semibold hover:bg-background transition-colors mb-5 disabled:opacity-50">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Daftar dengan Google
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-border" /><span className="text-xs text-muted font-medium">atau daftar dengan email</span><div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-semibold text-muted mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input id="reg-name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap kamu"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" />
                </div>
              </div>
              <div>
                <label htmlFor="reg-email" className="block text-xs font-semibold text-muted mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input id="reg-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" />
                </div>
              </div>
              <div>
                <label htmlFor="reg-pw" className="block text-xs font-semibold text-muted mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input id="reg-pw" type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full h-12 pl-10 pr-11 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" />
                  <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && password.length < 6 && (
                  <p className="text-[11px] text-accent-rose mt-1">Password minimal 6 karakter</p>
                )}
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading || password.length < 6}>
                {loading ? "Memproses..." : "Buat Akun"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-muted mt-6">
            Dengan mendaftar, kamu menyetujui{" "}
            <Link href="/syarat-ketentuan" className="underline hover:text-primary">Syarat & Ketentuan</Link> dan{" "}
            <Link href="/privasi" className="underline hover:text-primary">Kebijakan Privasi</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
