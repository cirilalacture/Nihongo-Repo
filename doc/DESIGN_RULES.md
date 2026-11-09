# Web Design Rules (Design System) — Nihongo_repo

## 1. Filosofi & Arah Estetika: *Digital Washi & Sumi-e*

Desain **Nihongo_repo** memadukan fungsionalitas direktori arsip modern dengan ketenangan estetika alat tulis Jepang (*Japanese Stationery & Washi Paper*):
* **Konsep *Ma* (Ruang & Keheningan):** Menghindari banner yang terlalu padat atau elemen visual bising yang mengalihkan fokus pengguna dalam belajar.
* **Keseimbangan Tinta (*Sumi*):** Menggunakan warna arang gelap bertekstur tinta daripada hitam pekat murni (#000000) untuk kenyamanan membaca dalam waktu lama.
* **Aksen Stempel (*Shu-iro*):** Sentuhan merah vermilion tradisional hanya digunakan untuk stempel pengesahan, tombol aksi primer, dan status aktif.

**Prototipe Stitch:** Telah ter-generate di Google Stitch Project ID: **`407598114321150448`**.

---

## 2. Token Warna & Palet Visual

### 2.1 Warna Dasar & Permukaan (Canvas)
* **`bg-canvas` (Porcelain Warm):** `#FFF8F5` / `#FAFAF9` — Latar belakang utama seluruh halaman.
* **`bg-surface` (Washi Sheet):** `#FFFFFF` — Latar kartu materi dan kontainer.
* **`bg-surface-subtle` (Paper Bed):** `#F5F5F0` — Latar belakang filter bar dan panel sekunder.
* **`border-washi`:** `#E7E5E4` (atau `rgba(231, 229, 228, 0.8)`) — Garis tepi tipis 1px seperti tepian kertas washi.

### 2.2 Warna Teks & Tipografi (Ink)
* **`text-ink-primary` (Sumi Deep Ink):** `#1C1917` — Judul halaman, judul buku, dan teks utama.
* **`text-ink-secondary` (Charcoal Muted):** `#44403C` — Subjudul, deskripsi buku, dan label filter.
* **`text-ink-tertiary` (Faint Mist):** `#78716C` — Metadata sekunder, tahun terbit, dan placeholder.

### 2.3 Warna Aksi & Brand (Shu-iro Vermilion)
* **`primary`:** `#DC2626` — Tombol aksi utama (Buka di Drive, Filter Aktif).
* **`primary-hover`:** `#B91C1C` — State hover tombol primer.
* **`primary-subtle`:** `#FEF2F2` — Latar belakang aksen ringan.

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
* **Skala Tipografi:**
  * **Display (Hero Headline):** 32px – 40px, font-weight 600, line-height 1.25
  * **Section Title:** 24px, font-weight 600
  * **Card Title (Judul Buku):** 16px – 18px, font-weight 600
  * **Body Copy:** 14px, font-weight 400, line-height 1.6
  * **Badge & Microcopy:** 11px – 12px, font-weight 600, letter-spacing 0.04em

---

## 4. Spesifikasi Komponen UI

### 4.1 Kartu Buku (Material Card)
* **Container:** Background `#FFFFFF`, rounded 8px (`rounded-lg`), border 1px solid `#E7E5E4`.
* **Hover State:** Mengangkat sedikit (`translate-y-[-2px]`) dengan bayangan lembut: `box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.06)`.
* **Area Cover:** Rasio 4:3 atau 3:4 dengan rounded 6px, menampilkan cover buku asli atau placeholder grafis kanji berlatar pastel.
* **Tombol Google Drive:**
  * Warna merah vermilion `#DC2626` atau outline washi berikon Drive.
  * Teks: **"Buka di Drive"** + ikon panah eksternal (`↗`).

### 4.2 Search Bar & Filter Chips
* **Search Input:** Latar putih, border 1px `#E7E5E4`, rounded 8px. Saat fokus: border berubah ke `#DC2626` dengan ring halus transparan (`ring-2 ring-red-500/20`).
* **Filter Chips:** Berbentuk rounded-full (pill). State aktif memiliki border tegas dan background aksen. State tidak aktif menggunakan background netral washi `#F5F5F0`.
