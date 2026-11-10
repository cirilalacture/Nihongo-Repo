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
* **Hero Section Kaligrafi Tradisional & Tekstur Washi Berkinerja Tinggi:**
  * Latar hero diperkaya dengan motif gelombang tradisional *Seigaiha* (vektor SVG murni, 0 HTTP request, performa instan).
  * Lingkaran kuas Zen *Ensō* (円相) dan watermark kaligrafi kanji raksasa *日本語*.
  * Stempel segel merah tradisional *Hanko* (*日本文庫*).
  * Kaligrafi vertikal (*tategaki*) peribahasa belajar di sayap kiri dan kanan pada layar lebar (`継続は力なり` dan `千里の道も一歩から`).
* **Mode Tampilan Katalog:**
  * *Card Grid View* (Default): Kartu buku visual dengan cover, badge level JLPT, tag kategori, tombol "Buka di Drive", tombol "Detail", dan tombol cepat "Favorit / Bookmark".
  * *Compact Table View*: Tampilan tabel ringkas untuk pemindaian cepat puluhan item.
* **Pencarian & Filter Multifaset:**
  * Instant search bar (client-side) tanpa reload halaman.
  * Filter Chips Level JLPT: N5, N4, N3, N2, N1, Umum.
  * Filter Kategori: Tata Bahasa, Huruf & Kanji, Kosakata, Membaca, Menyimak, Bank Soal.
  * Filter Cepat "Tersimpan" (*Bookmarks*): Menyaring hanya buku yang ditandai favorit oleh pengguna secara lokal.
  * Opsi Urutan: Terpopuler (klik terbanyak), Rekomendasi Sensei, Terbaru, Judul A-Z.
* **Modal / Quick Drawer Detail Buku:**
  * Tab 1: Ringkasan & Detail (deskripsi buku, penerbit, tahun rilis, ukuran file PDF/audio).
  * Tab 2: Intip Isi Buku (*Google Drive Preview Embed* iframe viewer langsung di dalam situs).
  * Link Google Drive langsung dengan opsi salin tautan ke clipboard.
  * Tombol navigasi ke *Halaman Penuh (Permalink)*.
* **Fitur Bookmark Mandiri (*Client-Side Favorites*):**
  * Penyimpanan favorit di `localStorage` per peramban tanpa perlu registrasi akun.
  * Sinkronisasi visual status bookmark (ikon hati/bookmark outline vs merah terisi) di grid dan badge counter di filter bar.
* **Halaman Rincian Mandiri (*Standalone Detail Permalink* — `/materi/[id]`):**
  * Halaman SSR khusus untuk setiap buku/materi dengan URL ramah SEO.
  * OpenGraph metadata (judul, deskripsi, gambar cover, tipe artikel) untuk tampilan thumbnail kaya saat dibagikan ke WhatsApp, Telegram, Twitter/X, dan Discord.
  * Breadcrumb navigasi (*Beranda > Kategori > Judul Buku*).
  * Tombol bagikan interaktif (*Web Share API* dengan fallback otomatis salin ke clipboard).
  * Pratinjau dokumen Google Drive inline terintegrasi.
  * Rekomendasi materi terkait dalam level atau kategori yang sama.
* **Washi Night Mode (*Sumi-e Dark Mode*):**
  * Dua mode tema: *Washi Paper Light* (krem organik lembut) dan *Sumi-e Charcoal Dark* (hitam arang tinta Jepang `#121214`).
  * Tombol switcher tema di header navigasi desktop dan mobile drawer.
  * Script anti-FOUC inline di `<head>` untuk mencegah kedipan putih saat pemuatan halaman.
* **SEO & Social Discovery:**
  * Endpoint XML Sitemap otomatis (`/sitemap.xml`) untuk memudahkan pengindeksan oleh Google Bot.
  * Endpoint RSS 2.0 Feed (`/rss.xml`) untuk pembaca feed berita dan notifikasi pembaruan materi pembelajaran.
