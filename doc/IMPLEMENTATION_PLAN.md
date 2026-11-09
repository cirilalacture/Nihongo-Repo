# Implementation Plan — Nihongo_repo

Dokumen ini memuat jadwal, status pengerjaan saat ini, dan panduan langkah demi langkah untuk membangun dan mendeploy **Nihongo_repo** ke Cloudflare Pages dengan database Cloudflare D1.

> **STATUS PROGRES TERKINI (Updated: 2026-11-08):**
> * [x] **Fase 1: Scaffolding Proyek & Konfigurasi Cloudflare** — `SELESAI (Completed)`
> * [x] **Fase 2: Setup Database D1, Drizzle Schema & Client** — `SELESAI (Completed)`
> * [x] **Fase 3: Seeding Data Awal & Kredensial Admin** — `SELESAI (Completed)`
> * [x] **Fase 4: Pengembangan Komponen Katalog Publik** — `SELESAI (Completed)`
> * [x] **Fase 5: Pencarian Instan & Filter Interaktif** — `SELESAI (Completed)`
> * [x] **Fase 6: Pembangunan Admin CMS (Auth, CRUD Materi & Kategori)** — `SELESAI (Completed)`
> * [ ] **Fase 7: Pengujian, Audit Perf/a11y & Deploy Pages** — `BERIKUTNYA (Next Up)`

---

## 📅 Roadmap Tahapan Pengembangan

```mermaid
gantt
    title Status Implementasi Nihongo_repo
    dateFormat  YYYY-MM-DD
    section Fase 1 (Selesai)
    Scaffolding Proyek & Config Astro Cloudflare :done, f1, 2026-11-08, 1d
    section Fase 2 (Selesai)
    Setup Database D1, Drizzle Schema & Client   :done, f2, 2026-11-08, 1d
    section Fase 3 (Selesai)
    Kurasi Data Awal & Seeding SQL                :done, f3, 2026-11-08, 1d
    section Fase 4 (Selesai)
    Katalog Publik, Grid & Filter UI             :done, f4, 2026-11-08, 1d
    section Fase 5 (Selesai)
    Pencarian Instan Client Island               :done, f5, 2026-11-08, 1d
    section Fase 6 (Selesai)
    Admin CMS Dashboard & CRUD Materi/Kategori   :done, f6, 2026-11-08, 1d
    section Fase 7 (Next)
    Pengujian, Audit Perf/a11y & Deploy Pages    :active, f7, 2026-11-09, 1d
```

---

## 🛠 Rincian Teknis Tiap Fase

### [x] Fase 1: Scaffolding Proyek & Konfigurasi Cloudflare (STATUS: SELESAI)
- [x] Inisialisasi Astro v5 di direktori `nihongo_repo`.
- [x] Konfigurasi Cloudflare adapter (`@astrojs/cloudflare` v14) dengan mode SSR `output: 'server'`.
- [x] Konfigurasi Tailwind CSS v4 via `@tailwindcss/vite` di `astro.config.mjs`.
- [x] Konfigurasi tema warna Digital Washi & Sumi-e di `src/styles/global.css`.
- [x] Instalasi dependensi: `drizzle-orm`, `@lucide/astro`, `wrangler`, `drizzle-kit`.
- [x] Konfigurasi `wrangler.jsonc` dengan binding D1 `DB` dan compatibility flags `nodejs_compat`.
- [x] Pengujian build: `npm run build` sukses 100% tanpa error (`dist/` generated).
- [x] Git repository inisialisasi pada branch `main` dengan commit awal.

---

