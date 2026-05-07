"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Copy, Check, ChevronDown, Minus } from "lucide-react";
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
    <div className="flex gap-4 justify-center">
      {[{ l: "Hari", v: time.d }, { l: "Jam", v: time.h }, { l: "Menit", v: time.m }, { l: "Detik", v: time.s }].map(({ l, v }) => (
        <div key={l} className="text-center"><div className="w-16 h-16 border border-foreground flex items-center justify-center text-2xl font-bold text-foreground">{String(v).padStart(2, "0")}</div><p className="text-[10px] mt-2 uppercase tracking-wider text-muted">{l}</p></div>
      ))}
    </div>
  );
}

export function MinimalistWhite({ data }: Props) {
  const {
    groom_name = "Kevin", bride_name = "Adinda",
    groom_father = "Bpk. Irwan", groom_mother = "Ibu. Dewi",
    bride_father = "Bpk. Dodi", bride_mother = "Ibu. Nani",
    groom_photo, bride_photo, cover_photo,
    event_date = new Date(Date.now() + 30 * 86400000).toISOString(),
    event_location = "The Garden Venue, Jakarta",
    event_map_url, message = "Dengan segenap kebahagiaan, kami mengundang kehadiran Bapak/Ibu/Saudara/i.",
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-center px-8 max-w-xs mx-auto">
          <div className="w-12 h-0.5 mx-auto mb-8 bg-foreground" />
          <p className="text-[10px] tracking-[0.5em] uppercase text-muted mb-6">Wedding</p>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-2">{groom_name}</h1>
          <p className="text-xl text-muted font-serif mb-2">&amp;</p>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-8">{bride_name}</h1>
          <div className="w-12 h-0.5 mx-auto mb-6 bg-foreground" />
          <p className="text-xs text-muted mb-10">{dateStr}</p>
          <motion.button onClick={() => setOpened(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-3 border border-foreground text-foreground text-sm font-semibold tracking-wider uppercase hover:bg-foreground hover:text-white transition-all duration-300">
            Open Invitation
          </motion.button>
          <p className="text-[11px] text-muted mt-6">Kepada Yth. {(data as any).guest_name ?? "Tamu Undangan"}</p>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute bottom-8">
          <ChevronDown className="w-5 h-5 text-muted" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-white text-foreground">
      {/* Couple Photos */}
      {(groom_photo || bride_photo) && (
        <section className="py-16 px-4 border-b border-border">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center gap-6 max-w-sm mx-auto">
            {groom_photo && (
              <div className="text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-border mx-auto mb-3">
                  <img src={groom_photo} alt={groom_name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-semibold">{groom_name}</p>
              </div>
            )}
            {bride_photo && (
              <div className="text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-border mx-auto mb-3">
                  <img src={bride_photo} alt={bride_name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-semibold">{bride_name}</p>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* Couple Names */}
      <section className="py-20 px-4 text-center border-b border-border">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] tracking-[0.5em] uppercase text-muted mb-8">The Wedding of</p>
          <h2 className="text-5xl font-serif font-bold text-foreground">{groom_name}</h2>
          <p className="text-sm text-muted mt-1">Putra dari {groom_father} &amp; {groom_mother}</p>
          <div className="flex items-center justify-center gap-4 my-5"><div className="h-px w-16 bg-border" /><span className="text-muted text-lg">&amp;</span><div className="h-px w-16 bg-border" /></div>
          <h2 className="text-5xl font-serif font-bold text-foreground">{bride_name}</h2>
          <p className="text-sm text-muted mt-1">Putri dari {bride_father} &amp; {bride_mother}</p>
          <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed mt-6">{message}</p>
        </motion.div>
      </section>

      {/* Event */}
      <section className="py-16 px-4 text-center border-b border-border">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-muted mb-6">Detail Acara</p>
          <div className="border border-border p-6 mb-4 text-left">
            <p className="font-bold text-sm mb-3">Akad Nikah &amp; Resepsi</p>
            <div className="flex items-start gap-3 mb-2"><Calendar className="w-4 h-4 shrink-0 mt-0.5 text-muted" /><div><p className="font-medium text-sm">{dateStr}</p><p className="text-xs text-muted">Pukul 08:00 WIB</p></div></div>
            <div className="flex items-start gap-3"><MapPin className="w-4 h-4 shrink-0 mt-0.5 text-muted" /><p className="text-sm">{event_location}</p></div>
          </div>
          {event_map_url && <a href={event_map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-foreground hover:bg-foreground hover:text-white transition-all"><MapPin className="w-3.5 h-3.5" /> Lihat Maps</a>}
        </motion.div>
      </section>

      {/* Countdown */}
      <section className="py-16 px-4 text-center border-b border-border bg-background">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] tracking-[0.5em] uppercase text-muted mb-8">Menuju Hari-H</p>
          <Countdown targetDate={event_date} />
        </motion.div>
      </section>

      {/* Love Story */}
      {love_story && love_story.length > 0 && (
        <section className="py-16 px-4 border-b border-border">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-md mx-auto">
            <p className="text-[10px] tracking-[0.5em] uppercase text-muted mb-10 text-center">Love Story</p>
            <div className="relative pl-8 border-l border-border">
              {love_story.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="mb-8 relative">
                  <div className="absolute -left-[1.3rem] w-3 h-3 rounded-full bg-foreground border-2 border-white" />
                  <p className="text-xs font-semibold mb-1 text-muted">{item.date}</p>
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
        <section className="py-16 px-4 border-b border-border bg-background">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.5em] uppercase text-muted mb-8 text-center">Galeri Foto</p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {gallery_images.slice(0, 6).map((src, i) => (
                <img key={i} src={src} alt={`Foto ${i + 1}`}
                  className={`object-cover w-full border border-border ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`} />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* RSVP */}
      <section className="py-16 px-4 border-b border-border">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-muted mb-2 text-center">RSVP</p>
          <h3 className="text-xl font-serif font-bold text-center mb-2">Konfirmasi Kehadiran</h3>
          <p className="text-xs text-muted text-center mb-8">Kehadiran dan doa restumu adalah kado terindah bagi kami.</p>
          {rsvpSent ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-foreground flex items-center justify-center">
                <Check className="w-5 h-5 text-foreground" />
              </div>
              <p className="font-semibold text-foreground">Terima kasih!</p>
              <p className="text-sm text-muted mt-1">RSVP kamu sudah kami terima.</p>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleRsvpSubmit}>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted">Nama Lengkap</label>
                <input type="text" required placeholder="Masukkan nama kamu..." value={rsvpName} onChange={(e) => setRsvpName(e.target.value)}
                  className="w-full h-11 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted">Kehadiran</label>
                <select value={rsvpAttendance} onChange={(e) => setRsvpAttendance(e.target.value)}
                  className="w-full h-11 px-4 border border-border text-sm outline-none bg-white">
                  <option value="yes">Hadir</option>
                  <option value="no">Tidak Hadir</option>
                  <option value="maybe">Mungkin Hadir</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted">Ucapan &amp; Doa</label>
                <textarea rows={3} placeholder="Tulis ucapan dan doa terbaikmu..." value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-border text-sm outline-none resize-none focus:border-foreground transition-colors" />
              </div>
              <button type="submit" disabled={rsvpLoading}
                className="w-full h-11 border border-foreground text-foreground text-sm font-semibold tracking-wider uppercase hover:bg-foreground hover:text-white transition-all duration-300 disabled:opacity-50">
                {rsvpLoading ? "Mengirim..." : "Kirim RSVP"}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* Wishes Feed */}
      {wishes.length > 0 && (
        <section className="py-12 px-4 border-b border-border bg-background">
          <div className="max-w-sm mx-auto">
            <p className="text-[10px] tracking-[0.5em] uppercase text-muted mb-6 text-center">Ucapan Tamu</p>
            <div className="space-y-3">
              {wishes.map((w, i) => (
                <div key={i} className="bg-white p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-foreground text-white">{w.name[0]}</div>
                    <div>
                      <p className="text-xs font-semibold">{w.name}</p>
                      <span className="text-[10px] px-1.5 py-0.5 border border-border text-muted">{w.attend}</span>
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
        <section className="py-16 px-4 bg-background border-b border-border">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto">
            <p className="text-[10px] tracking-[0.5em] uppercase text-muted mb-2 text-center">Titip Hadiah</p>
            <p className="text-xs text-muted mb-8 text-center">Bagi yang ingin mengirimkan hadiah, bisa melalui transfer ke rekening berikut:</p>
            <div className="space-y-3">
              {bank_accounts.map((acc, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border bg-white">
                  <div><p className="font-bold text-sm">{acc.bank}</p><p className="text-sm font-mono">{acc.number}</p><p className="text-xs text-muted">{acc.name}</p></div>
                  <button onClick={() => copyAcct(acc.number)} className="flex items-center gap-1 px-3 py-1.5 border border-border text-xs font-semibold hover:bg-foreground hover:text-white transition-all">
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
        <section className="py-16 px-4 text-center border-b border-border">
          <p className="text-[10px] tracking-[0.5em] uppercase text-muted mb-6">Lokasi Acara</p>
          <div className="max-w-md mx-auto overflow-hidden border border-border">
            <iframe src={toEmbedMapUrl(event_map_url)} width="100%" height="280" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" title="Lokasi Acara" />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 px-4 text-center border-t border-border">
        <div className="w-8 h-0.5 mx-auto mb-4 bg-foreground" />
        <p className="text-xs text-muted">Dibuat menggunakan <a href="/" className="text-foreground hover:underline font-semibold">Eventora</a></p>
      </footer>
    </div>
  );
}
