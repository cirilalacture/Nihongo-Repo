# Nihongo_repo (日本語レポ)

<p align="center">
  <img src="https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80" alt="Nihongo Repo Banner" width="100%" style="border-radius: 16px; max-height: 320px; object-fit: cover;" />
</p>

<p align="center">
  <strong>Direktori Terkurasi Sumber Belajar & Buku Bahasa Jepang di Cloudflare Edge</strong>
</p>

<p align="center">
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-v7%20SSR-BC52EE?style=flat-square&logo=astro&logoColor=white" alt="Astro v7" /></a>
  <a href="https://pages.cloudflare.com"><img src="https://img.shields.io/badge/Cloudflare-Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Pages" /></a>
  <a href="https://developers.cloudflare.com/d1/"><img src="https://img.shields.io/badge/Cloudflare-D1%20SQLite-F38020?style=flat-square&logo=sqlite&logoColor=white" alt="Cloudflare D1" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://playwright.dev"><img src="https://img.shields.io/badge/E2E_Tests-12%2F12%20Passed%20(100%25)-2EAD33?style=flat-square&logo=playwright&logoColor=white" alt="Playwright Tests" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License MIT" /></a>
</p>

---

## 📖 Tentang Proyek

**Nihongo_repo** (日本語レポ) adalah platform web katalog dan repositori materi pembelajaran bahasa Jepang (buku teks, tata bahasa, kanji, audio pemahaman, dan bank soal JLPT N5–N1) yang dibangun dengan standar performa tinggi. 

Dirancang dengan filosofi visual **Digital Washi & Sumi-e** (terinspirasi dari tekstur kertas tradisional Jepang dan kontras tinta kaligrafi), website ini menyajikan materi secara terstruktur, bebas iklan yang mengganggu, serta terhubung langsung ke berkas penyimpanan di **Google Drive**.

Selain antarmuka publik, proyek ini dilengkapi **Admin CMS** mandiri yang diproteksi autentikasi *edge-level session* untuk memudahkan penambahan dan kurasi materi secara visual tanpa coding manual.

---

## ✨ Fitur Utama

### 1. Katalog Publik (Public Catalog)
* **Pencarian Reaktif Instan:** Cari materi berdasarkan judul Latin, Romaji, Kanji Jepang asli, maupun nama pengarang seketika tanpa perlu memuat ulang halaman (Shortcut pencarian: <kbd>/</kbd>).
* **Filter Multifaset JLPT & Topik:**
  * **Level JLPT:** `N5 (Pemula)`, `N4 (Dasar Lanjutan)`, `N3 (Menengah)`, `N2 (Pra-Mahir)`, `N1 (Tingkat Mahir)`, dan `ALL (Semua Level / Materi Umum)`.
  * **Kategori Topik:** `Tata Bahasa (Bunpou)`, `Huruf & Kanji`, `Kosakata (Goi)`, `Membaca (Dokkai)`, `Menyimak & Audio (Choukai)`, dan `Bank Soal (Mondai)`.
* **Dua Mode Tampilan Fleksibel:** Beralih antara **Grid View** (kartu visual estetik) dan **Compact Table View** (tabel padat untuk pemindaian cepat puluhan buku).
* **Desain Responsif Adaptif (Mobile, Tablet, Desktop):** Drawer menu navigasi mobile yang rapi, bar filter sentuh horizontal tanpa overflow, target sentuhan jari minimal 44px, dan modal detail adaptif (berubah menjadi *bottom sheet* di smartphone dan kartu terpusat di tablet/desktop).
* **Modal Detail Materi:** Membuka rangkuman buku, daftar isi, penerbit, tahun rilis, ukuran berkas, tombol **Salin Link** (*one-click clipboard*), dan tombol langsung **Buka di Google Drive**.
* **Pelacak Popularitas Berkas:** Mencatat jumlah klik tautan secara otomatis ke database Cloudflare D1.

