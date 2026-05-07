import type { InvitationData } from "@/types/invitation";
import { templates } from "@/data/templatesData";

// Generate sample invitation data for any template ID
export function getSampleData(themeId: string): InvitationData {
  const template = templates.find((t) => t.id === themeId);
  const isWedding = template?.category === "pernikahan" || template?.category === "keagamaan";
  const isBirthday = template?.category === "ulangtahun";

  const base: InvitationData = {
    id: `preview-${themeId}`,
    slug: `preview-${themeId}`,
    theme_id: themeId,
    event_type: isWedding ? "wedding" : isBirthday ? "birthday" : "formal",
    status: "active",
    is_premium: true,
    event_date: new Date(Date.now() + 45 * 86400000).toISOString(),
    event_location: "Ballroom Grand Hotel, Jl. Sudirman No. 1, Jakarta Pusat",
    event_map_url:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613507946!3d-6.194348395501471!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5390917b759%3A0x6b45e67356080477!2sGrand%20Indonesia!5e0!3m2!1sen!2sid!4v1619099277448!5m2!1sen!2sid",
    message: isWedding
      ? "Dengan memohon Rahmat dan Ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan acara pernikahan kami."
      : "Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di acara spesial kami.",
    gallery_images: [],
    bank_accounts: [
      { bank: "BCA", number: "1234567890", name: "Ardy Santoso" },
      { bank: "BNI", number: "0987654321", name: "Dwivia Wijaya" },
    ],
    love_story: isWedding
      ? [
          { date: "Maret 2020", title: "Pertama Bertemu", description: "Kami pertama kali bertemu di sebuah acara kampus dan langsung merasa ada kecocokan yang luar biasa." },
          { date: "Juni 2021", title: "Mulai Berpacaran", description: "Setelah setahun berteman dekat, akhirnya Ardy memberanikan diri untuk mengungkapkan perasaannya." },
          { date: "Desember 2025", title: "Lamaran", description: "Di malam Tahun Baru yang penuh bintang, Ardy melamar Dwivia dengan cincin yang sudah disiapkan berbulan-bulan." },
          { date: "2026", title: "Menuju Pernikahan", description: "Kami memutuskan untuk menyatukan hati dan membangun rumah tangga yang indah bersama." },
        ]
      : [],
    // Couple info
    groom_name: "Ardy",
    bride_name: "Dwivia",
    host_name: isBirthday ? "Sinta Permata" : undefined,
    groom_father: "Bpk. Rudi Santoso",
    groom_mother: "Ibu. Sari Santoso",
    bride_father: "Bpk. Hendra Wijaya",
    bride_mother: "Ibu. Maya Wijaya",
  };

  return base;
}
