"use client";

import { useEffect, useState } from "react";
import { Users, Check, X, HelpCircle, Loader2, CheckCircle, XCircle, CircleHelp } from "lucide-react";

interface RSVP {
  id: string;
  guest_name: string;
  attendance: string;
  message: string;
  pax: number;
  created_at: string;
}

interface Invitation {
  id: string;
  slug: string;
  groom_name: string;
  bride_name: string;
  title: string;
}

export default function RSVPPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInv, setSelectedInv] = useState<string>("");
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRsvps, setLoadingRsvps] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/invitations");
        const data = await res.json();
        const invs = data.invitations || [];
        setInvitations(invs);
        if (invs.length > 0) {
          setSelectedInv(invs[0].id);
          await fetchRSVPs(invs[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function fetchRSVPs(invId: string) {
    setLoadingRsvps(true);
    try {
      const res = await fetch(`/api/rsvp?invitation_id=${invId}`);
      const data = await res.json();
      setRsvps(data.rsvps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRsvps(false);
    }
  }

  function handleSelectInv(invId: string) {
    setSelectedInv(invId);
    fetchRSVPs(invId);
  }

  const attendCount = rsvps.filter((r) => r.attendance === "yes").length;
  const declineCount = rsvps.filter((r) => r.attendance === "no").length;
  const maybeCount = rsvps.filter((r) => r.attendance === "maybe").length;
  const totalPax = rsvps.filter((r) => r.attendance === "yes").reduce((s, r) => s + (r.pax || 1), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif text-foreground">Data RSVP</h2>
        <p className="text-text-secondary mt-1 text-sm md:text-base">Lihat respons kehadiran tamu undangan Anda.</p>
      </div>

      {invitations.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-border text-center">
          <p className="text-muted">Belum ada undangan. Buat undangan terlebih dahulu.</p>
        </div>
      ) : (
        <>
          {/* Invitation selector */}
          <div className="bg-white rounded-2xl border border-border p-4">
            <label className="text-xs font-semibold text-muted block mb-2">Pilih Undangan:</label>
            <select
              value={selectedInv}
              onChange={(e) => handleSelectInv(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border text-sm outline-none focus:border-primary"
            >
              {invitations.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.groom_name && inv.bride_name
                    ? `${inv.groom_name} & ${inv.bride_name}`
                    : inv.title}
                </option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-border text-center">
              <p className="text-2xl font-serif text-foreground">{rsvps.length}</p>
              <p className="text-xs text-muted mt-1">Total RSVP</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl border border-green-200 text-center">
              <p className="text-2xl font-serif text-green-700">{attendCount}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3" /> Hadir ({totalPax} orang)</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-center">
              <p className="text-2xl font-serif text-red-700">{declineCount}</p>
              <p className="text-xs text-red-600 mt-1 flex items-center justify-center gap-1"><XCircle className="w-3 h-3" /> Tidak Hadir</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
              <p className="text-2xl font-serif text-amber-700">{maybeCount}</p>
              <p className="text-xs text-amber-600 mt-1 flex items-center justify-center gap-1"><CircleHelp className="w-3 h-3" /> Mungkin</p>
            </div>
          </div>

          {/* RSVP List */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            {loadingRsvps ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : rsvps.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-10 h-10 text-muted mx-auto mb-3" />
                <p className="text-muted">Belum ada RSVP yang masuk.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold text-muted">Nama Tamu</th>
                      <th className="text-left px-5 py-3 font-semibold text-muted">Kehadiran</th>
                      <th className="text-left px-5 py-3 font-semibold text-muted">Jumlah</th>
                      <th className="text-left px-5 py-3 font-semibold text-muted">Ucapan</th>
                      <th className="text-left px-5 py-3 font-semibold text-muted">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="border-b border-border last:border-0 hover:bg-gray-50/50">
                        <td className="px-5 py-3 font-medium">{rsvp.guest_name}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            rsvp.attendance === "yes" ? "bg-green-100 text-green-700" :
                            rsvp.attendance === "no" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {rsvp.attendance === "yes" ? <><Check className="w-3 h-3" /> Hadir</> :
                             rsvp.attendance === "no" ? <><X className="w-3 h-3" /> Tidak</> :
                             <><HelpCircle className="w-3 h-3" /> Mungkin</>}
                          </span>
                        </td>
                        <td className="px-5 py-3">{rsvp.pax || 1} orang</td>
                        <td className="px-5 py-3 text-muted max-w-[200px] truncate">{rsvp.message || "-"}</td>
                        <td className="px-5 py-3 text-muted text-xs">
                          {new Date(rsvp.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
