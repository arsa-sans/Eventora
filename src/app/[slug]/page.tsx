import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTheme } from "@/lib/themeRegistry";
import { createClient } from "@supabase/supabase-js";
import type { InvitationData } from "@/types/invitation";
import { resolveMapUrl } from "@/lib/mapServer";
import Link from "next/link";

// Service role client for server-side data fetching (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ kepada?: string }>;
}

async function fetchInvitation(slug: string): Promise<InvitationData | null> {
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  // Map database row to InvitationData type
  return {
    id: data.id,
    slug: data.slug,
    theme_id: data.theme_id,
    event_type: data.event_type,
    status: data.status,
    is_premium: data.is_premium || false,
    groom_name: data.groom_name,
    bride_name: data.bride_name,
    host_name: data.host_name,
    groom_father: data.groom_father,
    groom_mother: data.groom_mother,
    bride_father: data.bride_father,
    bride_mother: data.bride_mother,
    groom_photo: data.groom_photo,
    bride_photo: data.bride_photo,
    cover_photo: data.cover_photo,
    events: data.events || [],
    event_date: data.event_date,
    event_time: data.event_time,
    event_location: data.event_location,
    event_map_url: data.event_map_url,
    message: data.message,
    love_story: data.love_story || [],
    gallery_images: data.gallery_images || [],
    bank_accounts: data.bank_accounts || [],
    music_url: data.music_url,
    streaming_url: data.streaming_url,
    custom_font: data.custom_font,
    custom_colors: data.custom_colors,
    auto_scroll: data.auto_scroll,
    created_at: data.created_at,
    user_id: data.user_id,
  };
}

/**
 * Halaman blokir untuk undangan yang belum diaktifkan (draft).
 * Ditampilkan saat seseorang mencoba mengakses undangan yang belum dibayar.
 */
function DraftBlockedPage({ groomName, brideName }: { groomName?: string; brideName?: string }) {
  const names = groomName && brideName ? `${groomName} & ${brideName}` : "Pasangan";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 50%, #FDE68A 100%)" }}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"
        style={{ background: "#F59E0B" }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 translate-x-1/3 translate-y-1/3"
        style={{ background: "#D97706" }} />

      <div className="relative z-10 text-center px-8 max-w-md mx-auto">
        {/* Lock icon */}
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 8px 24px rgba(245,158,11,0.3)" }}>
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3" style={{ color: "#92400E" }}>
          Undangan Belum Aktif
        </h1>

        <p className="text-sm leading-relaxed mb-2" style={{ color: "#A16207" }}>
          Undangan <strong>{names}</strong> belum diaktifkan oleh pemiliknya.
        </p>

        <p className="text-xs leading-relaxed mb-8" style={{ color: "#B45309" }}>
          Jika Anda pemilik undangan ini, silakan masuk ke dashboard dan aktifkan undangan melalui pembayaran.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/invitations"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 4px 16px rgba(245,158,11,0.35)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
            </svg>
            Ke Dashboard
          </Link>
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ borderColor: "#F59E0B", color: "#92400E" }}>
            Kembali ke Beranda
          </Link>
        </div>

        <p className="text-[11px] mt-10" style={{ color: "#B45309" }}>
          Dibuat dengan <Link href="/" className="font-semibold hover:underline" style={{ color: "#92400E" }}>Eventora</Link>
        </p>
      </div>
    </div>
  );
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { kepada } = await searchParams;
  const inv = await fetchInvitation(slug);

  if (!inv) return { title: "Undangan tidak ditemukan | Eventora" };

  // Jangan bocorkan informasi untuk undangan draft
  if (inv.status === "draft") {
    return {
      title: "Undangan Belum Aktif | Eventora",
      description: "Undangan ini belum diaktifkan oleh pemiliknya.",
      robots: { index: false, follow: false },
    };
  }

  const guestName = kepada ? decodeURIComponent(kepada) : "Tamu Undangan";
  const names = inv.groom_name && inv.bride_name
    ? `${inv.groom_name} & ${inv.bride_name}`
    : inv.host_name ?? "Acara Spesial";

  return {
    title: `Undangan ${names} — untuk ${guestName} | Eventora`,
    description: `Anda diundang ke acara spesial ${names}. Klik untuk melihat detail undangan, RSVP, dan peta lokasi.`,
    openGraph: {
      title: `Undangan ${names}`,
      description: `${guestName} diundang ke acara ${names}`,
      type: "website",
    },
  };
}

export default async function InvitationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { kepada } = await searchParams;

  const invitation = await fetchInvitation(slug);
  if (!invitation) notFound();

  // SECURITY: Blokir akses publik ke undangan yang belum diaktifkan/dibayar
  if (invitation.status === "draft") {
    return <DraftBlockedPage groomName={invitation.groom_name} brideName={invitation.bride_name} />;
  }

  const theme = getTheme(invitation.theme_id);
  if (!theme) notFound();

  // Inject guest name into data
  const resolvedMapUrl = invitation.event_map_url
    ? await resolveMapUrl(invitation.event_map_url)
    : undefined;

  const dataWithGuest: InvitationData = {
    ...invitation,
    ...(resolvedMapUrl && { event_map_url: resolvedMapUrl }),
    ...(kepada && { guest_name: decodeURIComponent(kepada) } as any),
  };

  const ThemeComponent = theme.component;

  return <ThemeComponent data={dataWithGuest} />;
}
