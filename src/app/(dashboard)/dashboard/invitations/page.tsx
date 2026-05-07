"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash2, Copy, Check, ExternalLink, CreditCard, Loader2, CheckCircle, FileEdit, Calendar, Users, Palette, Pencil } from "lucide-react";

interface Invitation {
  id: string;
  slug: string;
  title: string;
  groom_name: string;
  bride_name: string;
  theme_id: string;
  status: string;
  event_date: string;
  created_at: string;
  rsvps: { count: number }[];
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  async function fetchInvitations() {
    try {
      const res = await fetch("/api/invitations");
      const data = await res.json();
      if (res.ok) {
        setInvitations(data.invitations || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus undangan ini?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/invitations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(null);
    }
  }

  async function handleActivate(inv: Invitation) {
    setCheckingOut(inv.id);
    try {
      // Find the price from theme
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: inv.theme_id,
          invitation_id: inv.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || "Gagal membuat link pembayaran");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Gagal membuat link pembayaran");
    } finally {
      setCheckingOut(null);
    }
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-foreground">Undangan Saya</h2>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Kelola semua undangan digital Anda.</p>
        </div>
        <Link href="/dashboard/invitations/new" className="shrink-0">
          <Button className="gap-2 w-full sm:w-auto text-sm h-9">
            <Plus className="w-4 h-4" /> Buat Baru
          </Button>
        </Link>
      </div>

      {invitations.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-border shadow-sm text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">Belum ada undangan</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Mulai buat undangan pertamamu dan bagikan kebahagiaan.
          </p>
          <Link href="/dashboard/invitations/new">
            <Button>Buat Undangan Sekarang</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {invitations.map((inv) => {
            const rsvpCount = inv.rsvps?.[0]?.count || 0;
            const eventDate = inv.event_date
              ? new Date(inv.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
              : "Belum diatur";

            return (
              <div key={inv.id} className="bg-white rounded-2xl border border-border shadow-sm p-4 md:p-6 flex flex-col gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-foreground text-sm md:text-base truncate">
                      {inv.groom_name && inv.bride_name
                        ? `${inv.groom_name} & ${inv.bride_name}`
                        : inv.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                      inv.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {inv.status === "active" ? <><CheckCircle className="w-3 h-3" /> Aktif</> : <><FileEdit className="w-3 h-3" /> Draft</>}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {eventDate}</span>
                    <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {rsvpCount} RSVP</span>
                    <span className="inline-flex items-center gap-1"><Palette className="w-3 h-3" /> {inv.theme_id}</span>
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-muted">
                    <span className="bg-gray-100 px-2 py-0.5 rounded font-mono truncate max-w-[180px] sm:max-w-[260px]">
                      /{inv.slug}
                    </span>
                  </div>
                </div>

                {/* Actions — wrap on mobile */}
                <div className="flex items-center flex-wrap gap-2">
                  <button onClick={() => copyLink(inv.slug)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 transition-colors">
                    {copiedSlug === inv.slug ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                    <span className="hidden xs:inline">{copiedSlug === inv.slug ? "Tersalin!" : "Salin"}</span>
                  </button>

                  <Link href={`/dashboard/invitations/${inv.id}/edit`}>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                  </Link>

                  <Link href={`/${inv.slug}`} target="_blank">
                    <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Eye className="w-3 h-3" /> Lihat
                    </button>
                  </Link>

                  {inv.status === "draft" && (
                    <button onClick={() => handleActivate(inv)} disabled={checkingOut === inv.id}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50">
                      {checkingOut === inv.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CreditCard className="w-3 h-3" />}
                      Aktifkan
                    </button>
                  )}

                  <button onClick={() => handleDelete(inv.id)} disabled={deleting === inv.id}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 ml-auto">
                    {deleting === inv.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
