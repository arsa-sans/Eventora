export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Apa itu undangan digital?",
    answer:
      "Undangan digital adalah undangan yang dibuat dalam bentuk link website, biasanya dibagikan melalui WhatsApp, media sosial, atau email. Tamu bisa langsung melihat detail acara, konfirmasi kehadiran (RSVP), dan mengirim ucapan tanpa perlu undangan fisik.",
  },
  {
    question: "Apakah benar-benar gratis untuk mencoba?",
    answer:
      "Ya! Kamu bisa membuat undangan dan melihat hasilnya secara gratis tanpa batas waktu. Namun, untuk bisa disebarkan ke tamu (tanpa watermark), undangan perlu diaktifkan terlebih dahulu sesuai paket yang dipilih.",
  },
  {
    question: "Kenapa undangan harus diaktifkan?",
    answer:
      "Dengan mengaktifkan undangan, semua fitur terbuka penuh: tamu bisa melihat konten tanpa watermark, RSVP bisa diterima, dan undangan bisa disebarkan ke unlimited penerima. Biaya aktivasi digunakan untuk mendukung layanan dan server kami.",
  },
  {
    question: "Bagaimana cara mengaktifkan undangan?",
    answer:
      "Setelah membuat undangan, buka halaman Dashboard dan klik tombol 'Aktifkan'. Pilih paket yang sesuai, lakukan pembayaran, dan undangan akan langsung aktif otomatis. Kamu juga bisa menghubungi admin kami via WhatsApp untuk dibantu proses aktivasi.",
  },
  {
    question: "Metode pembayaran apa yang tersedia?",
    answer:
      "Eventora mendukung berbagai metode pembayaran: QRIS, Transfer Bank (BCA, BNI, BRI, Mandiri), Virtual Account, dan e-Wallet (OVO, DANA, GoPay). Pembayaran diproses secara otomatis.",
  },
  {
    question: "Setelah diaktifkan, apakah undangan masih bisa diedit?",
    answer:
      "Tentu saja! Bahkan sangat disarankan untuk mengaktifkan undangan terlebih dahulu sebelum mulai editing, karena semua fitur yang terkunci akan terbuka dan bisa langsung digunakan. Kamu bebas mengedit kapan saja.",
  },
  {
    question: "Bisa ganti nama tamu di undangan tanpa batas?",
    answer:
      "Bisa! Cukup tambahkan parameter nama di link undangan: contoh eventora.com/slug?kepada=Nama+Tamu. Kamu bisa membuat pesan personal untuk setiap tamu tanpa biaya tambahan dan tanpa batas.",
  },
  {
    question: "Apakah bisa request tema atau desain custom?",
    answer:
      "Tentu! Kami menerima request tema custom untuk berbagai jenis acara. Kamu bisa memberikan referensi desain yang diinginkan atau brief kebutuhan, dan tim kami akan membuat tema sesuai selera.",
  },
];
