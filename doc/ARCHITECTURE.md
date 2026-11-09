# Arsitektur & Tech Stack — Nihongo_repo

## 1. Diagram Arsitektur Sistem

```mermaid
flowchart TD
    PublicUser([Pengguna Publik]) -->|Akses Katalog| CDN[Cloudflare Global Edge]
    AdminUser([Administrator]) -->|Akses CMS /admin| CDN

    CDN -->|SSR Pages & Static Cache| AstroApp[Astro v7 on Cloudflare Workers Runtime]
    
    subgraph Astro Application Logic
        AstroApp -->|Middleware Auth Check| AuthGuard{Admin Authenticated?}
        AuthGuard -->|Ya| AdminCMS[Admin CMS Surface]
        AuthGuard -->|Tidak| AdminLogin[Redirect to /admin/login]
        AstroApp --> PublicCatalog[Public Catalog Surface]
        AstroApp --> ApiEndpoints[API Endpoints /api/*]
    end

    subgraph Data Layer
        AdminCMS -->|Drizzle ORM Queries| D1[(Cloudflare D1 SQLite DB)]
        PublicCatalog -->|Drizzle ORM Queries| D1
        ApiEndpoints -->|Drizzle ORM Queries| D1
    end

    subgraph External Storage
        PublicUser -->|Download / Read PDF| GDrive[(Google Drive Cloud Storage)]
        AdminCMS -->|Simpan URL & ID| GDrive
    end
```

---

## 2. Pemilihan Framework & Alur Autentikasi Admin

### 2.1 Mengapa Astro v7 untuk Publik + Admin CMS?
* **Satu Repositori Terpadu:** Tidak perlu memisahkan backend CMS dan frontend katalog publik. Astro mendukung SSR halaman dinamis dan form actions server-side langsung dalam satu project.
* **Server-Side Middleware:** Astro menyediakan file `src/middleware.ts` native yang dapat mengintersepsi setiap request ke `/admin/*` untuk memeriksa cookie token sesi admin sebelum merender halaman.
* **Zero Overhead:** Admin CMS dibangun dengan komponen Astro + Tailwind ringan tanpa framework state manajemen yang membengkak, memuat seketika di koneksi seluler.

### 2.2 Alur Keamanan & Autentikasi Admin
1. **Penyimpanan Kredensial:** Tabel `admin_users` menyimpan username dan password hash terenkripsi (PBKDF2 SHA-256 dengan 100.000 iterasi).
2. **Login Flow:**
   * Admin memasukkan username & password pada form `/admin/login`.
   * Server memverifikasi password via `verifyPassword()` dan mengenerate HMAC-SHA256 session token.
   * Token disimpan dalam cookie berstatus `HttpOnly`, `SameSite=Lax`, dan masa aktif 7 hari.
3. **Guard Middleware:**
   * Setiap request menuju `/admin` dan sub-routenya dicek oleh `src/middleware.ts`.
   * Jika cookie tidak valid, otomatis redirect ke `/admin/login`.

### 2.3 Integrasi Binding Cloudflare Workers Modern
Aplikasi menggunakan standar modern Cloudflare Workers (`cloudflare:workers` module):
* **Binding D1 (`DB`):**
  ```ts
  import { env } from 'cloudflare:workers';
  // env.DB adalah instance D1Database yang terhubung otomatis
  ```
  Pola ini menggantikan `Astro.locals.runtime.env` lama yang didepresiasi, memberikan koneksi langsung dan type-safe ke Cloudflare D1.
* **ORM Drizzle:** Diinisialisasi di `src/db/index.ts` via helper `getDb()`, menyederhanakan pemanggilan query di seluruh halaman Astro dan API endpoints.

---

## 3. Struktur Direktori Proyek

```text
nihongo_repo/
├── doc/                        # Dokumentasi teknis & desain
│   ├── README.md
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── DESIGN_RULES.md
│   └── IMPLEMENTATION_PLAN.md
├── src/
│   ├── components/             # UI Components Publik & Admin
│   │   ├── Navbar.astro        # Header, desktop links, theme switcher & mobile hamburger
│   │   ├── HeroSection.astro   # Headline & metrik hero
│   │   ├── FilterBar.astro     # Search bar, JLPT level chips, bookmark filter, view switcher
│   │   ├── MaterialCard.astro  # Kartu buku dengan quick bookmark, cover, badge, direct drive link
│   │   ├── MaterialDetailModal.astro # Modal tabbed (Detail & Google Drive iframe preview)
│   │   └── admin/              # Komponen khusus Admin
│   │       ├── AdminSidebar.astro
│   │       ├── AdminNavbar.astro
│   │       └── StatCard.astro
│   ├── db/
│   │   ├── schema.ts           # Drizzle ORM schema (materials, categories, admin_users, dll.)
│   │   ├── index.ts            # D1 database client connector & PBKDF2 crypto helpers
│   │   └── seed.sql            # Initial seed data
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Layout publik (Washi theme + Sumi-e dark mode + anti-FOUC)
│   │   └── AdminLayout.astro   # Layout admin (Clean Operate theme + mobile bottom nav)
│   ├── middleware.ts           # Route guard untuk /admin/*
│   ├── pages/
│   │   ├── index.astro         # Halaman utama katalog publik (grid & compact table)
│   │   ├── about.astro         # Halaman profil pembuat, narasi visi, dan kontak
│   │   ├── materi/
│   │   │   └── [id].astro      # Standalone SEO permalink & OpenGraph preview
│   │   ├── sitemap.xml.ts      # Dynamic XML Sitemap endpoint
│   │   ├── rss.xml.ts          # Dynamic RSS 2.0 XML feed endpoint
│   │   ├── admin/
│   │   │   ├── index.astro     # Dashboard overview metrik
│   │   │   ├── login.astro     # Form login admin
│   │   │   ├── logout.ts       # Endpoint pembersih cookie sesi
│   │   │   ├── settings.astro  # Manajemen kata sandi & keamanan akun admin
│   │   │   ├── materials/
│   │   │   │   ├── index.astro # Tabel materi, pencarian, aksi ekspor/impor CSV
│   │   │   │   ├── new.astro   # Form tambah materi baru
│   │   │   │   ├── [id]/edit.astro # Form edit materi
│   │   │   │   ├── [id]/delete.ts  # Endpoint hapus materi
│   │   │   │   └── import.astro    # Wizard impor massal data dari file/teks CSV
│   │   │   └── categories/     # CRUD Kategori (list, add, edit, delete)
│   │   └── api/
│   │       ├── admin/
│   │       │   └── materials/
│   │       │       └── export.ts # Endpoint unduh data materi lengkap format CSV
│   │       └── track-click.ts  # Pencatat metrik popularitas buku di Edge
│   └── styles/
│       └── global.css          # Tailwind CSS v4 + Washi light & Sumi-e dark design tokens
├── wrangler.jsonc              # Konfigurasi Cloudflare Workers & D1 binding
├── astro.config.mjs
└── package.json
```
