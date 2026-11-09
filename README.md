# Nihongo_repo (日本語レポ)

> **Koleksi Terkurasi Sumber Belajar & Buku Bahasa Jepang di Cloudflare Edge**

Nihongo_repo adalah aplikasi web repository materi pembelajaran bahasa Jepang (buku teks, tata bahasa, kanji, audio, dan lembar soal ujian JLPT N5–N1) yang ringan, cepat, dan elegan. Aplikasi ini di-deploy di **Cloudflare Pages** dengan database serverless **Cloudflare D1** dan penyimpanan berkas langsung di **Google Drive**.

Dilengkapi dengan antarmuka katalog publik bertema *Digital Washi & Sumi-e* serta **Admin CMS** mandiri untuk mengelola materi, buku, dan kategori.

---

## ✨ Fitur Utama

### 📖 Katalog Publik
* **Tampilan Fleksibel:** Beralih antara **Grid View** (kartu visual estetik) dan **Table View** (tabel padat untuk browsing cepat).
* **Pencarian Reaktif Instan:** Filter langsung berdasarkan judul Latin, Romaji, Kanji asli Jepang, maupun nama pengarang tanpa refresh browser (Shortcut: <kbd>/</kbd>).
* **Filter Multifaset:** Filter per tingkat JLPT (`N5`, `N4`, `N3`, `N2`, `N1`, `ALL`) dan per kategori (`Tata Bahasa`, `Kanji`, `Kosakata`, `Membaca`, `Menyimak`, `Bank Soal`).
* **Modal Detail Materi:** Pratinjau informasi buku, metadata berkas, tombol salin tautan, dan tombol langsung **"Buka di Drive"**.

### 🛡️ Admin CMS (`/admin`)
* **Autentikasi Aman:** Dilindungi SSR middleware dengan signed HMAC-SHA256 cookie session (`/admin/login`).
* **Ringkasan Metrik Dashboard:** Statistik total materi, total kategori, total klik Google Drive, distribusi per level JLPT, dan 5 materi paling sering diakses.
* **Manajemen Materi (CRUD):** Tambah materi baru dengan auto-extract ID Google Drive, edit data, dan hapus materi dengan modal konfirmasi.
* **Manajemen Kategori:** Tambah kategori baru dengan proteksi integritas data (tidak bisa dihapus jika kategori masih memiliki materi aktif).

---

## 🛠️ Tech Stack

* **Framework:** [Astro v5](https://astro.build/) (Server-Side Rendering / SSR)
* **Hosting & Runtime:** [Cloudflare Pages](https://pages.cloudflare.com/) via `@astrojs/cloudflare`
* **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQLite)
* **ORM:** [Drizzle ORM](https://orm.drizzle.team/) + Drizzle Kit
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + `@lucide/astro`
* **Desain UI/UX:** Mengikuti prinsip *Digital Washi & Sumi-e* (Stitch Prototype ID: `407598114321150448`)

---

## 🚀 Menjalankan Secara Lokal

1. **Clone & Masuk ke Folder Proyek:**
   ```bash
   cd Projects/Web/nihongo_repo
   ```

2. **Install Dependensi:**
   ```bash
   npm install
   ```

3. **Inisialisasi Database D1 Lokal & Seeding Data:**
   ```bash
   # Jalankan migrasi tabel
   npx wrangler d1 execute nihongo-repo-db --local --file=./schema.sql

   # Masukkan data awal (JLPT levels, kategori, akun admin, koleksi buku awal)
   npx wrangler d1 execute nihongo-repo-db --local --file=./src/db/seed.sql
   ```

4. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Buka browser di:
   * **Katalog Publik:** [http://localhost:4321](http://localhost:4321)
   * **Admin CMS:** [http://localhost:4321/admin/login](http://localhost:4321/admin/login)
     * **Username:** `admin`
     * **Password:** `admin123`

5. **Build Uji Produksi:**
   ```bash
   npm run build
   ```

---

## 📚 Dokumentasi Lengkap

Seluruh dokumen spesifikasi teknis dan rencana implementasi dapat dibaca di folder [`doc/`](./doc):
* 📋 **[`doc/PRD.md`](./doc/PRD.md)** — *Product Requirements Document*
* 🏗️ **[`doc/ARCHITECTURE.md`](./doc/ARCHITECTURE.md)** — Arsitektur sistem & integrasi Cloudflare
* 🗄️ **[`doc/DATABASE_SCHEMA.md`](./doc/DATABASE_SCHEMA.md)** — Skema database D1 & ERD
* 🎨 **[`doc/DESIGN_RULES.md`](./doc/DESIGN_RULES.md)** — Panduan token warna & tipografi
* 📅 **[`doc/IMPLEMENTATION_PLAN.md`](./doc/IMPLEMENTATION_PLAN.md)** — Riwayat eksekusi Fase 1 - 7
* 🚀 **[`doc/DEPLOYMENT_GUIDE.md`](./doc/DEPLOYMENT_GUIDE.md)** — Panduan lengkap deploy ke Cloudflare Pages

---

## 📝 Lisensi
Dibuat untuk komunitas pembelajar bahasa Jepang. Bebas digunakan dan dikembangkan untuk keperluan edukasi.
