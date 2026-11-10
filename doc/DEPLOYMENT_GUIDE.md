# 🚀 Panduan Lengkap Deployment Cloudflare Workers & D1 — Nihongo_repo

Dokumen ini memuat panduan komprehensif untuk mendeploy website **Nihongo_repo** ke jaringan edge global **Cloudflare Workers** (dengan Workers Static Assets) dan database serverless **Cloudflare D1 (SQLite)**.

---

## 🗺️ Alur Arsitektur Deployment

```mermaid
flowchart LR
    A["💻 Kode Sumber (GitHub / Lokal)"] -->|Deploy CLI / Git Push| B["⚡ Cloudflare Workers (Edge SSR)"]
    B <-->|Binding: DB| C["🗄️ Cloudflare D1 (nihongo-repo-db)"]
    B <-->|Binding: SESSION| D["📦 Cloudflare KV (nihongo-repo-session)"]
    B -->|Binding: ASSETS (WebP & Static)| E["🌍 Global Edge CDN"]
    E --> F["📱 Pengunjung & Pembelajar"]
```

> [!NOTE]
> **Mengapa Cloudflare Workers, bukan Cloudflare Pages?**
> Pada Astro v7 dan adapter `@astrojs/cloudflare` v14, Astro secara resmi beralih ke arsitektur **Cloudflare Workers dengan Static Assets**. Cloudflare Pages hanya mendukung file statis murni atau format legacy `_worker.js`. Menggunakan Cloudflare Workers memberikan integrasi penuh D1, KV, dan SSR native berkecepatan tinggi tanpa batasan Pages Functions.

---

## 📋 1. Prasyarat (Prerequisites)

