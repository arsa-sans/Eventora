export interface LoveStoryItem {
  date: string;
  title: string;
  description: string;
}

export interface BankAccount {
  bank: string;
  number: string;
  name: string;
}

export interface EventDetail {
  name: string;        // e.g. "Akad Nikah" / "Resepsi"
  date: string;        // ISO date string
  time: string;        // e.g. "08:00 WIB"
  location: string;
  map_url?: string;
}

export interface InvitationData {
  // Core
  id: string;
  slug: string;
  theme_id: string;
  event_type: string;  // 'wedding' | 'birthday' | 'khitanan' | etc.
  status: "draft" | "active";
  is_premium: boolean;

  // Couple / Host info
  groom_name?: string;
  bride_name?: string;
  host_name?: string;          // for non-wedding events
  groom_father?: string;
  groom_mother?: string;
  bride_father?: string;
  bride_mother?: string;
  groom_photo?: string;
  bride_photo?: string;
  cover_photo?: string;

  // Events (supports multiple: akad + resepsi)
  events?: EventDetail[];

  // Legacy single-event fields
  event_date?: string;
  event_time?: string;
  event_location?: string;
  event_map_url?: string;

  // Content
  message?: string;
  love_story?: LoveStoryItem[];
  gallery_images?: string[];

  // Features
  music_url?: string;
  streaming_url?: string;
  bank_accounts?: BankAccount[];

  // Customization
  custom_font?: string;
  custom_colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
  auto_scroll?: boolean;

  // Meta
  created_at?: string;
  user_id?: string;
  guest_name?: string;
}

export interface RSVPData {
  guest_name: string;
  attendance: "yes" | "no" | "maybe";
  message?: string;
  pax?: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  category: string;
  price: number;
  primaryColor: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  fontDisplay?: string;
  fontBody?: string;
  isNew?: boolean;
  isHot?: boolean;
}