### [x] Fase 2: Setup Database D1, Drizzle Schema & Client (STATUS: SELESAI)
- [x] Buat file skema Drizzle di `src/db/schema.ts` (mencakup tabel: `admin_users`, `categories`, `jlpt_levels`, `materials`, `tags`, `material_tags`).
- [x] Buat file penghubung database D1 di `src/db/index.ts` dengan helper `getDb(d1: D1Database)` type-safe.
- [x] Buat file migrasi `schema.sql` di root proyek.
- [x] Eksekusi migrasi lokal D1 via `npx wrangler d1 execute nihongo-repo-db --local --file=./schema.sql`.
- [x] Verifikasi 6 tabel berhasil terbuat di SQLite D1 lokal (`sqlite_master` check lulus).
- [x] Verifikasi build TypeScript Drizzle lulus 100% tanpa type error.

---

### [x] Fase 3: Seeding Data Awal & Kredensial Admin (STATUS: SELESAI)
- [x] Buat utility Web Crypto PBKDF2 di `src/utils/auth.ts` (`hashPassword` & `verifyPassword`) yang native kompatibel dengan Cloudflare Workers.
- [x] Buat file `src/db/seed.sql` berisi data 6 level JLPT (N5 - N1, ALL), 6 kategori materi standar, 5 tags, dan 9 koleksi buku populer.
- [x] Daftarkan akun admin default (username: `admin`, password: `admin123`) dengan hash terenkripsi.
- [x] Eksekusi seeder ke database D1 lokal via `wrangler d1 execute`.
- [x] Verifikasi jumlah data pada setiap tabel via D1 CLI.

---

### [x] Fase 4: Pengembangan Komponen Katalog Publik (STATUS: SELESAI)
- [x] Buat layout publik `src/layouts/BaseLayout.astro` berpadu font Noto Sans JP + Plus Jakarta Sans & OpenGraph social meta.
- [x] Buat komponen header/navbar `src/components/Navbar.astro` lengkap dengan brand stamp "日", link menu, dan shortcut search `/`.
- [x] Buat hero section `src/components/HeroSection.astro` bernuansa kaligrafi Jepang minimalis, metric pills, dan tombol navigasi.
- [x] Buat komponen kartu buku `src/components/MaterialCard.astro` lengkap dengan badge level JLPT terstandar, cover fallback kanji, dan tombol Google Drive.
- [x] Buat modal detail `src/components/MaterialDetailModal.astro` dengan tombol salin tautan dan link direct Drive.
- [x] Buat footer komprehensif `src/components/Footer.astro`.
- [x] Hubungkan `src/pages/index.astro` dengan query Drizzle D1 SSR & fallback catalog.

---

### [x] Fase 5: Pencarian Instan & Filter Interaktif (STATUS: SELESAI)
- [x] FilterBar interaktif `src/components/FilterBar.astro` dengan selector chip level N5-N1 dan kategori pills.
- [x] Script instant reactive filtering sisi klien (judul, romaji, kanji, pengarang) tanpa perlu refresh browser.
- [x] Toggle tampilan fleksibel: Grid View vs Compact Table View.
- [x] State kosong (*Empty State*) ramah pengguna dengan tombol reset filter.
- [x] Endpoint pencatat statistik klik `src/pages/api/track-click.ts`.

---

### [x] Fase 6: Pembangunan Admin CMS (STATUS: SELESAI)
- [x] Sesi login aman dengan HMAC Web Crypto di `src/utils/auth.ts` (`createSessionToken` & `verifySessionToken`).
- [x] Route guard middleware `src/middleware.ts` untuk memproteksi seluruh URL `/admin/*` via HTTP-only cookie.
- [x] Halaman login admin `src/pages/admin/login.astro` dengan validasi kredensial D1 `admin_users` dan endpoint logout `src/pages/admin/logout.ts`.
- [x] Layout dashboard admin `src/layouts/AdminLayout.astro` dengan sidebar desktop & mobile view.
- [x] Dashboard Overview `src/pages/admin/index.astro` (Ringkasan total buku, total kategori, total klik Google Drive, distribusi level N5-N1, dan 5 materi terpopuler).
- [x] Manajemen materi `src/pages/admin/materials/index.astro` (Tabel data lengkap, filter level, dialog modal konfirmasi hapus).
- [x] Form penambahan buku baru `src/pages/admin/materials/new.astro` (Validasi input, auto-extract ID Google Drive, toggle rekomendasi & publikasi).
- [x] Form edit buku `src/pages/admin/materials/edit/[id].astro` (Pre-populated form, update D1).
- [x] Endpoint API hapus materi `src/pages/api/admin/materials/delete.ts`.
- [x] Manajemen kategori `src/pages/admin/categories/index.astro` (Tabel kategori, form tambah kategori baru, proteksi pencegahan penghapusan jika kategori masih terpakai).

