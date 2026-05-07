import Link from "next/link";
import { Mail, MapPin, Globe, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Template", href: "/tema" },
  { label: "Tutorial", href: "/tutorial" },
];

const helpLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Hubungi Kami", href: "/kontak" },
  { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
  { label: "Kebijakan Privasi", href: "/privasi" },
];

const weddingThemes = [
  { label: "Emerald Garden", href: "/tema/emerald-garden/preview" },
  { label: "Rose Blush", href: "/tema/rose-blush/preview" },
  { label: "Midnight Noir", href: "/tema/midnight-noir/preview" },
  { label: "Minimalist White", href: "/tema/minimalist-white/preview" },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--gradient-footer)" }}>
      {/* Main footer */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm font-serif">E</span>
              </div>
              <span className="text-xl font-serif font-bold text-white">
                Eventora<span className="text-primary-light">.</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Platform undangan pernikahan digital dengan tema premium. Buat undangan impianmu
              dalam 5 menit — elegan, mudah, dan harga terjangkau.
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              <a href="mailto:info@eventora.id"
                className="flex items-center gap-2.5 text-white/60 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4 text-primary-light shrink-0" />
                info@eventora.id
              </a>
              <div className="flex items-center gap-2.5 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-primary-light shrink-0" />
                Indonesia
              </div>
              <a href="https://instagram.com/eventora.id"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/60 hover:text-white text-sm transition-colors">
                <Globe className="w-4 h-4 text-primary-light shrink-0" />
                @eventora.id
              </a>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tema Pernikahan */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              Tema Pernikahan
            </h4>
            <ul className="space-y-3">
              {weddingThemes.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              Bantuan
            </h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* WhatsApp CTA */}
            <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-white/80 text-xs font-semibold mb-2 flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3" /> Ada pertanyaan?
              </p>
              <p className="text-white/50 text-xs mb-3">
                Chat admin kami via WhatsApp, siap 07.00–24.00 WIB
              </p>
              <a
                href="https://wa.me/6282114073679"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#25D366" }}
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment methods bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">
              Metode Pembayaran yang Didukung:
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {["QRIS", "BCA", "BNI", "BRI", "Mandiri", "DANA", "OVO"].map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 bg-white/10 rounded-md text-white/60 text-[10px] font-semibold"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-white/40 text-xs">
            <p>© {new Date().getFullYear()} Eventora. Seluruh hak cipta dilindungi.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
