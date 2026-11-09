# Dokumentasi Nihongo_repo (日本語レポ)

Selamat datang di direktori dokumentasi resmi proyek **Nihongo_repo**. Direktori ini memuat seluruh spesifikasi teknis, arsitektur, rencana produk, skema database, dan aturan desain untuk website repository materi bahasa Jepang berbasis Cloudflare Pages & D1.

---

## 📚 Daftar Dokumen

| Dokumen | Deskripsi |
| :--- | :--- |
| **[1. PRD (Product Requirements Document)](./PRD.md)** | Visi produk, target audiens, fitur utama (grid view, filter JLPT N5–N1, quick preview modal, admin dashboard). |
| **[2. Arsitektur & Tech Stack](./ARCHITECTURE.md)** | Alasan pemilihan Astro v7, Drizzle ORM, Cloudflare Pages/Workers, integrasi D1, dan integrasi Google Drive. |
| **[3. Desain Skema Database](./DATABASE_SCHEMA.md)** | ERD Mermaid, skema tabel SQLite D1 (`categories`, `jlpt_levels`, `materials`, `tags`), dan script migrasi SQL. |
| **[4. Aturan Desain Web (Design System)](./DESIGN_RULES.md)** | Panduan UI/UX (Digital Washi Minimalism), token warna, matriks warna badge JLPT, tipografi, dan referensi prototipe Stitch. |
| **[5. Implementation Plan](./IMPLEMENTATION_PLAN.md)** | Rencana kerja bertahap dari Fase 1 hingga Fase 7 (Semua fase telah selesai 100%). |
| **[6. Panduan Deployment Cloudflare](./DEPLOYMENT_GUIDE.md)** | Panduan langkah demi langkah mendeploy ke Cloudflare Pages, membuat D1 remote, migrasi SQL, dan binding DB. |

---

## ⚡ Ringkasan Cepat Proyek

* **Nama Proyek:** `Nihongo_repo` (日本語レポ)
* **Hosting & Runtime:** Cloudflare Pages (Edge SSR via `@astrojs/cloudflare`)
* **Database:** Cloudflare D1 (Serverless SQLite)
* **File Storage:** Google Drive (Link publik + File ID preview)
* **Framework:** Astro v7 + Tailwind CSS v4 + Drizzle ORM
* **Stitch Prototype Project ID:** `407598114321150448`
