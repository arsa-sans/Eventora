"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Copy, Check, ChevronDown, Heart } from "lucide-react";
import type { InvitationData } from "@/types/invitation";
import { toEmbedMapUrl } from "@/lib/mapUtils";

interface Props { data: InvitationData; }

function Countdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return (
    <div className="flex gap-3 justify-center">
      {[{ l: "Hari", v: time.d }, { l: "Jam", v: time.h }, { l: "Menit", v: time.m }, { l: "Detik", v: time.s }].map(({ l, v }) => (
        <div key={l} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ background: "#E11D48", color: "#fff" }}>
            {String(v).padStart(2, "0")}
          </div>
          <p className="text-[10px] mt-1.5 font-semibold tracking-wider uppercase" style={{ color: "#9F1239" }}>{l}</p>
        </div>
      ))}
    </div>
  );
}

export function RoseBlush({ data }: Props) {
  const {
    groom_name = "Rifky", bride_name = "Destri",
    groom_father = "Bpk. Ahmad", groom_mother = "Ibu. Siti",
    bride_father = "Bpk. Budi", bride_mother = "Ibu. Rina",
    groom_photo, bride_photo, cover_photo,
    event_date = new Date(Date.now() + 30 * 86400000).toISOString(),
    event_location = "The Ballroom, Jakarta",
    event_map_url, message = "Dengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.",
    bank_accounts = [], love_story = [], gallery_images = [],
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

  const dateStr = new Date(event_date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const copyAcct = (n: string) => { navigator.clipboard.writeText(n); setCopied(n); setTimeout(() => setCopied(null), 2000); };

  if (!opened) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FECDD3 100%)" }}>
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 translate-x-1/3 -translate-y-1/3" style={{ background: "#E11D48" }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10 -translate-x-1/3 translate-y-1/3" style={{ background: "#BE123C" }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 text-center px-8 max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #E11D48)" }} />
            <Heart className="w-5 h-5" style={{ color: "#E11D48" }} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #E11D48)" }} />
          </div>
          <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: "#E11D48" }}>Undangan Pernikahan</p>
          <h1 className="font-serif font-bold leading-tight mb-2" style={{ fontSize: "clamp(2.5rem,8vw,4rem)", color: "#E11D48" }}>{groom_name}</h1>
          <p className="text-3xl font-serif" style={{ color: "#BE123C" }}>&amp;</p>
          <h1 className="font-serif font-bold leading-tight mb-6" style={{ fontSize: "clamp(2.5rem,8vw,4rem)", color: "#E11D48" }}>{bride_name}</h1>
          <div className="w-20 h-0.5 mx-auto mb-6" style={{ background: "#FECDD3" }} />
          <p className="text-sm mb-10" style={{ color: "#9F1239" }}>{dateStr}</p>
          <motion.button onClick={() => setOpened(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white text-sm shadow-lg"
            style={{ background: "linear-gradient(135deg, #E11D48, #BE123C)", boxShadow: "0 8px 24px rgba(225,29,72,0.35)" }}>
            <Heart className="w-4 h-4" /> Buka Undangan
          </motion.button>
          <p className="text-[11px] mt-5" style={{ color: "#9F1239" }}>Kepada Yth. {(data as any).guest_name ?? "Tamu Undangan"}</p>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute bottom-8">
          <ChevronDown className="w-5 h-5" style={{ color: "#BE123C" }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="font-sans" style={{ background: "#FFFBFB", color: "#1E293B" }}>
      {/* Couple Photos */}
      {(groom_photo || bride_photo) && (
        <section className="py-16 px-4" style={{ background: "linear-gradient(180deg, #FFF1F2 0%, #FFFBFB 100%)" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center gap-6 max-w-sm mx-auto">
            {groom_photo && (
              <div className="text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 mx-auto mb-3" style={{ borderColor: "#FECDD3" }}>
                  <img src={groom_photo} alt={groom_name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-semibold" style={{ color: "#E11D48" }}>{groom_name}</p>
              </div>
            )}
            {bride_photo && (
              <div className="text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 mx-auto mb-3" style={{ borderColor: "#FECDD3" }}>
                  <img src={bride_photo} alt={bride_name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-semibold" style={{ color: "#E11D48" }}>{bride_name}</p>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* Couple Names */}
      <section className="py-20 px-4 text-center" style={{ background: groom_photo || bride_photo ? "#FFFBFB" : "linear-gradient(180deg, #FFF1F2 0%, #FFFBFB 100%)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6" style={{ color: "#E11D48" }}>Bismillahirrahmanirrahim</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold" style={{ color: "#E11D48" }}>{groom_name}</h2>
          <p className="text-sm text-muted mt-1">Putra dari {groom_father} &amp; {groom_mother}</p>
          <div className="flex items-center justify-center gap-4 my-4">
            <div className="h-px w-16" style={{ background: "#FECDD3" }} />
            <Heart className="w-5 h-5" style={{ color: "#E11D48" }} />
            <div className="h-px w-16" style={{ background: "#FECDD3" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold" style={{ color: "#E11D48" }}>{bride_name}</h2>
          <p className="text-sm text-muted mt-1">Putri dari {bride_father} &amp; {bride_mother}</p>
          <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed mt-6">{message}</p>
        </motion.div>
      </section>

      {/* Event */}
      <section className="py-16 px-4 text-center bg-white">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-md mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6" style={{ color: "#E11D48" }}>Detail Acara</p>
          <div className="bg-background rounded-2xl border border-border p-6 mb-4">
            <p className="font-bold text-base mb-3" style={{ color: "#E11D48" }}>Akad Nikah &amp; Resepsi</p>
            <div className="flex items-start gap-3 mb-3"><Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#E11D48" }} /><div className="text-left"><p className="font-semibold text-sm">{dateStr}</p><p className="text-xs text-muted">Pukul 08:00 WIB</p></div></div>
            <div className="flex items-start gap-3"><MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#E11D48" }} /><p className="text-sm text-left">{event_location}</p></div>
          </div>
          {event_map_url && <a href={event_map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:scale-105" style={{ border: "1.5px solid #E11D48", color: "#E11D48" }}><MapPin className="w-3.5 h-3.5" /> Lihat Maps</a>}
        </motion.div>
      </section>

      {/* Countdown */}
      <section className="py-16 px-4 text-center" style={{ background: "#FFF1F2" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-8" style={{ color: "#E11D48" }}>Menuju Hari Bahagia</p>
          <Countdown targetDate={event_date} />
        </motion.div>
      </section>

      {/* Love Story */}
      {love_story && love_story.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-md mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-10 text-center" style={{ color: "#E11D48" }}>Love Story</p>
            <div className="relative pl-8 border-l-2" style={{ borderColor: "#FECDD3" }}>
              {love_story.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="mb-8 relative">
                  <div className="absolute -left-[2.35rem] w-4 h-4 rounded-full border-2 border-white" style={{ background: "#E11D48" }} />
                  <p className="text-xs font-semibold mb-1" style={{ color: "#E11D48" }}>{item.date}</p>
                  <p className="font-semibold text-sm text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Gallery */}
      {gallery_images.length > 0 && (
        <section className="py-16 px-4" style={{ background: "#FFF1F2" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-8 text-center" style={{ color: "#E11D48" }}>Galeri Foto</p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {gallery_images.slice(0, 6).map((src, i) => (
                <img key={i} src={src} alt={`Foto ${i + 1}`}
                  className={`rounded-xl object-cover w-full ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`} />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* RSVP */}
      <section className="py-16 px-4 bg-white">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-2 text-center" style={{ color: "#E11D48" }}>RSVP</p>
          <h3 className="text-xl font-serif font-bold text-center mb-2">Konfirmasi Kehadiran</h3>
          <p className="text-xs text-muted text-center mb-8">Kehadiran dan doa restumu adalah kado terindah bagi kami.</p>
          {rsvpSent ? (
            <div className="text-center py-8">
              <Heart className="w-10 h-10 mx-auto mb-3" style={{ color: "#E11D48" }} />
              <p className="font-semibold" style={{ color: "#E11D48" }}>Terima kasih!</p>
              <p className="text-sm text-muted mt-1">RSVP kamu sudah kami terima.</p>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleRsvpSubmit}>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted">Nama Lengkap</label>
                <input type="text" required placeholder="Masukkan nama kamu..." value={rsvpName} onChange={(e) => setRsvpName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: "#FECDD3", background: "#FFF1F2" }}
                  onFocus={(e) => e.target.style.borderColor = "#E11D48"}
                  onBlur={(e) => e.target.style.borderColor = "#FECDD3"} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted">Kehadiran</label>
                <select value={rsvpAttendance} onChange={(e) => setRsvpAttendance(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border text-sm outline-none" style={{ borderColor: "#FECDD3", background: "#FFF1F2" }}>
                  <option value="yes">Hadir</option>
                  <option value="no">Tidak Hadir</option>
                  <option value="maybe">Mungkin Hadir</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted">Ucapan &amp; Doa</label>
                <textarea rows={3} placeholder="Tulis ucapan dan doa terbaikmu..." value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all"
                  style={{ borderColor: "#FECDD3", background: "#FFF1F2" }}
                  onFocus={(e) => e.target.style.borderColor = "#E11D48"}
                  onBlur={(e) => e.target.style.borderColor = "#FECDD3"} />
              </div>
              <button type="submit" disabled={rsvpLoading}
                className="w-full h-11 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #E11D48, #BE123C)" }}>
                {rsvpLoading ? "Mengirim..." : "Kirim RSVP"}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* Wishes Feed */}
      {wishes.length > 0 && (
        <section className="py-12 px-4" style={{ background: "#FFF1F2" }}>
          <div className="max-w-sm mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6 text-center" style={{ color: "#E11D48" }}>Ucapan Tamu</p>
            <div className="space-y-3">
              {wishes.map((w, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border" style={{ borderColor: "#FECDD3" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#E11D48" }}>{w.name[0]}</div>
                    <div>
                      <p className="text-xs font-semibold">{w.name}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "#FECDD3", color: "#BE123C" }}>{w.attend}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{w.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gift */}
      {bank_accounts.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-2" style={{ color: "#E11D48" }}>Titip Hadiah</p>
            <p className="text-xs text-muted mb-8">Bagi yang ingin mengirimkan hadiah, bisa melalui transfer ke rekening berikut:</p>
            <div className="space-y-3">
              {bank_accounts.map((acc, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-white" style={{ borderColor: "#FECDD3" }}>
                  <div className="text-left"><p className="font-bold text-sm" style={{ color: "#E11D48" }}>{acc.bank}</p><p className="text-sm font-mono">{acc.number}</p><p className="text-xs text-muted">{acc.name}</p></div>
                  <button onClick={() => copyAcct(acc.number)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "#FECDD3", color: "#BE123C" }}>
                    {copied === acc.number ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied === acc.number ? "Tersalin!" : "Salin"}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Maps */}
      {event_map_url && (
        <section className="py-16 px-4 text-center" style={{ background: "#FFF1F2" }}>
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6" style={{ color: "#E11D48" }}>Lokasi Acara</p>
          <div className="max-w-md mx-auto rounded-2xl overflow-hidden border" style={{ borderColor: "#FECDD3" }}>
            <iframe src={toEmbedMapUrl(event_map_url)} width="100%" height="280" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" title="Lokasi Acara" />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 px-4 text-center" style={{ background: "linear-gradient(135deg, #881337, #4C0519)" }}>
        <p className="text-white/50 text-xs">Dibuat menggunakan <a href="/" className="text-pink-300 hover:underline font-semibold">Eventora</a></p>
      </footer>
    </div>
  );
}
