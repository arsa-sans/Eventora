"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ElegantGold({ data }: { data: any }) {
  // Placeholder data for the theme
  const { groom_name = "Romeo", bride_name = "Juliet", event_date = "2026-12-31" } = data;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C3E50] font-sans">
      {/* Cover / Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 text-center">
        <div className="absolute top-0 left-0 w-full h-full border-[16px] border-[#D4AF37]/20 pointer-events-none z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-20 space-y-6"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-[#7F8C8D]">The Wedding Of</p>
          <h1 className="text-6xl md:text-8xl font-serif text-[#D4AF37] leading-none py-4">
            {groom_name} <br /> &amp; <br /> {bride_name}
          </h1>
          <p className="text-lg text-[#7F8C8D]">{new Date(event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </motion.div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-serif text-[#D4AF37]">RSVP &amp; Ucapan</h2>
          <p className="text-[#7F8C8D]">Kehadiran dan doa restu Anda adalah kado terindah bagi kami.</p>
          
          <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#EAECEE] text-left space-y-4 shadow-sm">
            <div>
              <label className="block text-sm mb-1 text-[#7F8C8D]">Nama Lengkap</label>
              <input type="text" className="w-full p-3 rounded-lg border border-[#EAECEE] outline-none focus:border-[#D4AF37]" placeholder="Masukkan nama..." />
            </div>
            <div>
              <label className="block text-sm mb-1 text-[#7F8C8D]">Kehadiran</label>
              <select className="w-full p-3 rounded-lg border border-[#EAECEE] outline-none focus:border-[#D4AF37]">
                <option value="yes">Hadir</option>
                <option value="no">Tidak Hadir</option>
                <option value="maybe">Masih Ragu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-[#7F8C8D]">Ucapan &amp; Doa</label>
              <textarea className="w-full p-3 rounded-lg border border-[#EAECEE] outline-none focus:border-[#D4AF37]" rows={4} placeholder="Tulis ucapan..."></textarea>
            </div>
            <Button className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white rounded-lg h-12">Kirim RSVP</Button>
          </div>
        </div>
      </section>

      {/* Titip Kado / Angpao */}
      <section className="py-24 px-4 bg-[#FDFBF7]">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-serif text-[#D4AF37]">Titip Kado / Angpao</h2>
          <p className="text-[#7F8C8D]">Bagi keluarga dan sahabat yang ingin mengirimkan hadiah, dapat mengirimkannya melalui tautan di bawah ini.</p>
          
          <div className="bg-white p-8 rounded-2xl border border-[#EAECEE] shadow-sm">
            <h3 className="text-xl font-medium mb-4">BCA - 1234567890</h3>
            <p className="text-[#7F8C8D] mb-6">a.n. Romeo Montague</p>
            <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] w-full rounded-lg">Salin Nomor Rekening</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
