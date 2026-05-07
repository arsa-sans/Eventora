import type { Metadata } from "next";
import { TemplateGalleryPage } from "@/components/landing/TemplateGalleryPage";

export const metadata: Metadata = {
  title: "Pilih Tema Undangan Digital Premium | Eventora",
  description:
    "Temukan 12+ tema undangan digital premium untuk pernikahan, ulang tahun, wisuda, khitanan, dan acara lainnya. Preview langsung sebelum membeli.",
  openGraph: {
    title: "Tema Undangan Digital Premium — Eventora",
    description: "12+ tema undangan digital untuk semua jenis acara. Pilih, preview, dan buat undangan dalam 5 menit.",
    type: "website",
  },
};

export default function TemaPage() {
  return <TemplateGalleryPage />;
}
