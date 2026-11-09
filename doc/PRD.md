# Product Requirements Document (PRD) — Nihongo_repo

## 1. Ikhtisar Produk
* **Nama Produk:** Nihongo_repo (日本語レポ)
* **Tagline:** Direktori Terkurasi Sumber Belajar & Buku Bahasa Jepang di Cloudflare Edge.
* **Tujuan Utama:** Menyediakan platform katalog yang ringan, cepat, elegan, dan terstruktur untuk mencari dan mengakses buku, materi tata bahasa, audio, kanji, dan latihan soal JLPT yang tersimpan di Google Drive, dilengkapi dengan **Admin Dashboard / CMS** mandiri untuk pengelolaan konten secara menyeluruh.

---

## 2. Target Audiens
1. **Pengguna Publik (Pembelajar & Pengajar):**
   * Pembelajar mandiri (autodidak) pemula (N5) hingga mahir (N1).
   * Pejuang ujian JLPT yang mencari buku referensi terpercaya.
   * Guru atau mentor bahasa Jepang yang membutuhkan bank materi ajar.
2. **Administrator & Kontributor Konten:**
   * Pengelola repository yang bertugas mengunggah link Google Drive baru, memperbarui edisi buku, mengelompokkan kategori, dan memantau materi yang paling banyak diminati.

---

## 3. Masalah Pengguna & Solusi
* **Masalah Pengguna:** Materi pembelajaran bahasa Jepang berserakan tanpa struktur level JLPT yang jelas dan link sering mati.
* **Masalah Pengelola:** Menambah atau mengedit daftar buku langsung melalui query database manual (SQL) sangat merepotkan, rawan typo, dan tidak efisien.
* **Solusi:** 
  1. Halaman publik dengan navigasi filter ramah pengguna (*user-friendly*), cepat, dan estetik.
  2. Halaman admin terintegrasi (*Admin CMS*) untuk mengelola buku, kategori, tag, dan link Google Drive secara visual melalui browser.

---

## 4. Spesifikasi Fitur Utama

### 4.1 Halaman Publik (Public Catalog Surface)
* **Mode Tampilan Katalog:**
  * *Card Grid View* (Default): Kartu buku visual dengan cover, badge level JLPT, tag kategori, tombol "Buka di Drive", dan tombol "Detail".
  * *Compact Table View*: Tampilan tabel ringkas untuk pemindaian cepat puluhan item.
* **Pencarian & Filter Multifaset:**
  * Instant search bar (client-side) tanpa reload halaman.
  * Filter Chips Level JLPT: N5, N4, N3, N2, N1, Umum.
  * Filter Kategori: Tata Bahasa, Huruf & Kanji, Kosakata, Membaca, Menyimak, Bank Soal.
  * Opsi Urutan: Terpopuler (klik terbanyak), Rekomendasi Sensei, Terbaru, Judul A-Z.
* **Modal / Quick Drawer Detail Buku:**
  * Ringkasan buku, penerbit, tahun rilis, ukuran file PDF/audio.
  * Link Google Drive langsung dengan opsi salin tautan.

### 4.2 Halaman Admin & CMS (`/admin`)
Halaman admin dirancang terproteksi dan mencakup modul manajemen komprehensif:

#### A. Autentikasi Admin
* Proteksi login berbasis password/kredensial admin yang aman (`/admin/login`).
* Manajemen sesi menggunakan HTTP-only secure cookie yang diverifikasi di sisi server (Cloudflare Edge SSR).
* Tombol Logout instan yang membersihkan sesi.

#### B. Ringkasan Statistik (Dashboard Overview)
* Ringkasan metrik utama:
  * Total materi/buku terdaftar.
  * Total kategori aktif.
  * Total klik tautan Google Drive (metrik popularitas).
  * Distribusi buku per level JLPT (N5 - N1).
* Daftar 5 materi paling sering diakses pengguna.

#### C. Manajemen Materi / Buku (`/admin/materials`)
* **Daftar Materi:** Tabel data dengan fitur pencarian, filter kategori/level, dan status publikasi.
* **Tambah & Edit Materi (Form Input):**
  * Judul Buku (Romaji/Indonesia & Kanji asli Jepang).
  * Pengarang & Penerbit.
  * Tahun Terbit.
  * Level JLPT & Kategori (Dropdown pilihan dinamis).
  * Link Google Drive (Otomatis mendeteksi Google Drive File ID).
  * Link Cover Gambar (Dapat menggunakan cover bawaan atau custom URL).
  * Tipe File (PDF, Audio ZIP, Anki Deck) & Estimasi Ukuran (misal: "45 MB").
  * Deskripsi ringkas buku.
  * Checkbox: "Rekomendasi Utama" (*Featured / Recommended*).
* **Hapus Materi:** Dilengkapi dialog konfirmasi hapus untuk mencegah ketidaksengajaan.

#### D. Manajemen Kategori (`/admin/categories`)
* Tambah, ubah, dan hapus kategori pembelajaran.
* Pengaturan nama latin, nama kanji Jepang (misal: 文法), slug URL, dan urutan tampilan (*sort order*).
* Proteksi pencegahan penghapusan jika kategori masih memiliki materi aktif.

#### E. Manajemen Level & Tag (`/admin/tags`)
* Manajemen tag pelengkap (misal: `#AudioTersedia`, `#KunciJawaban`, `#AnkiDeck`, `#FullColor`).
* Menghubungkan atau melepaskan tag dari materi buku.

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)
* **Keamanan:** Proteksi route `/admin/*` via SSR Middleware. Input form divalidasi ketat untuk mencegah SQL injection dan XSS.
* **Performa:** Waktu muat halaman publik < 1 detik. Halaman admin responsif dan cepat dibuka di mobile saat admin ingin menambah link via HP.
* **Desain UI/UX:**
  * Halaman publik: Nuansa *Digital Washi & Sumi-e* (tenang, fokus belajar).
  * Halaman admin: Gaya *Clean Dashboard Operate Mode* (tata letak bersih, tabel padat dan informatif, form input terstruktur dengan validasi visual jelas).
