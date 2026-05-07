"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Users, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({ invitations: 0, rsvps: 0, activeCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/invitations");
        const data = await res.json();
        const invitations = data.invitations || [];
        const totalRsvps = invitations.reduce(
          (sum: number, inv: any) => sum + (inv.rsvps?.[0]?.count || 0), 0
        );
        const activeCount = invitations.filter((inv: any) => inv.status === "active").length;
        setStats({
          invitations: invitations.length,
          rsvps: totalRsvps,
          activeCount,
        });
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Undangan", value: stats.invitations, icon: Mail, color: "bg-primary/10 text-primary" },
    { label: "Total RSVP Tamu", value: stats.rsvps, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Undangan Aktif", value: stats.activeCount, icon: CreditCard, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-foreground">Selamat Datang!</h2>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Kelola undangan digital Anda di sini.</p>
        </div>
        <Link href="/dashboard/invitations/new" className="shrink-0">
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Buat Undangan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-text-secondary font-medium">{card.label}</h3>
              </div>
              {loading ? (
                <Loader2 className="w-6 h-6 text-muted animate-spin" />
              ) : (
                <p className="text-4xl font-serif text-foreground">{card.value}</p>
              )}
            </div>
          );
        })}
      </div>

      {!loading && stats.invitations === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-border shadow-sm text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">Belum ada undangan</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Mulai buat undangan pertamamu dan bagikan kebahagiaan dengan orang-orang terdekat.
          </p>
          <Link href="/dashboard/invitations/new">
            <Button>Buat Undangan Sekarang</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