---

### [ ] Fase 7: Pengujian, Audit Perf/a11y & Deployment (STATUS: BERIKUTNYA)
- [ ] Buat file `src/db/seed.sql` berisi data level JLPT (N5 - N1, ALL).
- [ ] Masukkan data kategori standar (Tata Bahasa, Huruf & Kanji, Kosakata, Membaca, Menyimak, Bank Soal).
- [ ] Masukkan sampel buku referensi populer (Minna no Nihongo, Shin Kanzen Master, Genki, dll.).
- [ ] Buat akun admin default (username `admin`, password ter-hash aman).
- [ ] Eksekusi seeder ke database D1 lokal.

---

### [ ] Fase 4: Pengembangan Komponen Katalog Publik (STATUS: MENUNGGU)
- [ ] Buat layout publik `src/layouts/BaseLayout.astro`.
- [ ] Buat komponen header/navbar `src/components/Navbar.astro`.
- [ ] Buat komponen hero section `src/components/HeroSection.astro`.
- [ ] Buat komponen kartu buku `src/components/MaterialCard.astro`.
- [ ] Buat modal/drawer detail materi `src/components/MaterialDetailModal.astro`.
- [ ] Hubungkan halaman `src/pages/index.astro` dengan query D1 untuk menampilkan daftar materi secara SSR.

---

### [ ] Fase 5: Pencarian Instan & Filter Interaktif (STATUS: MENUNGGU)
- [ ] Buat komponen pencarian instan sisi klien (`src/components/SearchBar.tsx` atau lightweight script).
- [ ] Implementasikan filtering instan berdasarkan level JLPT (N5–N1) dan kategori tanpa reload.
- [ ] Sinkronisasi state pencarian dengan URL query parameters (`?level=N3&q=kanji`).
- [ ] Buat endpoint API pelacak klik `src/pages/api/track-click.ts` untuk menghitung statistik popularitas.

---

### [ ] Fase 6: Pembangunan Admin CMS (STATUS: MENUNGGU)
- [ ] Buat layout admin `src/layouts/AdminLayout.astro` lengkap dengan sidebar dan breadcrumbs.
- [ ] Buat route `src/middleware.ts` untuk memproteksi seluruh URL `/admin/*` via cookie session.
- [ ] Buat halaman login admin `src/pages/admin/login.astro` dan endpoint autentikasi server.
- [ ] Buat halaman overview metrik `src/pages/admin/index.astro` (Total Materi, Total Kategori, Klik Terbanyak, Distribusi Level).
- [ ] Buat halaman manajemen materi `src/pages/admin/materials/index.astro` (Data table, filter, tombol delete).
- [ ] Buat form tambah & edit materi `src/pages/admin/materials/new.astro` & `edit/[id].astro`.
- [ ] Buat form manajemen kategori `src/pages/admin/categories/index.astro`.

---

### [ ] Fase 7: Pengujian, Audit Perf/a11y & Deployment (STATUS: MENUNGGU)
- [ ] Jalankan testing simulasi lokal via `npx wrangler pages dev`.
- [ ] Audit aksesibilitas (a11y) dan kontras rasio warna.
- [ ] Verifikasi responsivitas pada layar mobile dan desktop.
- [ ] Siapkan panduan pembuatan database D1 remote di Cloudflare Dashboard.
- [ ] Deployment ke Cloudflare Pages dan migrasi skema production.