### 2. Admin CMS Dashboard (`/admin`)
* **Keamanan Edge Middleware:** Seluruh rute `/admin/*` diproteksi middleware server-side dengan session token terenkripsi HMAC-SHA256 (`HttpOnly` cookie).
* **Mobile-First Admin Navigation:** Dilengkapi *sticky bottom navigation bar* pada layar ponsel/tablet untuk beralih instan antara Ringkasan Metrik, Kelola Materi, Tambah Buku, dan Kelola Kategori tanpa repot scrolling ke atas.
* **Ringkasan Statistik Real-time:** Memantau total buku, total kategori, total klik Google Drive, serta grafik distribusi materi per tingkat JLPT.
* **Manajemen Materi (CRUD Lengkap):**
  * Form penambahan materi baru yang otomatis mengekstrak *File ID* dari URL berbagi Google Drive.
  * Dukungan berbagai format file: `PDF`, `AUDIO_ZIP`, `ANKI`, dan `EXCEL`.
  * Status kontrol publikasi (`Publik` vs `Draft`) dan penanda khusus *"Pilihan Sensei"* (*Featured*).
  * Form edit materi dan dialog modal konfirmasi sebelum menghapus data.
* **Manajemen Kategori:** Tambah dan atur urutan kategori dengan proteksi integritas relasi data (kategori tidak dapat dihapus jika masih menampung materi aktif).

---

## 🏗️ Arsitektur Sistem

```mermaid
flowchart TD
    User([Pengguna / Pembelajar]) -->|Akses Katalog| CDN[Cloudflare Global Edge]
    Admin([Administrator]) -->|Akses CMS /admin| CDN

    CDN -->|Server-Side Rendering| AstroApp[Astro v7 SSR Runtime]
    
    subgraph Astro App Logic
        AstroApp -->|Route Guard Middleware| AuthGuard{Admin Valid?}
        AuthGuard -->|Ya| AdminCMS[Admin CMS Dashboard]
        AuthGuard -->|Tidak| AdminLogin[Redirect ke /admin/login]
        AstroApp --> PublicCatalog[Public Catalog Interface]
    end

    subgraph Cloudflare Infrastructure
        AdminCMS -->|Drizzle ORM Queries| D1[(Cloudflare D1 Database)]
        PublicCatalog -->|Drizzle ORM Queries| D1
    end

    subgraph External Storage
        User -->|Unduh / Baca Berkas| GDrive[(Google Drive Cloud)]
    end
```

---

## 🛠️ Tech Stack & Ekosistem

