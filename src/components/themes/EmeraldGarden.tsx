"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Music, ChevronDown, Copy, Check, Leaf, Heart, Mail } from "lucide-react";
import type { InvitationData } from "@/types/invitation";

interface Props {
  data: InvitationData;
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "Hari",   value: time.d },
    { label: "Jam",    value: time.h },
    { label: "Menit",  value: time.m },
    { label: "Detik",  value: time.s },
  ];

  return (
    <div className="flex gap-3 justify-center">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{ background: "#059669", color: "#fff" }}>
            {String(value).padStart(2, "0")}
          </div>
          <p className="text-[10px] mt-1.5 font-semibold tracking-wider uppercase"
            style={{ color: "#64748B" }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function EmeraldGarden({ data }: Props) {
  const {
    groom_name = "Ardy",
    bride_name = "Dwivia",
    groom_father = "Bpk. Rudi",
    groom_mother = "Ibu. Sari",
    bride_father = "Bpk. Hendra",
    bride_mother = "Ibu. Maya",
    event_date = new Date(Date.now() + 30 * 86400000).toISOString(),
    event_location = "Ballroom Grand Hotel, Jakarta",
    event_map_url,
    message = "Dengan memohon Rahmat dan Ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.",
    gallery_images = [],
    bank_accounts = [],
    love_story = [],
  } = data;

  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpAttendance, setRsvpAttendance] = useState("yes");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [wishes, setWishes] = useState<{name: string; msg: string; attend: string}[]>([]);

  useEffect(() => {
    if (opened && data.id && !data.id.startsWith("preview-")) {
      fetch(`/api/rsvp?invitation_id=${data.id}`)
        .then(r => r.json())
        .then(d => {
          setWishes((d.rsvps || []).map((r: any) => ({
            name: r.guest_name,
            msg: r.message || "",
            attend: r.attendance === "yes" ? "Hadir" : r.attendance === "no" ? "Tidak Hadir" : "Mungkin",
          })));
        })
        .catch(() => {});
    }
  }, [opened, data.id]);

  async function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.id || data.id.startsWith("preview-")) { setRsvpSent(true); return; }
    setRsvpLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitation_id: data.id,
          guest_name: rsvpName,
          attendance: rsvpAttendance,
          message: rsvpMessage,
        }),
      });
      if (res.ok) {
        setRsvpSent(true);
        setWishes(prev => [{ name: rsvpName, msg: rsvpMessage, attend: rsvpAttendance === "yes" ? "Hadir" : rsvpAttendance === "no" ? "Tidak Hadir" : "Mungkin" }, ...prev]);
      }
    } catch (err) { console.error(err); }
    setRsvpLoading(false);
  }

  const eventDate = new Date(event_date);
  const dateStr = eventDate.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const copyAccount = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopied(number);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── COVER ──────────────────────────────────────────────────────────────────
  if (!opened) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #D1FAE5 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"
          style={{ background: "#059669" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 translate-x-1/3 translate-y-1/3"
          style={{ background: "#047857" }} />
        <div className="absolute top-1/3 right-0 w-40 h-40 rounded-full opacity-10 translate-x-1/2"
          style={{ background: "#059669" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-8 max-w-sm mx-auto"
        >
          {/* Ornament top */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #059669)" }} />
            <Leaf className="w-5 h-5" style={{ color: "#059669" }} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #059669)" }} />
          </div>

          <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: "#059669" }}>
            Undangan Pernikahan
          </p>

          <h1 className="font-serif font-bold leading-tight mb-2" style={{ fontSize: "clamp(2.5rem,8vw,4rem)", color: "#059669" }}>
            {groom_name}
          </h1>
          <p className="text-3xl font-serif text-muted mb-2">&amp;</p>
          <h1 className="font-serif font-bold leading-tight mb-6" style={{ fontSize: "clamp(2.5rem,8vw,4rem)", color: "#059669" }}>
            {bride_name}
          </h1>

          <div className="w-20 h-0.5 mx-auto mb-6" style={{ background: "#A7F3D0" }} />
          <p className="text-sm text-muted mb-10">{dateStr}</p>

          <motion.button
            onClick={() => setOpened(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white text-sm shadow-lg"
            style={{ background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 8px 24px rgba(5,150,105,0.35)" }}
          >
            <Mail className="w-4 h-4" /> Buka Undangan
          </motion.button>

          <p className="text-[11px] text-muted mt-5">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="text-sm font-semibold mt-1" style={{ color: "#059669" }}>
            {(data as any).guest_name ?? "Tamu Undangan"}
          </p>
        </motion.div>

        {/* Bottom scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8"
        >
          <ChevronDown className="w-5 h-5 text-muted" />
        </motion.div>
      </div>
    );
  }

  // ── MAIN INVITATION ────────────────────────────────────────────────────────
  return (
    <div className="font-sans" style={{ background: "#FAFAF8", color: "#1E293B" }}>

      {/* 1. COUPLE SECTION */}
      <section className="py-20 px-4 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #F0FDF4 0%, #FAFAF8 100%)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6" style={{ color: "#059669" }}>
            Bismillahirrahmanirrahim
          </p>

          {/* Couple names */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold" style={{ color: "#059669" }}>
                {groom_name}
              </h2>
              <p className="text-sm text-muted mt-1">Putra dari {groom_father} &amp; {groom_mother}</p>
            </div>
            <div className="flex items-center gap-4 my-3">
              <div className="h-px w-16" style={{ background: "#A7F3D0" }} />
              <Heart className="w-5 h-5" style={{ color: "#059669" }} />
              <div className="h-px w-16" style={{ background: "#A7F3D0" }} />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold" style={{ color: "#059669" }}>
                {bride_name}
              </h2>
              <p className="text-sm text-muted mt-1">Putri dari {bride_father} &amp; {bride_mother}</p>
            </div>
          </div>

          <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">{message}</p>
        </motion.div>
      </section>

      {/* 2. EVENT DETAILS */}
      <section className="py-16 px-4 text-center" style={{ background: "#FFFFFF" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-md mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6" style={{ color: "#059669" }}>
            Detail Acara
          </p>

          <div className="bg-background rounded-2xl border p-6 mb-4">
            <p className="font-bold text-base mb-3" style={{ color: "#059669" }}>Akad Nikah &amp; Resepsi</p>
            <div className="flex items-start gap-3 mb-3">
              <Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#059669" }} />
              <div className="text-left">
                <p className="font-semibold text-sm">{dateStr}</p>
                <p className="text-xs text-muted">Pukul 08:00 WIB — Selesai</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#059669" }} />
              <p className="text-sm text-left">{event_location}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+${groom_name}+%26+${bride_name}&dates=${event_date.replace(/-|:|\.\d+/g, "")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:scale-105"
              style={{ border: "1.5px solid #059669", color: "#059669" }}
            >
              <Calendar className="w-3.5 h-3.5" /> Simpan Kalender
            </a>
            {event_map_url && (
              <a href={event_map_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:scale-105"
                style={{ border: "1.5px solid #059669", color: "#059669" }}>
                <MapPin className="w-3.5 h-3.5" /> Lihat Maps
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* 3. COUNTDOWN */}
      <section className="py-16 px-4 text-center" style={{ background: "#F0FDF4" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-8" style={{ color: "#059669" }}>
            Menuju Hari Bahagia
          </p>
          <Countdown targetDate={event_date} />
        </motion.div>
      </section>

      {/* 4. LOVE STORY */}
      {love_story && love_story.length > 0 && (
        <section className="py-16 px-4" style={{ background: "#FFFFFF" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-md mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-10 text-center" style={{ color: "#059669" }}>
              Love Story
            </p>
            <div className="relative pl-8 border-l-2" style={{ borderColor: "#A7F3D0" }}>
              {love_story.map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="mb-8 relative">
                  <div className="absolute -left-[2.35rem] w-4 h-4 rounded-full border-2 border-white"
                    style={{ background: "#059669" }} />
                  <p className="text-xs font-semibold mb-1" style={{ color: "#059669" }}>{item.date}</p>
                  <p className="font-semibold text-sm text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* 5. GALLERY */}
      {gallery_images.length > 0 && (
        <section className="py-16 px-4" style={{ background: "#F0FDF4" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-8 text-center" style={{ color: "#059669" }}>
              Galeri Foto
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {gallery_images.slice(0, 6).map((src, i) => (
                <img key={i} src={src} alt={`Foto ${i + 1}`}
                  className={`rounded-xl object-cover w-full ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`} />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* 6. RSVP */}
      <section className="py-16 px-4" style={{ background: "#FFFFFF" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-sm mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-2 text-center" style={{ color: "#059669" }}>
            RSVP
          </p>
          <h3 className="text-xl font-serif font-bold text-center mb-2">Konfirmasi Kehadiran</h3>
          <p className="text-xs text-muted text-center mb-8">
            Kehadiran dan doa restumu adalah kado terindah bagi kami.
          </p>

          {rsvpSent ? (
            <div className="text-center py-8">
              <Heart className="w-10 h-10 mx-auto mb-3" style={{ color: "#059669" }} />
              <p className="font-semibold" style={{ color: "#059669" }}>Terima kasih!</p>
              <p className="text-sm text-muted mt-1">RSVP kamu sudah kami terima.</p>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleRsvpSubmit}>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted">Nama Lengkap</label>
                <input type="text" required placeholder="Masukkan nama kamu..." value={rsvpName} onChange={(e) => setRsvpName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: "#E2E8F0", background: "#FAFAF8" }}
                  onFocus={(e) => e.target.style.borderColor = "#059669"}
                  onBlur={(e) => e.target.style.borderColor = "#E2E8F0"} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted">Kehadiran</label>
                <select value={rsvpAttendance} onChange={(e) => setRsvpAttendance(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#E2E8F0", background: "#FAFAF8" }}>
                  <option value="yes">Hadir</option>
                  <option value="no">Tidak Hadir</option>
                  <option value="maybe">Mungkin Hadir</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted">Ucapan &amp; Doa</label>
                <textarea rows={3} placeholder="Tulis ucapan dan doa terbaikmu..." value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all"
                  style={{ borderColor: "#E2E8F0", background: "#FAFAF8" }}
                  onFocus={(e) => e.target.style.borderColor = "#059669"}
                  onBlur={(e) => e.target.style.borderColor = "#E2E8F0"} />
              </div>
              <button type="submit" disabled={rsvpLoading}
                className="w-full h-11 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
                {rsvpLoading ? "Mengirim..." : "Kirim RSVP"}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* 7. WISHES FEED */}
      <section className="py-12 px-4" style={{ background: "#F0FDF4" }}>
        <div className="max-w-sm mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6 text-center" style={{ color: "#059669" }}>
            Ucapan Tamu
          </p>
          <div className="space-y-3">
            {wishes.map((w, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border" style={{ borderColor: "#E2E8F0" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "#059669" }}>
                    {w.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{w.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#047857" }}>
                      {w.attend}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">{w.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GIFT REGISTRY */}
      {bank_accounts.length > 0 && (
        <section className="py-16 px-4" style={{ background: "#FFFFFF" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-sm mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-2" style={{ color: "#059669" }}>
              Titip Hadiah
            </p>
            <p className="text-xs text-muted mb-8">
              Bagi yang ingin mengirimkan hadiah, bisa melalui transfer ke rekening berikut:
            </p>
            <div className="space-y-3">
              {bank_accounts.map((acc, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ borderColor: "#E2E8F0" }}>
                  <div className="text-left">
                    <p className="font-bold text-sm" style={{ color: "#059669" }}>{acc.bank}</p>
                    <p className="text-sm font-mono text-foreground">{acc.number}</p>
                    <p className="text-xs text-muted">{acc.name}</p>
                  </div>
                  <button onClick={() => copyAccount(acc.number)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: "#D1FAE5", color: "#047857" }}>
                    {copied === acc.number ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === acc.number ? "Tersalin!" : "Salin"}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* 9. MAPS */}
      {event_map_url && (
        <section className="py-16 px-4 text-center" style={{ background: "#F0FDF4" }}>
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6" style={{ color: "#059669" }}>
            Lokasi Acara
          </p>
          <div className="max-w-md mx-auto rounded-2xl overflow-hidden border" style={{ borderColor: "#A7F3D0" }}>
            <iframe
              src={event_map_url}
              width="100%" height="280"
              style={{ border: 0 }} loading="lazy"
              allowFullScreen referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Acara"
            />
          </div>
        </section>
      )}

      {/* 10. FOOTER */}
      <footer className="py-10 px-4 text-center" style={{ background: "linear-gradient(135deg, #064E3B, #022C22)" }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-16" style={{ background: "#A7F3D0" }} />
          <Heart className="w-4 h-4 text-white/80" />
          <div className="h-px w-16" style={{ background: "#A7F3D0" }} />
        </div>
        <p className="text-white/50 text-xs">
          Dibuat menggunakan{" "}
          <a href="/" className="text-primary-light hover:underline font-semibold">Eventora</a>
        </p>

        {/* Music toggle hint */}
        {data.music_url && (
          <div className="mt-4 flex items-center justify-center gap-2 text-white/40 text-xs">
            <Music className="w-3.5 h-3.5" />
            <span>Musik aktif</span>
          </div>
        )}
      </footer>
    </div>
  );
}
