import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTheme } from "@/lib/themeRegistry";
import { createClient } from "@supabase/supabase-js";
import type { InvitationData } from "@/types/invitation";

// Use service role key to bypass RLS (server-side only) so we can view both draft & active invitations
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

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { kepada } = await searchParams;
  const inv = await fetchInvitation(slug);

  if (!inv) return { title: "Undangan tidak ditemukan | Eventora" };

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

  const theme = getTheme(invitation.theme_id);
  if (!theme) notFound();

  // Inject guest name into data
  const dataWithGuest: InvitationData = {
    ...invitation,
    ...(kepada && { guest_name: decodeURIComponent(kepada) } as any),
  };

  const ThemeComponent = theme.component;

  return <ThemeComponent data={dataWithGuest} />;
}