* **Framework:** [Astro v7](https://astro.build/) (`^7.4.7`, `output: 'server'` dengan adapter `@astrojs/cloudflare` v14)
* **Hosting & Runtime:** [Cloudflare Pages](https://pages.cloudflare.com/) (V8 Edge Isolate)
* **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQL SQLite distributed globally)
* **ORM:** [Drizzle ORM](https://orm.drizzle.team/) + Drizzle Kit
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + `@lucide/astro`
* **Testing:** [Playwright](https://playwright.dev/) End-to-End Test Suite (Headless Chromium)
* **Keamanan:** Web Crypto API native (PBKDF2 SHA-256 password hash + HMAC session signature)
* **Desain Sistem:** Konsep *Digital Washi & Sumi-e* (Stitch Prototype Project ID: `407598114321150448`)

---

## 🚀 Memulai Secara Lokal (Local Development)

### 1. Prasyarat
* [Node.js](https://nodejs.org/) versi 20+ atau 22+
* npm versi 10+

### 2. Instalasi & Setup Proyek
```bash
# Masuk ke folder proyek
cd Projects/Web/nihongo_repo

# Install dependensi
npm install
```

### 3. Migrasi & Seeding Database D1 Lokal
```bash
# 1. Jalankan skema tabel database lokal
npx wrangler d1 execute nihongo-repo-db --local --file=./schema.sql

# 2. Masukkan data awal level JLPT, kategori, dan koleksi materi awal
npx wrangler d1 execute nihongo-repo-db --local --file=./src/db/seed.sql
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka browser pada alamat:
* **Katalog Publik:** `http://localhost:4321`
* **Admin CMS Login:** `http://localhost:4321/admin/login`
  * **Username:** `admin`
  * **Password:** `admin123`

---

## 🧪 Menjalankan Pengujian E2E (Playwright)

Proyek ini telah dilengkapi dengan suite pengujian otomatis end-to-end yang menguji alur pengguna publik dan admin secara menyeluruh:

```bash
# Jalankan seluruh skenario E2E test
npm run test:e2e
```

**Cakupan Skenario Uji:**
* ✅ Tampilan tema visual & branding Washi Paper
* ✅ Pencarian reaktif instan berdasarkan keyword
* ✅ Filter chip level JLPT (N5 - N1)
* ✅ Switcher tampilan Grid View & Table View
* ✅ Interaksi pop-up Modal Detail & Salin Tautan Google Drive
* ✅ Route guard redirection untuk akses yang belum terautentikasi
* ✅ Alur login admin dengan kredensial valid
* ✅ Navigasi admin, tabel materi, dan penambahan kategori

---

## ☁️ Panduan Deployment (GitHub ➔ Cloudflare Pages)

1. **Buat Database D1 di Cloudflare:**
   ```bash
   npx wrangler d1 create nihongo-repo-db
   ```
2. **Jalankan Migrasi & Seeding ke Production (Remote):**
   ```bash
   npx wrangler d1 execute nihongo-repo-db --remote --file=./schema.sql
   npx wrangler d1 execute nihongo-repo-db --remote --file=./src/db/seed.sql
   ```
3. **Hubungkan Repository ke Cloudflare Pages:**
   * Di Cloudflare Dashboard, pilih **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   * Pilih repository GitHub Anda.
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
   * **Environment variable:** `NODE_VERSION` = `22`
4. **Pasang Binding Database D1:**
   * Buka project Pages > **Settings** > **Functions** > **D1 Database Bindings**.
   * Tambahkan binding dengan nama variabel: `DB` dan arahkan ke database `nihongo-repo-db`.
   * Klik **Save** dan lakukan redeploy.

> 📖 Panduan lengkap dan troubleshooting operasional dapat dilihat di [`doc/DEPLOYMENT_GUIDE.md`](./doc/DEPLOYMENT_GUIDE.md).

---

## 📚 Direktori Dokumentasi Teknis

| Dokumen | Deskripsi |
| :--- | :--- |
| 📋 **[`doc/PRD.md`](./doc/PRD.md)** | *Product Requirements Document*: visi produk, audiens, dan fitur lengkap. |
| 🏗️ **[`doc/ARCHITECTURE.md`](./doc/ARCHITECTURE.md)** | Arsitektur teknis Astro SSR, Cloudflare Workers, dan middleware session. |
| 🗄️ **[`doc/DATABASE_SCHEMA.md`](./doc/DATABASE_SCHEMA.md)** | Diagram ERD Mermaid, skema tabel D1, dan seed SQL. |
| 🎨 **[`doc/DESIGN_RULES.md`](./doc/DESIGN_RULES.md)** | Panduan token warna, tipografi Noto Sans JP, dan aturan komponen UI. |
| 📅 **[`doc/IMPLEMENTATION_PLAN.md`](./doc/IMPLEMENTATION_PLAN.md)** | Riwayat eksekusi Fase 1 hingga Fase 7 (Semua fase telah selesai 100%). |
| 🚀 **[`doc/DEPLOYMENT_GUIDE.md`](./doc/DEPLOYMENT_GUIDE.md)** | Panduan lengkap langkah demi langkah deploy ke Cloudflare Pages. |

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi [MIT](./LICENSE). Dibuat untuk mendukung komunitas pembelajar bahasa Jepang di seluruh dunia.