* **Halaman Profil Pembuat & Tentang Repositori (`/about`):**
  * Halaman publik mandiri yang menyajikan narasi lahirnya Nihongo_repo, visi keterbukaan akses materi pembelajaran, profil pembuat (**Jo / ジョ**, Tokyo, Japan & Solo, Indonesia, JLPT N3), stempel segel merah "日", serta nilai-nilai inti nirlaba (100% Akses Terbuka, Kurasi Berkualitas, dan Rapi & Bebas Iklan).
  * **Interactive Character Avatar (7 Poses):** Avatar karakter dinamis dengan 7 pose berbeda yang berganti secara siklis dan instan saat diklik (didukung preloading memori peramban, animasi mikro-bounce, dan badge counter `Pose X/7`).
  * Tautan interaktif ke profil GitHub pembuat, repositori kode sumber, dan kontak surel.
  * Terdaftar secara otomatis di XML Sitemap (`/sitemap.xml`) dengan prioritas pencarian 0.7.
* **Filter Cepat Tipe Media (Fast Format Chips):**
  * Tombol filter format instan di baris filter katalog dengan tipografi editorial bersih tanpa ikon/emoji: Semuanya, Dokumen PDF, Audio MP3, Deck Anki, dan Lembar Latihan.
  * Filter sisi klien secepat kilat (*zero latency*) yang berpadu mulus dengan filter level JLPT, pencarian kata kunci, dan kategori topik.
  * Format media ditampilkan dalam tipografi teks natural yang rapi dan elegan.
* **Formulir Permintaan Buku & Pelaporan Tautan Rusak (Request / Report Modal):**
  * Modal interaktif dwitab ("Request Buku Baru" dan "Lapor Link Rusak") yang dapat diakses langsung dari header navigasi dan menu laci mobile.
  * Tombol pelaporan langsung (*direct report trigger*) di modal detail materi (`#detail-modal`) yang otomatis mengisikan judul dan ID materi yang bermasalah.
  * Validasi form client-side, pencegahan double-submit, dan umpan balik status berhasil beranimasi (*success feedback*).
  * API publik `/api/requests/submit` yang memvalidasi dan menyimpan pengajuan ke tabel D1 `material_requests`.
* **Sensei Companion / Pendamping Belajar Interaktif:**
  * Komponen mengambang (*floating*) di pojok kanan bawah seluruh halaman publik (`BaseLayout.astro`) menggunakan Avatar #7 bertema Sensei dengan badge segel *"先生"*.
  * Ketika diklik, memunculkan gelembung percakapan (*speech bubble*) bergaya manga yang menyajikan kata-kata motivasi dan peribahasa Jepang (*kotowaza*) yang berbeda-beda setiap kali diklik (lengkap dengan kanji, romaji, arti bahasa Indonesia, dan tag kategori).
  * Dilengkapi animasi lompat ceria (*lively micro-hop*), tooltip idle, tombol tutup, dukungan pintasan tombol `Esc`, serta penutupan saat mengklik di luar area.
  * **Fitur Bebas Digeser (*Draggable / Touch & Mouse Movement*):** Karakter Sensei dapat digeser atau diseret bebas ke posisi mana pun di layar oleh pembaca (baik dengan sentuhan jari di layar sentuh ponsel maupun kursor mouse desktop) agar tidak menghalangi teks atau tombol bacaan. Posisi tersimpan otomatis di `localStorage`.
  * **Orientasi Cerdas Gelembung Dialog (*Smart Adaptive Bubble*):** Arah kemunculan balon ucapan (atas, bawah, kiri, atau kanan) beradaptasi secara dinamis mengikuti posisi koordinat Sensei, sehingga dijamin tidak pernah terpotong di tepi layar (*zero viewport clipping*).
  * Responsif di ponsel cerdas (maksimal lebar adaptif dan tidak memicu *horizontal scroll overflow*).

