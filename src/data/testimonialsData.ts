export interface Testimonial {
  id: number;
  name: string;
  eventType: string;
  review: string;
  rating: number;
  initials: string;
  color: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ardy & Dwivia",
    eventType: "Pernikahan",
    review: "Suka banget sama hasilnya, seriusan nggak nyangka bakal sebagus ini! Desainnya elegan dan prosesnya sangat cepat. Highly recommended!",
    rating: 5,
    initials: "AD",
    color: "#059669",
  },
  {
    id: 2,
    name: "Rifky & Destri",
    eventType: "Pernikahan",
    review: "Prosesnya cepat, setiap revisi yang aku minta langsung ditangani dengan baik. Tamu-tamu juga banyak yang tanya bikin di mana, keren banget!",
    rating: 5,
    initials: "RD",
    color: "#7C3AED",
  },
  {
    id: 3,
    name: "Pande & Desak",
    eventType: "3 Bulanan",
    review: "Pelayanan super ramah, harganya sangat terjangkau tapi hasilnya di luar ekspektasi. Suka banget, pasti bakal pakai lagi!",
    rating: 5,
    initials: "PD",
    color: "#DB2777",
  },
  {
    id: 4,
    name: "Eko Pujianto",
    eventType: "Grand Opening",
    review: "Bagus dan sesuai ekspektasi. Desainnya terlihat profesional dan cocok banget untuk acara peluncuran bisnis kami.",
    rating: 5,
    initials: "EP",
    color: "#0284C7",
  },
  {
    id: 5,
    name: "Bima & Tri",
    eventType: "Pernikahan",
    review: "Pelayanannya super ramah dan selalu siap membantu setiap kali butuh revisi. Pokoknya nggak ada komplain, 10 bintang!",
    rating: 5,
    initials: "BT",
    color: "#EA580C",
  },
  {
    id: 6,
    name: "Dwiputra Malla",
    eventType: "Tahbisan Imam",
    review: "Keren banget! Benar-benar puas sama hasilnya. Desainnya luar biasa dan sesuai dengan harapan kami untuk acara sakral ini.",
    rating: 5,
    initials: "DM",
    color: "#166534",
  },
  {
    id: 7,
    name: "Babam & Andim",
    eventType: "Pernikahan",
    review: "Best pokoknya! Dari awal sampai akhir proses semuanya berjalan lancar dan memuaskan. Undangannya cantik banget!",
    rating: 5,
    initials: "BA",
    color: "#92400E",
  },
  {
    id: 8,
    name: "Koko & Dita",
    eventType: "Pernikahan",
    review: "Bener-bener nggak nyesel pilih Eventora untuk acara spesialku. Temanya lengkap, harganya masuk akal. Sukses terus!",
    rating: 5,
    initials: "KD",
    color: "#6366F1",
  },
];
