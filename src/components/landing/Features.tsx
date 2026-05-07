"use client";

import { motion } from "framer-motion";
import {
  Paintbrush, Users, Infinity, MessageSquare, MapPin,
  Share2, Timer, CalendarCheck, Images, Banknote,
  Music, BookHeart, QrCode, Palette, Zap,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Paintbrush, Users, Infinity, MessageSquare, MapPin,
  Share2, Timer, CalendarCheck, Images, Banknote,
  Music, BookHeart, QrCode, Palette,
};

const features = [
  { title: "Bebas Ganti Semua Tema",      description: "Ganti desain undanganmu kapan saja ke ratusan tema tanpa perlu mengisi data ulang.",                iconName: "Paintbrush"   },
  { title: "Ubah Nama Tamu Unlimited",    description: "Personalisasi setiap undangan dengan nama tamu berbeda-beda tanpa batas kuota.",                    iconName: "Users"        },
  { title: "Tanpa Masa Aktif",            description: "Undangan aktif selamanya. Tidak perlu khawatir link kedaluwarsa sebelum hari-H.",                   iconName: "Infinity"     },
  { title: "RSVP & Ucapan",              description: "Tamu bisa konfirmasi kehadiran dan mengirim ucapan langsung dari undangan.",                         iconName: "MessageSquare"},
  { title: "Terintegrasi Google Maps",    description: "Tampilkan peta lokasi acara langsung di undangan agar tamu mudah menemukan venue.",                 iconName: "MapPin"       },
  { title: "Sebar ke Unlimited Penerima", description: "Bagikan link undangan ke sebanyak mungkin tamu tanpa ada batasan jumlah penerima.",                iconName: "Share2"       },
  { title: "Countdown Hari-H",            description: "Hitung mundur waktu menuju acara yang terus diperbarui secara real-time.",                          iconName: "Timer"        },
  { title: "Pengingat Google Calendar",   description: "Tamu bisa langsung simpan acara ke Google Calendar dengan sekali klik.",                            iconName: "CalendarCheck"},
  { title: "Foto Gallery & Video",        description: "Tampilkan foto-foto kenangan atau video highlight langsung di dalam undangan.",                      iconName: "Images"       },
  { title: "Rekening Titip Hadiah",       description: "Keluarga dan sahabat bisa kirim hadiah digital langsung ke rekening Anda.",                         iconName: "Banknote"     },
  { title: "Background Musik Custom",     description: "Tambahkan lagu favorit sebagai musik latar untuk momen yang lebih berkesan.",                       iconName: "Music"        },
  { title: "Love Story & Susunan Acara",  description: "Ceritakan perjalanan cinta dengan timeline dan tampilkan rundown acara secara rapi.",               iconName: "BookHeart"    },
  { title: "QR Code Buku Tamu",           description: "Tamu bisa check-in dengan scan QR Code untuk pengalaman tamu yang modern.",                         iconName: "QrCode"       },
  { title: "Custom Font & Warna Tema",    description: "Sesuaikan jenis huruf dan palet warna undangan sesuai selera dan estetikamu.",                      iconName: "Palette"      },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="fitur" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Semua yang Kamu Butuhkan,{" "}
            <span className="text-primary">Sudah Ada</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Fitur terlengkap untuk membuat undangan digital yang sempurna,
            dari desain hingga pengelolaan tamu.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto"
        >
          {features.map((feature) => {
            const Icon = iconMap[feature.iconName];
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="p-5 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  {Icon && (
                    <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-2 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-muted text-xs leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