### 4.2 Halaman Admin & CMS (`/admin`)
Halaman admin dirancang terproteksi dan mencakup modul manajemen komprehensif:

#### A. Autentikasi & Keamanan Admin
* Proteksi login berbasis password/kredensial admin yang aman (`/admin/login`).
* Manajemen sesi menggunakan HTTP-only secure cookie yang diverifikasi di sisi server (Cloudflare Edge SSR).
* Tombol Logout instan yang membersihkan cookie sesi.
* **Pengaturan Akun & Ganti Kata Sandi (`/admin/settings`):**
  * Form verifikasi kata sandi saat ini dan penetapan kata sandi baru.
  * Enkripsi hashing menggunakan standar Web Crypto API PBKDF2 (SHA-256 dengan 100.000 iterasi dan salt unik acak) yang langsung diperbarui ke Cloudflare D1.

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
* **Ekspor Basis Data CSV (`/api/admin/materials/export`):**
  * Mengunduh seluruh basis data materi ke file `.csv` terstruktur dengan sekali klik.
* **Impor Koleksi CSV (`/admin/materials/import`):**
  * Mengunggah file `.csv` atau menempelkan teks CSV langsung.
  * Deteksi kolom cerdas (judul, pengarang, level, kategori, link drive, dsb.) dengan parser regex CSV aman tanda kutip dan koma.
  * Resolusi otomatis relasi kategori dan level JLPT di D1.

#### D. Manajemen Kategori (`/admin/categories`)
* Tambah, ubah, dan hapus kategori pembelajaran.
* Pengaturan nama latin, nama kanji Jepang (misal: 文法), slug URL, dan urutan tampilan (*sort order*).
* Proteksi pencegahan penghapusan jika kategori masih memiliki materi aktif.

#### E. Manajemen Level & Tag (`/admin/tags`)
* Manajemen tag pelengkap (misal: `#AudioTersedia`, `#KunciJawaban`, `#AnkiDeck`, `#FullColor`).
* Menghubungkan atau melepaskan tag dari materi buku.

#### F. Manajemen Permintaan & Laporan Link (`/admin/requests`)
* **Ringkasan Kartu Metrik:** Menunggu Review, Request Buku Baru, Laporan Link Rusak, dan Sudah Selesai.
* **Filter Interaktif Sisi Klien:** Filter berdasarkan status (*Semua, Menunggu, Selesai, Ditolak*) dan filter tipe (*Semua, Request Buku, Lapor Link*).
* **Tindakan Admin Cepat:**
  * Tandai status pengajuan: *Selesai* (`RESOLVED`) atau *Tolak* (`REJECTED`) via API `/api/admin/requests/status`.
  * Hapus permanen riwayat permintaan/laporan via API `/api/admin/requests/delete`.
  * Tautan cepat ke form penambahan materi baru (`/admin/materials/new`) dengan judul terisi otomatis untuk mempercepat kurasi buku yang diminta.

---

### 4.3 Desain & Responsivitas Antarmuka (Mobile, Tablet, Desktop)
* **Mobile-First UX (360px - 640px):**
  * Header ringkas dengan tombol hamburger drawer menu beranimasi halus.
  * Panel admin di mobile dilengkapi *Sticky Bottom Navigation Bar* (Ringkasan, Materi, Tambah, Kategori, Pengaturan) untuk kenyamanan jempol satu tangan (*thumb zone*).
  * Modal detail tampil sebagai *Bottom Sheet* dengan indikator grab handle.
  * Ukuran target sentuh tombol minimal 40px - 44px (*touch-target friendly*).
  * Bebas dari *horizontal overflow* di semua ukuran layar ponsel cerdas.
* **Tablet UX (768px - 1024px):**
  * Tata letak grid 2 kolom adaptif dengan pemanfaatan ruang proporsional.
