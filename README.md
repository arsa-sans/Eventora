This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Eventora — Dokumentasi Perancangan Sistem UML

Dokumentasi lengkap perancangan sistem dan arsitektur aplikasi **Eventora** (Platform SaaS Undangan Digital) menggunakan standar UML (*Unified Modeling Language*) dan format **PlantUML (`.puml`)**. Seluruh diagram dirancang berbasis struktur riil codebase Next.js, API routes, database PostgreSQL (Supabase), dan payment gateway Mayar.id.

---

## 📁 Daftar File Diagram

| No | Tipe Diagram | File | Deskripsi |
|---|---|---|---|
| **01** | **Use Case Diagram** | [`01_usecase_diagram.puml`](./01_usecase_diagram.puml) | Memetakan 4 aktor (*Pengunjung*, *Pengguna Terdaftar*, *Tamu Undangan*, *Mayar Gateway*) dan 27 use case terkelompok ke 6 paket fungsional beserta relasi `<<include>>` dan `<<extend>>`. |
| **02** | **Activity Diagram** | [`02_activity_registrasi_login.puml`](./02_activity_registrasi_login.puml) | Alur registrasi (Email/Password & Google OAuth) dan login dengan partisi swimlane **User** vs **Sistem**. |
| **03** | **Activity Diagram** | [`03_activity_buat_undangan.puml`](./03_activity_buat_undangan.puml) | Alur wizard pembuatan undangan (5 langkah) dengan swimlane **User** vs **Sistem**, termasuk upload foto. |
| **04** | **Activity Diagram** | [`04_activity_aktivasi_pembayaran.puml`](./04_activity_aktivasi_pembayaran.puml) | Alur aktivasi undangan berbayar melalui 3 swimlane (**User**, **Sistem Eventora**, **Mayar Payment Gateway**). |
| **05** | **Activity Diagram** | [`05_activity_kirim_rsvp.puml`](./05_activity_kirim_rsvp.puml) | Alur pengiriman konfirmasi kehadiran (RSVP) & ucapan oleh tamu dengan swimlane **Tamu Undangan** vs **Sistem**. |
| **06** | **Activity Diagram** | [`06_activity_lihat_undangan_publik.puml`](./06_activity_lihat_undangan_publik.puml) | Alur akses publik undangan `/[slug]` (SSR, pengecekan status draft/active, personalisasi nama tamu, interaksi kalender & maps). |
| **07** | **Sequence Diagram** | [`07_sequence_registrasi.puml`](./07_sequence_registrasi.puml) | Urutan pesan dan pemanggilan fungsi/API saat registrasi akun baru (Email Verification & Google OAuth + trigger `handle_new_user`). |
| **08** | **Sequence Diagram** | [`08_sequence_login.puml`](./08_sequence_login.puml) | Urutan autentikasi login (Email/Password dan Google OAuth via Supabase Auth). |
| **09** | **Sequence Diagram** | [`09_sequence_crud_undangan.puml`](./09_sequence_crud_undangan.puml) | Interaksi lengkap controller, API route `/api/invitations`, `/api/upload`, Supabase Server Client, hingga database untuk operasi Create, Read, Update, Delete. |
| **10** | **Sequence Diagram** | [`10_sequence_aktivasi_pembayaran.puml`](./10_sequence_aktivasi_pembayaran.puml) | 4 fase pembayaran: Pembuatan invoice `/api/checkout`, pemrosesan di Mayar, penanganan webhook `/api/webhook/mayar` dengan validasi HMAC SHA-256, dan aktivasi database. |
| **11** | **Sequence Diagram** | [`11_sequence_rsvp.puml`](./11_sequence_rsvp.puml) | Siklus pengiriman RSVP tamu, validasi status undangan aktif, penyisipan database via Service Role, dan penarikan statistik di dashboard pemilik. |
| **12** | **Sequence Diagram** | [`12_sequence_lihat_undangan.puml`](./12_sequence_lihat_undangan.puml) | Alur SSR dynamic route `/[slug]`, resolusi tema dari `themeRegistry`, resolver URL Google Maps, pencegahan akses status draft (`DraftBlockedPage`), dan interaksi komponen client. |
| **13** | **Sequence Diagram** | [`13_sequence_upload_foto.puml`](./13_sequence_upload_foto.puml) | Validasi otentikasi user, pengecekan tipe MIME (JPEG/PNG/WebP/GIF) & batas 5MB, penyimpanan ke Supabase Storage bucket `invitation-images`, dan generasi public URL. |
| **14** | **Entity Relationship Diagram** | [`14_erd.puml`](./14_erd.puml) | Struktur entitas database PostgreSQL Supabase (`auth.users`, `profiles`, `themes`, `invitations`, `rsvps`, `transactions`, `storage.objects`), atribut, tipe data, PK, FK, cardinalities, dan RLS notes. |

