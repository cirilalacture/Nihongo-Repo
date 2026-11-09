# Web Design Rules (Design System) — Nihongo_repo

## 1. Filosofi & Arah Estetika: *Digital Washi & Sumi-e*

Desain **Nihongo_repo** memadukan estetika tradisional alat tulis Jepang (*Japanese Stationery & Washi Paper*) untuk permukaan publik dengan kepraktisan dashboard modern (*Clean Operate Mode*) untuk halaman admin:
* **Halaman Publik (Experience / Read Mode):** Mengutamakan ketenangan mata, ruang bernapas luas (*Ma*), dan pemindaian kartu buku yang intuitif.
* **Halaman Admin (Operate Mode):** Mengutamakan scanability data, densitas informasi yang seimbang, navigasi sidebar yang stabil, dan umpan balik aksi (success/delete modal) yang jelas.

**Prototipe Stitch:** Telah ter-generate di Google Stitch Project ID: **`407598114321150448`**.

---

## 2. Token Warna & Palet Visual

### 2.1 Warna Dasar & Permukaan (Canvas)
* **`bg-canvas` (Porcelain Warm):** `#FFF8F5` / `#FAFAF9` — Latar belakang utama seluruh halaman publik.
* **`bg-admin` (Clean Neutral):** `#F8FAFC` / `#FFFFFF` — Latar belakang dashboard admin untuk kejernihan kontras data tabel.
* **`bg-surface` (Washi Sheet):** `#FFFFFF` — Latar kartu materi, form input, dan kontainer tabel.
* **`bg-surface-subtle` (Paper Bed):** `#F5F5F0` — Latar belakang filter bar dan panel sidebar admin.
* **`border-washi`:** `#E7E5E4` (atau `#E2E8F0` untuk admin) — Garis tepi tipis 1px yang rapi.

### 2.2 Warna Teks & Tipografi (Ink)
* **`text-ink-primary` (Sumi Deep Ink):** `#1C1917` — Judul halaman, judul buku, dan teks utama.
* **`text-ink-secondary` (Charcoal Muted):** `#44403C` — Subjudul, deskripsi buku, dan label filter/tabel.
* **`text-ink-tertiary` (Faint Mist):** `#78716C` — Metadata sekunder, tahun terbit, dan placeholder.

### 2.3 Warna Aksi & Brand (Shu-iro Vermilion)
* **`primary`:** `#DC2626` — Tombol aksi utama (Buka di Drive, Simpan Form, Filter Aktif).
* **`primary-hover`:** `#B91C1C` — State hover tombol primer.
* **`primary-subtle`:** `#FEF2F2` — Latar belakang aksen ringan.
* **`status-success`:** `#059669` — Status publikasi aktif, notifikasi berhasil.
* **`status-danger`:** `#DC2626` — Tombol hapus materi, dialog konfirmasi hapus.

### 2.4 Matriks Warna Badge Level JLPT

| Level JLPT | Warna Latar | Warna Border | Warna Teks | Karakter |
| :--- | :--- | :--- | :--- | :--- |
| **N5** | `#ECFDF5` | `#A7F3D0` | `#065F46` | Moss / Emerald (Dasar yang segar) |
| **N4** | `#F0FDFA` | `#99F6E4` | `#115E59` | Stream / Teal (Melangkah ke lanjutan) |
| **N3** | `#FFFBEB` | `#FDE68A` | `#92400E` | Amber / Gold (Jembatan menengah) |
| **N2** | `#EEF2FF` | `#C7D2FE` | `#3730A3` | Hydrangea / Indigo (Tingkat mahir) |
| **N1** | `#FEF2F2` | `#FECACA` | `#991B1B` | Vermilion / Lacquer (Puncak kemahiran) |
| **ALL / UMUM** | `#F5F5F4` | `#E7E5E4` | `#44403C` | Neutral Gray (Materi umum) |

---

## 3. Aturan Tipografi

* **Font Utama (Latin & Angka):** `Noto Sans` atau `Plus Jakarta Sans`
* **Font CJK (Kanji, Hiragana, Katakana):** `Noto Sans JP`
* **Hierarki Teks:**
  * **Hero Title:** 32px – 40px, font-weight 700, line-height 1.2
  * **Admin Section Title:** 20px – 24px, font-weight 600
  * **Card & Row Title:** 15px – 16px, font-weight 600
  * **Table Cells & Form Input:** 13px – 14px, font-weight 400
  * **Badge & Status Pills:** 11px – 12px, font-weight 600, letter-spacing 0.04em

---

## 4. Spesifikasi Komponen UI

### 4.1 Kartu Buku Publik (Material Card)
* **Container:** Background `#FFFFFF`, rounded 8px (`rounded-lg`), border 1px solid `#E7E5E4`.
* **Hover State:** Mengangkat sedikit (`translate-y-[-2px]`) dengan bayangan lembut: `box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.06)`.
* **Tombol Google Drive:**
  * Merah vermilion `#DC2626` berikon Google Drive atau panah eksternal.
  * Teks: **"Buka di Drive"**.

### 4.2 Komponen Admin Dashboard (`/admin`)
* **Admin Layout:**
  * Sidebar persisten di desktop (lebar 240px) dengan link menu: `Ringkasan`, `Materi & Buku`, `Kategori`, `Tag & Label`, dan tombol `Ke Website`.
  * Mobile header dengan drawer toggle hamburger.
* **Tabel Manajemen (Data Table):**
  * Baris padat (tinggi baris ~48px) dengan border bawah halus `#F1F5F9`.
  * Kolom aksi: Tombol *Edit* (ikon pensil), Tombol *Preview* (buka Drive), dan Tombol *Hapus* (ikon tong sampah merah).
* **Formulir Input (Create / Edit Material):**
  * Input field dengan label jelas, placeholder kontekstual, dan focus ring vermilion (`focus:ring-2 focus:ring-red-500/20 focus:border-red-600`).
  * Field link Google Drive otomatis memvalidasi format URL dan mengekstrak ID file jika memungkinkan.
* **Dialog Konfirmasi Hapus (Delete Confirmation Modal):**
  * Menampilkan nama materi yang akan dihapus untuk mencegah *accidental clicks*.

---

## 5. Standar Responsif & Adaptasi Perangkat (Mobile, Tablet, Desktop)

* **Mobile Viewport (Smartphone: 360px – 640px):**
  * **Header:** Menampilkan brand mini dan hamburger menu drawer animasi yang membuka opsi navigasi lengkap dan shortcut admin.
  * **Touch Target Standard:** Target sentuhan tombol utama, chip filter, dan aksi minimal 40px–44px untuk kenyamanan jempol (*thumb-zone ergonomis*).
  * **Modal Detail:** Berubah adaptif menjadi *Bottom Sheet* dengan sudut atas melengkung (`rounded-t-3xl`), indikator handle di atas, dan scroll inersia sentuh.
  * **Admin CMS Mobile:** Dilengkapi *Sticky Bottom Navigation Bar* (Dashboard, Materi, Tambah, Kategori) dengan safe-area padding untuk layar modern (iPhone gesture bar).
* **Tablet Viewport (641px – 1024px):**
  * **Grid Materi:** Ditampilkan dalam 2 kolom terstruktur rapi.
  * **Admin CMS:** Form input dan tabel data tertata ergonomis dengan responsivitas sentuh.
* **Desktop Viewport (1025px+):**
  * **Grid Materi:** Ditampilkan dalam 3 kolom seimbang.
  * **Admin CMS:** Sidebar navigasi persisten di sisi kiri untuk alur kerja operasional intensif.