* **Desktop UX (1024px+):**
  * Tata letak grid 3–4 kolom dengan sidebar admin persisten.

---

### 4.4 Aksesibilitas Tipografi & Pilihan Font Jepang
* **Kontrol Penskalaan Ukuran Teks (Font Sizing):**
  * Menyediakan 4 tingkat ukuran font proporsional: **A-** (90% - Kompak), **A** (100% - Normal Default), **A+** (112% - Besar / Nyaman Baca), dan **A++** (125% - Ekstra Besar / Aksesibilitas Penglihatan).
  * Tersedia tombol reset cepat "Reset Normal" (100%).
  * Menggunakan penskalaan berbasis root CSS `document.documentElement.style.fontSize` dengan transisi halus (`transition: font-size 0.2s cubic-bezier(0.16, 1, 0.3, 1)`), sehingga seluruh tata letak halaman (`rem`-based) membesar/mengecil secara harmonis tanpa layout shift.
* **Tiga Variasi Font Jepang & Latin:**
  1. **Gothic Modern (Default):** *Noto Sans JP* (Standar antarmuka digital modern, tegas, dan mudah dibaca pada berbagai resolusi layar).
  2. **Mincho Sastra (Serif):** *Noto Serif JP* (Karakteristik goresan kuas klasik khas novel, majalah, dan literatur sastra Jepang).
  3. **Klee Buku Teks (Handwritten / Textbook):** *Klee One* (Gaya pensil dan kuas khas buku teks sekolah SD/SMP Jepang (*kyokashotai*), sangat ideal untuk pemula yang sedang mempelajari urutan goresan kanji).
* **Penempatan Kontrol Ergonomis:**
  * **Desktop:** Tombol popover dropdown di header (`ALargeSmall` icon) dengan klik di luar / tombol Escape untuk menutup.
  * **Mobile:** Panel kontrol terdedikasi di dalam hamburger drawer navigasi, rapi tanpa memadati header seluler.
* **Persistensi & Anti-FOUC:**
  * Pengaturan disimpan di `localStorage` (`nihongo_font_scale` & `nihongo_font_family`).
  * Inisialisasi sinkron di `<head>` HTML mencegah kedipan perubahan font (*Flash of Unstyled Content* / FOUC).

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)
* **Keamanan:** Proteksi route `/admin/*` via SSR Middleware. Input form divalidasi ketat untuk mencegah SQL injection dan XSS. Tautan admin disembunyikan sepenuhnya dari seluruh antarmuka publik (navbar, mobile drawer, dan footer) sehingga akses panel dikhususkan manual langsung via URL (`/admin`).
* **Performa & Core Web Vitals:**
  * Waktu muat halaman publik < 1 detik dengan TTFB ultra-rendah melalui Astro SSR di Cloudflare Pages/Workers edge.
  * Kueri database Cloudflare D1 dieksekusi paralel (`Promise.all()`) dengan indeks B-Tree yang tepat.
  * Aset gambar dioptimasi penuh menggunakan format modern WebP: Sensei companion 21 KB (turun 98.1% dari 1.1 MB) dan avatar pose ~40–60 KB.
  * Caching CDN & Browser jangka panjang (`Cache-Control: public, max-age=31536000, immutable`) via `public/_headers`.
  * Zero layout shift (CLS = 0) dengan dimensi eksplisit `width`/`height` dan `decoding="async"`.
  * Client-side JavaScript minimalis (~4.2 KB bundle, ~1.5 KB gzipped), bebas framework berat.
* **Desain UI/UX:**
  * Halaman publik: Nuansa *Digital Washi & Sumi-e* (tenang, fokus belajar). Tipografi bersih editorial tanpa kotak badge berlebih pada judul atau katalog kartu materi.
  * Halaman admin: Gaya *Clean Dashboard Operate Mode* (tata letak bersih, tabel padat dan informatif, form input terstruktur dengan validasi visual jelas).