Sebelum memulai, pastikan:
1. **Akun Cloudflare:** Sudah terdaftar di [dash.cloudflare.com](https://dash.cloudflare.com/).
2. **Wrangler CLI:** Sudah login ke akun Cloudflare di komputer:
   ```bash
   npx wrangler login
   ```
   *(Cek status dengan `npx wrangler whoami`).*

---

## 🗄️ 2. Langkah 1: Setup Database D1 di Cloudflare

Cloudflare D1 adalah database relasional SQLite serverless berlatensi sangat rendah di edge.

### A. Buat Database (Jika Belum Ada):
```bash
npx wrangler d1 create nihongo-repo-db
```
Catat `database_id` yang dihasilkan dan pastikan tertera di file [`wrangler.jsonc`](../wrangler.jsonc):
```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "nihongo-repo-db",
    "database_id": "60b65c2d-5763-463a-ac9f-ee041a50739c"
  }
]
```

### B. Migrasi Skema Tabel (`schema.sql`):
```bash
npm run db:migrate:prod
# atau: npx wrangler d1 execute nihongo-repo-db --remote --file=./schema.sql -y
```

### C. Masukkan Data Awal / Seeding (`src/db/seed.sql`):
```bash
npm run db:seed:prod
# atau: npx wrangler d1 execute nihongo-repo-db --remote --file=./src/db/seed.sql -y
```

### D. Verifikasi Database Remote:
```bash
npx wrangler d1 execute nihongo-repo-db --remote --command="SELECT count(*) as total_materi FROM materials;"
```
Jika mengembalikan angka (misal `9`), database production Anda sudah aktif dan terisi!

---

## 🚀 3. Langkah 2: Deploy ke Cloudflare Workers

Ada dua metode deployment yang didukung:

### Metode A: Deploy Langsung dari Terminal Komputer (Paling Cepat & Praktis)

Jalankan perintah satu baris berikut di terminal:
```bash
npm run deploy
```
*Perintah ini otomatis menjalankan `astro build` lalu `wrangler deploy`.*
Dalam ~15 detik, aplikasi SSR beserta seluruh aset statis (WebP avatar, font, CSS, JS) akan live di edge Cloudflare.

Output terminal akan memberikan URL live Anda:
```text
Uploaded nihongo-repo
Deployed nihongo-repo triggers
  https://nihongo-repo.<subdomain-anda>.workers.dev
```

### Metode B: Deploy Otomatis via Git (Workers Builds)

Jika ingin Cloudflare otomatis melakukan build dan deploy setiap kali Anda melakukan `git push` ke GitHub:

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Pada menu navigasi sebelah kiri, pilih **Workers & Pages**.
3. Klik tombol **Create application** ➔ pilih tab **Workers** ➔ klik **Connect to Git** (atau pilih **Workers Builds**).
4. Hubungkan repository GitHub Anda: **`Nihongo-Repo`**.
5. Pada pengaturan build:
   - **Framework preset:** `None` / `Astro`
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
6. Klik **Save and Deploy**. Cloudflare akan mengurus deployment secara otomatis setiap ada commit baru di branch `main`.

---

## 🔐 4. Langkah 3: Login & Pengamanan Admin CMS Production

Setelah deployment selesai, website dapat diakses langsung.

1. **Akses Login Admin:**
   Buka URL:
   ```text
   https://<worker-anda>.workers.dev/admin/login
   ```
2. **Kredensial Default:**
   - **Username:** `admin`
   - **Password:** `admin123`
3. **Segera Ganti Password Admin di Production:**
   - Masuk ke menu **Pengaturan** (`/admin/settings`).
   - Masukkan password lama (`admin123`) dan buat password baru yang kuat.
   - Sistem akan mengenkripsi password menggunakan Web Crypto PBKDF2 (SHA-256 dengan 100.000 iterasi) langsung ke database D1 remote.

---

## 🌐 5. Langkah 4 (Opsional): Pasang Custom Domain

Jika Anda memiliki domain pribadi (misalnya: `nihongo-repo.com` atau subdomain):

1. Masuk ke [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Buka menu **Workers & Pages** ➔ klik Worker Anda (**`nihongo-repo`**).
3. Pilih tab **Settings** ➔ klik **Domains & Routes**.
4. Di bagian **Custom Domains**, klik **Add Custom Domain**.
5. Masukkan nama domain Anda (misal `nihongo.namadomain.com`).
6. Cloudflare akan mengatur routing dan menerbitkan **Sertifikat SSL (HTTPS)** secara gratis dan otomatis.

---

## 🛠️ 6. Operasional Harian & Pemeliharaan

### A. Menambah & Mengelola Buku
- Buka `/admin/materials/new` dari browser HP atau laptop.
- Masukkan judul, kategori, level JLPT, link Google Drive, dan klik simpan.

### B. Meninjau Permintaan Pengguna & Laporan Link
- Buka `/admin/requests` untuk menyetujui request buku baru atau memperbaiki link Google Drive bermasalah yang dilaporkan pembaca.

### C. Cadangkan Data (Backup Database D1)
Jalankan perintah ini di terminal komputer untuk mencadangkan database production:
```bash
npx wrangler d1 export nihongo-repo-db --remote --output=./backup-nihongo-$(date +%F).sql
```

### D. Ekspor Koleksi ke Format CSV
- Di panel admin `/admin/materials`, klik tombol **"Ekspor CSV"** untuk mengunduh seluruh katalog dalam berkas spreadsheet `.csv`.

---

## ❓ FAQ & Solusi Kendala (Troubleshooting)

| Kendala | Penyebab | Solusi |
| :--- | :--- | :--- |
| **Error 404 pada `pages.dev`** | Cloudflare Pages hanya membaca file statis / tidak menemukan `_worker.js` (Astro v7 menggunakan arsitektur Workers). | Gunakan Cloudflare Workers dengan perintah `npm run deploy` atau Workers Builds. Website aktif di domain `*.workers.dev`. Project Pages lama dapat dihapus dari dashboard. |
| **Halaman Materi Kosong / 0 Buku** | Database remote D1 belum dimigrasi atau belum diisi data awal. | Jalankan `npm run db:migrate:prod` dan `npm run db:seed:prod` di terminal lokal. |
| **Error `FOREIGN KEY constraint failed` saat seed** | Konflik relasi tabel saat eksekusi ulang. | Jalankan migrasi ulang atau gunakan skrip `npm run db:seed:prod` yang telah diperbarui. |
| **Gambar avatar lambat diakses** | Cache browser belum aktif. | Website sudah menyertakan `public/_headers` dengan konfigurasi `max-age=31536000, immutable`. Cloudflare CDN menyimpannya secara permanen setelah request pertama. |
