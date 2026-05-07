"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Copy, Check, ChevronDown, Star } from "lucide-react";
import type { InvitationData } from "@/types/invitation";

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
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border" style={{ background: "#1A1A1A", color: "#D4AF37", borderColor: "#D4AF37" }}>
            {String(v).padStart(2, "0")}
          </div>
          <p className="text-[10px] mt-1.5 font-semibold tracking-wider uppercase" style={{ color: "#D4AF37" }}>{l}</p>
        </div>
      ))}
    </div>
  );
}

export function MidnightNoir({ data }: Props) {
  const {
    groom_name = "Bima", bride_name = "Anindita",
    groom_father = "Bpk. Hadi", groom_mother = "Ibu. Sri",
    bride_father = "Bpk. Tono", bride_mother = "Ibu. Dewi",
    groom_photo, bride_photo, cover_photo,
    event_date = new Date(Date.now() + 30 * 86400000).toISOString(),
    event_location = "Grand Ballroom, Jakarta",
    event_map_url, message = "Dengan penuh kebahagiaan, kami mengundang kehadiran Bapak/Ibu/Saudara/i di acara pernikahan kami.",
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
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "#0A0A0A" }}>
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 opacity-40" style={{ borderColor: "#D4AF37" }} />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 opacity-40" style={{ borderColor: "#D4AF37" }} />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 opacity-40" style={{ borderColor: "#D4AF37" }} />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 opacity-40" style={{ borderColor: "#D4AF37" }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="relative z-10 text-center px-8 max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
            <Star className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
          </div>
          <p className="text-xs tracking-[0.5em] uppercase font-semibold mb-6" style={{ color: "#D4AF37" }}>Wedding Invitation</p>
          <h1 className="font-serif font-bold leading-tight mb-1" style={{ fontSize: "clamp(2.5rem,8vw,4rem)", color: "#D4AF37" }}>{groom_name}</h1>
          <p className="text-2xl my-2" style={{ color: "#9A7D3A" }}>&amp;</p>
          <h1 className="font-serif font-bold leading-tight mb-8" style={{ fontSize: "clamp(2.5rem,8vw,4rem)", color: "#D4AF37" }}>{bride_name}</h1>
          <div className="w-20 h-0.5 mx-auto mb-6" style={{ background: "#9A7D3A" }} />
          <p className="text-sm mb-10" style={{ color: "#9A7D3A" }}>{dateStr}</p>
          <motion.button onClick={() => setOpened(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #D4AF37, #9A7D3A)", color: "#0A0A0A", boxShadow: "0 8px 24px rgba(212,175,55,0.3)" }}>
            <Star className="w-4 h-4" /> Open Invitation
          </motion.button>
          <p className="text-[11px] mt-5" style={{ color: "#9A7D3A" }}>Kepada Yth. {(data as any).guest_name ?? "Tamu Undangan"}</p>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute bottom-8">
          <ChevronDown className="w-5 h-5" style={{ color: "#9A7D3A" }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="font-sans" style={{ background: "#0A0A0A", color: "#F5F5F5" }}>
      {/* Couple Photos */}
      {(groom_photo || bride_photo) && (
        <section className="py-16 px-4" style={{ background: "linear-gradient(180deg, #111111 0%, #0A0A0A 100%)" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center gap-6 max-w-sm mx-auto">
            {groom_photo && (
              <div className="text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 mx-auto mb-3" style={{ borderColor: "#D4AF37" }}>
                  <img src={groom_photo} alt={groom_name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-semibold" style={{ color: "#D4AF37" }}>{groom_name}</p>
              </div>
            )}
            {bride_photo && (
              <div className="text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 mx-auto mb-3" style={{ borderColor: "#D4AF37" }}>
                  <img src={bride_photo} alt={bride_name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-semibold" style={{ color: "#D4AF37" }}>{bride_name}</p>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* Couple Names */}
      <section className="py-20 px-4 text-center" style={{ background: groom_photo || bride_photo ? "#0A0A0A" : "linear-gradient(180deg, #111111 0%, #0A0A0A 100%)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs tracking-[0.5em] uppercase font-semibold mb-6" style={{ color: "#D4AF37" }}>The Wedding of</p>
          <h2 className="text-5xl font-serif font-bold" style={{ color: "#D4AF37" }}>{groom_name}</h2>
          <p className="text-sm mt-1" style={{ color: "#9A7D3A" }}>Putra dari {groom_father} &amp; {groom_mother}</p>
          <div className="flex items-center justify-center gap-4 my-5"><div className="h-px w-16" style={{ background: "#9A7D3A" }} /><Star className="w-4 h-4" style={{ color: "#D4AF37" }} /><div className="h-px w-16" style={{ background: "#9A7D3A" }} /></div>
          <h2 className="text-5xl font-serif font-bold" style={{ color: "#D4AF37" }}>{bride_name}</h2>
          <p className="text-sm mt-1" style={{ color: "#9A7D3A" }}>Putri dari {bride_father} &amp; {bride_mother}</p>
          <p className="text-sm max-w-sm mx-auto leading-relaxed mt-6" style={{ color: "#9A7D3A" }}>{message}</p>
        </motion.div>
      </section>

      {/* Event */}
      <section className="py-16 px-4 text-center" style={{ background: "#111111" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-md mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6" style={{ color: "#D4AF37" }}>Detail Acara</p>
          <div className="rounded-2xl border p-6 mb-4" style={{ borderColor: "#D4AF37", background: "#1A1A1A" }}>
            <p className="font-bold text-base mb-3" style={{ color: "#D4AF37" }}>Akad Nikah &amp; Resepsi</p>
            <div className="flex items-start gap-3 mb-3"><Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#D4AF37" }} /><div className="text-left"><p className="font-semibold text-sm text-white">{dateStr}</p><p className="text-xs" style={{ color: "#9A7D3A" }}>Pukul 08:00 WIB</p></div></div>
            <div className="flex items-start gap-3"><MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#D4AF37" }} /><p className="text-sm text-left text-white">{event_location}</p></div>
          </div>
          {event_map_url && <a href={event_map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:scale-105" style={{ border: "1.5px solid #D4AF37", color: "#D4AF37" }}><MapPin className="w-3.5 h-3.5" /> Lihat Maps</a>}
        </motion.div>
      </section>

      {/* Countdown */}
      <section className="py-16 px-4 text-center" style={{ background: "#0A0A0A" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-8" style={{ color: "#D4AF37" }}>Menuju Hari Bahagia</p>
          <Countdown targetDate={event_date} />
        </motion.div>
      </section>

      {/* Love Story */}
      {love_story && love_story.length > 0 && (
        <section className="py-16 px-4" style={{ background: "#111111" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-md mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-10 text-center" style={{ color: "#D4AF37" }}>Love Story</p>
            <div className="relative pl-8 border-l-2" style={{ borderColor: "#D4AF3750" }}>
              {love_story.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="mb-8 relative">
                  <div className="absolute -left-[2.35rem] w-4 h-4 rounded-full border-2" style={{ background: "#D4AF37", borderColor: "#0A0A0A" }} />
                  <p className="text-xs font-semibold mb-1" style={{ color: "#D4AF37" }}>{item.date}</p>
                  <p className="font-semibold text-sm text-white mb-1">{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#9A7D3A" }}>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Gallery */}
      {gallery_images.length > 0 && (
        <section className="py-16 px-4" style={{ background: "#0A0A0A" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-8 text-center" style={{ color: "#D4AF37" }}>Galeri Foto</p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {gallery_images.slice(0, 6).map((src, i) => (
                <img key={i} src={src} alt={`Foto ${i + 1}`}
                  className={`rounded-xl object-cover w-full border ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
                  style={{ borderColor: "#D4AF3730" }} />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* RSVP */}
      <section className="py-16 px-4" style={{ background: "#111111" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-2 text-center" style={{ color: "#D4AF37" }}>RSVP</p>
          <h3 className="text-xl font-serif font-bold text-center mb-2 text-white">Konfirmasi Kehadiran</h3>
          <p className="text-xs text-center mb-8" style={{ color: "#9A7D3A" }}>Kehadiran dan doa restumu adalah kado terindah bagi kami.</p>
          {rsvpSent ? (
            <div className="text-center py-8">
              <Star className="w-10 h-10 mx-auto mb-3" style={{ color: "#D4AF37" }} />
              <p className="font-semibold" style={{ color: "#D4AF37" }}>Terima kasih!</p>
              <p className="text-sm mt-1" style={{ color: "#9A7D3A" }}>RSVP kamu sudah kami terima.</p>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleRsvpSubmit}>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9A7D3A" }}>Nama Lengkap</label>
                <input type="text" required placeholder="Masukkan nama kamu..." value={rsvpName} onChange={(e) => setRsvpName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                  style={{ background: "#1A1A1A", border: "1px solid #D4AF3750", color: "#F5F5F5" }}
                  onFocus={(e) => e.target.style.borderColor = "#D4AF37"}
                  onBlur={(e) => e.target.style.borderColor = "#D4AF3750"} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9A7D3A" }}>Kehadiran</label>
                <select value={rsvpAttendance} onChange={(e) => setRsvpAttendance(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={{ background: "#1A1A1A", border: "1px solid #D4AF3750", color: "#F5F5F5" }}>
                  <option value="yes">Hadir</option>
                  <option value="no">Tidak Hadir</option>
                  <option value="maybe">Mungkin Hadir</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9A7D3A" }}>Ucapan &amp; Doa</label>
                <textarea rows={3} placeholder="Tulis ucapan dan doa terbaikmu..." value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{ background: "#1A1A1A", border: "1px solid #D4AF3750", color: "#F5F5F5" }}
                  onFocus={(e) => e.target.style.borderColor = "#D4AF37"}
                  onBlur={(e) => e.target.style.borderColor = "#D4AF3750"} />
              </div>
              <button type="submit" disabled={rsvpLoading}
                className="w-full h-11 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #D4AF37, #9A7D3A)", color: "#0A0A0A" }}>
                {rsvpLoading ? "Mengirim..." : "Kirim RSVP"}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* Wishes Feed */}
      {wishes.length > 0 && (
        <section className="py-12 px-4" style={{ background: "#0A0A0A" }}>
          <div className="max-w-sm mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6 text-center" style={{ color: "#D4AF37" }}>Ucapan Tamu</p>
            <div className="space-y-3">
              {wishes.map((w, i) => (
                <div key={i} className="rounded-xl p-4 border" style={{ background: "#1A1A1A", borderColor: "#D4AF3730" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#D4AF37", color: "#0A0A0A" }}>{w.name[0]}</div>
                    <div>
                      <p className="text-xs font-semibold text-white">{w.name}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "#D4AF3722", color: "#D4AF37" }}>{w.attend}</span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#9A7D3A" }}>{w.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gift */}
      {bank_accounts.length > 0 && (
        <section className="py-16 px-4" style={{ background: "#111111" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-2" style={{ color: "#D4AF37" }}>Titip Hadiah</p>
            <p className="text-xs mb-8" style={{ color: "#9A7D3A" }}>Bagi yang ingin mengirimkan hadiah, bisa melalui transfer ke rekening berikut:</p>
            <div className="space-y-3">
              {bank_accounts.map((acc, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border" style={{ background: "#1A1A1A", borderColor: "#D4AF37" }}>
                  <div className="text-left"><p className="font-bold text-sm" style={{ color: "#D4AF37" }}>{acc.bank}</p><p className="text-sm font-mono text-white">{acc.number}</p><p className="text-xs" style={{ color: "#9A7D3A" }}>{acc.name}</p></div>
                  <button onClick={() => copyAcct(acc.number)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "#D4AF3722", color: "#D4AF37", border: "1px solid #D4AF37" }}>
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
        <section className="py-16 px-4 text-center" style={{ background: "#0A0A0A" }}>
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6" style={{ color: "#D4AF37" }}>Lokasi Acara</p>
          <div className="max-w-md mx-auto rounded-2xl overflow-hidden border" style={{ borderColor: "#D4AF37" }}>
            <iframe src={event_map_url} width="100%" height="280" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" title="Lokasi Acara" />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 px-4 text-center" style={{ background: "#050505", borderTop: "1px solid #D4AF3730" }}>
        <p className="text-xs" style={{ color: "#9A7D3A" }}>Dibuat menggunakan <a href="/" className="hover:underline font-semibold" style={{ color: "#D4AF37" }}>Eventora</a></p>
      </footer>
    </div>
  );
}