---

## 🎨 Panduan Import ke Draw.io

File `.puml` yang telah dibuat dapat langsung di-render ke dalam **Draw.io** / **diagrams.net** dengan langkah-langkah berikut:

### Metode 1: Menggunakan Menu Insert Draw.io (Rekomendasi)
1. Buka [app.diagrams.net](https://app.diagrams.net/) (atau aplikasi desktop Draw.io).
2. Buat diagram baru (*Blank Diagram*).
3. Di menu bar atas, klik **Arrange** (atau ikon **+** di toolbar) $\rightarrow$ **Insert** $\rightarrow$ **Advanced** $\rightarrow$ **PlantUML...**.
4. Buka salah satu file `.puml` di folder `documentation/`, salin seluruh isinya, lalu *paste* ke dalam kotak dialog yang muncul.
5. Klik **Insert**. Draw.io akan mengonversi script PlantUML menjadi diagram visual interaktif yang dapat Anda atur, ubah warna, atau ekspor ke PNG/SVG/PDF.

### Metode 2: Menggunakan PlantText / PlantUML Server
1. Buka [PlantText.com](https://www.planttext.com/) atau [PlantUML Online Editor](https://www.plantuml.com/plantuml/uml/).
2. *Paste* kode dari file `.puml`.
3. Simpan / ekspor gambar ke format **SVG** atau **PNG**.
4. *Drag & drop* file gambar tersebut ke dalam lembar kerja Draw.io.

### Metode 3: Ekstensi VS Code (Opsi Developer)
1. Pasang ekstensi **PlantUML** (`jebbs.plantuml`) di VS Code / Cursor / Windsurf.
2. Buka file `.puml` apa saja di folder `documentation/`.
3. Tekan `Alt + D` (Windows) / `Option + D` (Mac) untuk melihat preview diagram secara live.

---

## 🏗️ Ringkasan Entitas Database (ERD)

```mermaid
erDiagram
    auth_users ||--|| profiles : "id (trigger)"
    profiles ||--o{ invitations : "user_id"
    profiles ||--o{ transactions : "user_id"
    themes ||--o{ invitations : "theme_id"
    invitations ||--o{ rsvps : "invitation_id"
    invitations ||--o{ transactions : "invitation_id"
```

---

## 🛡️ Aturan Keamanan & Akses (RLS & Gatekeeping)
- **Undangan Draft vs Aktif**: Undangan yang belum dibayar berstatus `draft` dan diblokir dari akses publik melalui komponen SSR `DraftBlockedPage` dan verifikasi backend di `/api/rsvp`.
- **Row-Level Security (RLS)**: Diaktifkan pada semua tabel (`profiles`, `invitations`, `rsvps`, `transactions`).
- **Webhook Security**: Webhook Mayar divalidasi menggunakan HMAC SHA-256 signature verification via `crypto.timingSafeEqual` sebelum mengeksekusi aktivasi otomatis.
