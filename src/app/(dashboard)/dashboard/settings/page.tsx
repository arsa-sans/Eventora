"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { User, Mail, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-border text-center shadow-sm">
        <p className="text-muted">Tidak dapat memuat data pengguna.</p>
      </div>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url;
  const fullName = user.user_metadata?.full_name || "Pengguna Eventora";
  const email = user.email;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif text-foreground">Pengaturan Akun</h2>
        <p className="text-text-secondary mt-1 text-sm md:text-base">Lihat profil dan kelola informasi Anda.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-border flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-primary" />
            )}
          </div>
          
          <div className="text-center sm:text-left space-y-1.5">
            <h4 className="text-2xl font-serif font-medium text-foreground">{fullName}</h4>
            <p className="text-muted flex items-center justify-center sm:justify-start gap-1.5 text-sm">
              <Mail className="w-4 h-4" /> {email}
            </p>
            <span className="inline-block mt-2 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Terverifikasi
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-gray-50/50">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                value={fullName}
                disabled
                className="w-full h-11 px-4 rounded-xl border border-border bg-gray-100 text-text-secondary outline-none cursor-not-allowed font-medium"
              />
              <p className="text-[11px] text-muted mt-2">
                Anda menggunakan otentikasi Google, nama disinkronkan secara otomatis.
              </p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Alamat Email</label>
              <input 
                type="email" 
                value={email || ""}
                disabled
                className="w-full h-11 px-4 rounded-xl border border-border bg-gray-100 text-text-secondary outline-none cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex justify-end">
             <Button variant="primary" disabled className="gap-2">
               <Save className="w-4 h-4" />
               Simpan Profil
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
