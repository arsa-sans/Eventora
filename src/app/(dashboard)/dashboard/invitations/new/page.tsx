"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templatesData";
import { themeRegistry } from "@/lib/themeRegistry";
import { createClient } from "@/lib/supabase";
import {
  ArrowLeft, ArrowRight, Check, Upload, X, Plus, Trash2,
  User, Calendar, MapPin, Heart, Image as ImageIcon, Music, CreditCard, Loader2, AlertTriangle
} from "lucide-react";

interface LoveStoryItem { date: string; title: string; description: string; }
interface BankAccount { bank: string; number: string; name: string; }

const STEPS = [
  { id: 1, label: "Mempelai", icon: User },
  { id: 2, label: "Acara", icon: Calendar },
  { id: 3, label: "Cerita & Galeri", icon: Heart },
  { id: 4, label: "Fitur", icon: Music },
  { id: 5, label: "Tema", icon: ImageIcon },
];

export default function NewInvitationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Step 1: Couple
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [groomFather, setGroomFather] = useState("");
  const [groomMother, setGroomMother] = useState("");
  const [brideFather, setBrideFather] = useState("");
  const [brideMother, setBrideMother] = useState("");
  const [message, setMessage] = useState(
    "Dengan memohon Rahmat dan Ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan acara pernikahan kami."
  );

  // Step 2: Event
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("08:00");
  const [eventLocation, setEventLocation] = useState("");
  const [eventMapUrl, setEventMapUrl] = useState("");

  // Step 3: Story & Gallery
  const [loveStory, setLoveStory] = useState<LoveStoryItem[]>([
    { date: "", title: "", description: "" },
  ]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Step 4: Features
  const [musicUrl, setMusicUrl] = useState("");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  // Step 5: Theme
  const [selectedTheme, setSelectedTheme] = useState("emerald-garden");

  // --- Love Story helpers ---
  function updateStory(index: number, field: keyof LoveStoryItem, value: string) {
    const updated = [...loveStory];
    updated[index] = { ...updated[index], [field]: value };
    setLoveStory(updated);
  }
  function addStory() {
    setLoveStory([...loveStory, { date: "", title: "", description: "" }]);
  }
  function removeStory(index: number) {
    setLoveStory(loveStory.filter((_, i) => i !== index));
  }

  // --- Bank Account helpers ---
  function addBank() {
    setBankAccounts([...bankAccounts, { bank: "", number: "", name: "" }]);
  }
  function updateBank(index: number, field: keyof BankAccount, value: string) {
    const updated = [...bankAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setBankAccounts(updated);
  }
  function removeBank(index: number) {
    setBankAccounts(bankAccounts.filter((_, i) => i !== index));
  }

  // --- Image Upload ---
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.url) {
          newUrls.push(data.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setGalleryImages((prev) => [...prev, ...newUrls]);
    setUploadingImages(false);
    e.target.value = "";
  }

  function removeImage(index: number) {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  }

  // --- Submit ---
  async function handleSubmit() {
    setSaving(true);
    setError(null);

    try {
      const filteredStory = loveStory.filter((s) => s.title.trim() !== "");
      const filteredBanks = bankAccounts.filter((b) => b.bank.trim() !== "");

      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groom_name: groomName,
          bride_name: brideName,
          groom_father: groomFather,
          groom_mother: groomMother,
          bride_father: brideFather,
          bride_mother: brideMother,
          message,
          event_date: eventDate ? new Date(eventDate).toISOString() : null,
          event_time: eventTime,
          event_location: eventLocation,
          event_map_url: eventMapUrl,
          love_story: filteredStory,
          gallery_images: galleryImages,
          music_url: musicUrl,
          bank_accounts: filteredBanks,
          theme_id: selectedTheme,
          event_type: "wedding",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat undangan");
      }

      router.push("/dashboard/invitations");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full h-11 px-4 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all bg-white";
  const labelClass = "block text-xs font-semibold text-muted mb-1.5";

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-serif text-foreground">Buat Undangan Baru</h2>
        <p className="text-text-secondary mt-1 text-sm md:text-base">Isi detail acaramu untuk mulai membuat undangan.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => s.id < step && setStep(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : isDone
                    ? "bg-primary-light text-primary cursor-pointer"
                    : "bg-gray-100 text-muted"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                {s.label}
              </button>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-border mx-1" />}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          <AlertTriangle className="w-3.5 h-3.5 inline mr-1" /> {error}
        </div>
      )}

      <div className="bg-white p-4 md:p-8 rounded-2xl border border-border shadow-sm">
        {/* ═══ STEP 1: COUPLE ═══ */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-xl font-medium border-b border-border pb-4">Data Mempelai</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nama Panggilan Pria</label>
                <input type="text" className={inputClass} placeholder="Contoh: Romeo" value={groomName} onChange={(e) => setGroomName(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Nama Panggilan Wanita</label>
                <input type="text" className={inputClass} placeholder="Contoh: Juliet" value={brideName} onChange={(e) => setBrideName(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Ayah Pria</label>
                <input type="text" className={inputClass} placeholder="Bpk. ..." value={groomFather} onChange={(e) => setGroomFather(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Ibu Pria</label>
                <input type="text" className={inputClass} placeholder="Ibu. ..." value={groomMother} onChange={(e) => setGroomMother(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Ayah Wanita</label>
                <input type="text" className={inputClass} placeholder="Bpk. ..." value={brideFather} onChange={(e) => setBrideFather(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Ibu Wanita</label>
                <input type="text" className={inputClass} placeholder="Ibu. ..." value={brideMother} onChange={(e) => setBrideMother(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Pesan / Kata Sambutan</label>
              <textarea className="w-full p-4 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all resize-none bg-white" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          </div>
        )}

        {/* ═══ STEP 2: EVENT ═══ */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-xl font-medium border-b border-border pb-4">Detail Acara</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tanggal Acara</label>
                <input type="date" className={inputClass} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Waktu Acara</label>
                <input type="time" className={inputClass} value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Lokasi Acara</label>
              <textarea className="w-full p-4 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all resize-none bg-white" rows={2} placeholder="Gedung Serbaguna, Jl. ..." value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Google Maps Embed URL (opsional)</label>
              <input type="url" className={inputClass} placeholder="https://www.google.com/maps/embed?pb=..." value={eventMapUrl} onChange={(e) => setEventMapUrl(e.target.value)} />
              <p className="text-[11px] text-muted mt-1">Salin link lokasi dari Google Maps (format apapun didukung).</p>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: STORY & GALLERY ═══ */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium border-b border-border pb-4">Love Story & Galeri Foto</h3>

            {/* Love Story */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">Love Story (opsional)</label>
                <button onClick={addStory} className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Tambah
                </button>
              </div>
              <div className="space-y-4">
                {loveStory.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-gray-50/50 relative">
                    {loveStory.length > 1 && (
                      <button onClick={() => removeStory(i)} className="absolute top-2 right-2 text-muted hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input type="text" className={inputClass} placeholder="Waktu (Maret 2020)" value={item.date} onChange={(e) => updateStory(i, "date", e.target.value)} />
                      <input type="text" className={inputClass} placeholder="Judul cerita" value={item.title} onChange={(e) => updateStory(i, "title", e.target.value)} />
                    </div>
                    <textarea className="w-full p-3 rounded-xl border border-border text-sm outline-none focus:border-primary transition-all resize-none bg-white" rows={2} placeholder="Ceritakan momen ini..." value={item.description} onChange={(e) => updateStory(i, "description", e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-3">Foto Prewedding / Galeri</label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {galleryImages.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors">
                  {uploadingImages ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted mb-1" />
                      <span className="text-[10px] text-muted font-medium">Upload Foto</span>
                    </>
                  )}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploadingImages} />
                </label>
              </div>
              <p className="text-[11px] text-muted">Maks 5MB per foto. Format: JPG, PNG, WebP.</p>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: FEATURES ═══ */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium border-b border-border pb-4">Fitur Tambahan</h3>
            <div>
              <label className={labelClass}>URL Musik Latar (opsional)</label>
              <input type="url" className={inputClass} placeholder="https://example.com/music.mp3" value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} />
              <p className="text-[11px] text-muted mt-1">Link langsung ke file audio (MP3).</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">Rekening Titip Hadiah (opsional)</label>
                <button onClick={addBank} className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Tambah
                </button>
              </div>
              {bankAccounts.length === 0 && (
                <p className="text-xs text-muted italic">Belum ada rekening ditambahkan.</p>
              )}
              <div className="space-y-3">
                {bankAccounts.map((acc, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-gray-50/50 relative">
                    <button onClick={() => removeBank(i)} className="absolute top-2 right-2 text-muted hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input type="text" className={inputClass} placeholder="Nama Bank" value={acc.bank} onChange={(e) => updateBank(i, "bank", e.target.value)} />
                      <input type="text" className={inputClass} placeholder="No. Rekening" value={acc.number} onChange={(e) => updateBank(i, "number", e.target.value)} />
                      <input type="text" className={inputClass} placeholder="Atas Nama" value={acc.name} onChange={(e) => updateBank(i, "name", e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 5: THEME ═══ */}
        {step === 5 && (
          <div className="space-y-5">
            <h3 className="text-xl font-medium border-b border-border pb-4">Pilih Tema Undangan</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {templates.filter((t) => themeRegistry[t.id]).map((t) => {
                const isSelected = selectedTheme === t.id;
                return (
                  <button key={t.id} onClick={() => setSelectedTheme(t.id)}
                    className={`rounded-xl overflow-hidden border-2 text-left transition-all ${isSelected ? "border-primary shadow-lg scale-[1.02]" : "border-border hover:border-primary/50"}`}>
                    <div className="aspect-[3/4] relative" style={{ background: t.bgColor }}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <p className="text-[10px] tracking-widest uppercase font-semibold mb-2" style={{ color: t.primaryColor }}>Undangan</p>
                        <p className="text-2xl font-serif font-bold" style={{ color: t.primaryColor }}>A & D</p>
                        <div className="w-8 h-0.5 my-2" style={{ background: t.accentColor }} />
                        <p className="text-[10px]" style={{ color: t.textColor }}>31 Desember 2026</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Dipilih
                        </div>
                      )}
                      {t.isNew && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">NEW</div>
                      )}
                      {t.isHot && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">🔥 HOT</div>
                      )}
                    </div>
                    <div className="p-3 bg-white">
                      <p className="font-semibold text-sm text-center">{t.name}</p>
                      <p className="text-[10px] text-muted text-center mt-0.5">{t.categoryLabel}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ NAVIGATION ═══ */}
        <div className="pt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-3 border-t border-border mt-6">
          {step > 1 ? (
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>
          ) : (
            <div />
          )}
          {step < 5 ? (
            <Button className="w-full sm:w-auto" onClick={() => setStep(step + 1)}>
              Selanjutnya <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button className="w-full sm:w-auto" onClick={handleSubmit} disabled={saving || !groomName || !brideName}>
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
              ) : (
                <>Simpan Undangan <Check className="w-4 h-4" /></>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
