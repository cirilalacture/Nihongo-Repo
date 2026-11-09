# Product Requirements Document (PRD) — Nihongo_repo

## 1. Ikhtisar Produk
* **Nama Produk:** Nihongo_repo (日本語レポ)
* **Tagline:** Direktori Terkurasi Sumber Belajar & Buku Bahasa Jepang di Cloudflare Edge.
* **Tujuan Utama:** Menyediakan platform katalog yang ringan, cepat, elegan, dan terstruktur untuk mencari dan mengakses buku, materi tata bahasa, audio, kanji, dan latihan soal JLPT yang tersimpan di Google Drive.

---

## 2. Target Audiens
1. **Pembelajar Mandiri (Autodidact):** Membutuhkan materi terstruktur mulai dari nol (N5) hingga tingkat mahir (N1).
2. **Pejuang Ujian JLPT (Japanese Language Proficiency Test):** Mencari buku persiapan spesifik (Shin Kanzen Master, Sou Matome, Try!, dll.) berdasarkan level ujian tertentu.
3. **Guru / Sensei Bahasa Jepang:** Membutuhkan materi ajar tambahan dan lembar kerja latihan untuk murid-muridnya.

---

## 3. Masalah Pengguna & Solusi
* **Masalah:** File materi pembelajaran bahasa Jepang (PDF, audio zip, bank soal) sering tersebar acak di grup Telegram, forum Reddit, atau tautan Drive yang mati, tanpa kategorisasi yang jelas.
* **Solusi:** `Nihongo_repo` menjadi katalog terpusat yang ramah pengguna dengan kategorisasi ketat per level JLPT & topik, didukung pencarian instan, indikator ukuran file, dan tombol langsung ke Google Drive.

---

## 4. Spesifikasi Fitur Utama

### 4.1 Halaman Katalog Utama (Repository View)
* **Mode Tampilan:**
  * *Card Grid View* (Default): Tampilan kartu visual dengan cover buku, badge level, kategori, ukuran file, dan tombol aksi.
  * *Compact Table View*: Tampilan daftar ringkas untuk pemindaian cepat puluhan materi sekaligus.
* **Hero & Search Header:**
  * Kolom pencarian instan (client-side instant search) yang memfilter judul, romaji, pengarang, dan tag tanpa reload halaman.
* **Filter Multifaset:**
  * **Level JLPT Filter Chips:** `Semua`, `N5 (Pemula)`, `N4`, `N3`, `N2`, `N1`, dan `Umum`.
  * **Kategori Pills:** `Tata Bahasa (Bunpou)`, `Huruf & Kanji`, `Kosakata (Goi)`, `Membaca (Dokkai)`, `Menyimak (Choukai)`, `Latihan Soal (Mondai)`.
  * **Urutan (Sorting):** Rekomendasi, Terpopuler (klik terbanyak), Terbaru, Judul A-Z.

### 4.2 Kartu Materi & Quick Preview Modal
* **Elemen Kartu Materi:**
  * Cover visual buku / materi (placeholder estetik jika cover belum tersedia).
  * Badge Level JLPT dengan kode warna konsisten.
  * Tag Kategori & format file (PDF, Audio ZIP, Anki deck).
  * Judul utama (Latin/Romaji) & Judul asli Jepang (Kanji/Kana).
  * Tombol aksi primer: **"Buka di Drive"** (membuka link Google Drive di tab baru).
  * Tombol aksi sekunder: **"Detail"** (membuka drawer/modal informasi).
* **Modal / Drawer Detail:**
  * Deskripsi lengkap buku, daftar isi ringkas, pengarang, penerbit, tahun publikasi.
  * Tombol salin tautan langsung.
  * Panduan cara mempelajari materi tersebut.

### 4.3 Manajemen Data Ringkas (Admin Surface)
* Halaman input sederhana untuk pengelola (diproteksi autentikasi ringan atau token admin):
  * Form input buku: Judul, kategori, level JLPT, link Google Drive, link gambar cover, tag, dan deskripsi.
  * Sinkronisasi langsung ke tabel Cloudflare D1.

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)
* **Performa & Latensi:** Waktu muat halaman pertama di bawah 1 detik di jaringan seluler (berkat Cloudflare global edge caching & zero-JS baseline dari Astro).
* **Responsivitas Perangkat:** Pengalaman optimal di layar ponsel (mobile-first), tablet, hingga monitor desktop lebar.
* **Aksesibilitas (a11y):** Kontras rasio teks minimal 4.5:1 (WCAG AA), navigasi keyboard untuk filter dan search input.
* **SEO & Social Share:** SSR menghasilkan OpenGraph meta tags lengkap (thumbnail, judul buku, deskripsi) saat link dibagikan ke media sosial / chat apps.
