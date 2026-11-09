# Panduan Deployment Cloudflare Pages & D1 — Nihongo_repo

Dokumen ini memuat panduan lengkap langkah demi langkah untuk mendeploy **Nihongo_repo** ke **Cloudflare Pages** secara global dengan database serverless **Cloudflare D1**.

---

## 1. Prasyarat (Prerequisites)
1. Akun [Cloudflare](https://dash.cloudflare.com/) aktif (tersedia tier gratis).
2. [Node.js](https://nodejs.org/) versi 20+ atau 22+.
3. Akun GitHub atau GitLab untuk repository kode.
4. Login ke Cloudflare via terminal:
   ```bash
   npx wrangler login
   ```

---

## 2. Langkah 1: Buat Database D1 di Cloudflare

Jalankan perintah berikut di terminal:
```bash
npx wrangler d1 create nihongo-repo-db
```

Output terminal akan memberikan informasi konfigurasi database, misalnya:
```text
✅ Successfully created DB 'nihongo-repo-db'!

[[d1_databases]]
binding = "DB"
database_name = "nihongo-repo-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Salin `database_id` yang didapatkan, lalu perbarui file [`wrangler.jsonc`](../wrangler.jsonc):
```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "nihongo-repo-db",
    "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
]
```

---

## 3. Langkah 2: Jalankan Migrasi Skema & Seeding ke Production

Setelah database D1 production terbuat, eksekusi migrasi tabel dan data awal dengan flag `--remote`:

### A. Migrasi Skema Tabel:
```bash
npx wrangler d1 execute nihongo-repo-db --remote --file=./schema.sql
```

### B. Seeding Data Awal (Level JLPT, Kategori & Buku Populer):
```bash
npx wrangler d1 execute nihongo-repo-db --remote --file=./src/db/seed.sql
```

> **Verifikasi Production DB:**
> ```bash
> npx wrangler d1 execute nihongo-repo-db --remote --command="SELECT count(*) as total_buku FROM materials;"
> ```

---

## 4. Langkah 3: Deploy ke Cloudflare Pages

### Metode A: Menghubungkan Repository GitHub (Direkomendasikan / Otomatis CI/CD)
1. Push repository lokal ke GitHub:
   ```bash
   git remote add origin https://github.com/USERNAME/nihongo_repo.git
   git push -u origin main
   ```
2. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Pilih repository `nihongo_repo`.
4. Masukkan konfigurasi build:
   * **Framework preset:** `Astro`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
   * **Environment Variables:**
     * `NODE_VERSION` = `22`
5. Klik **Save and Deploy**.

### Metode B: Deploy Langsung via CLI Wrangler
Jika tidak menggunakan GitHub, Anda bisa langsung mendeploy build lokal:
```bash
npm run build
npx wrangler pages deploy ./dist --project-name=nihongo-repo
```

---

## 5. Langkah 4: Hubungkan Binding Database D1 di Dashboard Cloudflare Pages

Ini adalah langkah krusial agar aplikasi Astro SSR di Cloudflare Pages dapat berkomunikasi dengan database D1:

1. Di Cloudflare Dashboard, buka project Pages **nihongo-repo**.
2. Masuk ke tab **Settings** > **Functions**.
3. Gulir ke bawah ke bagian **D1 Database Bindings**.
4. Klik **Add binding**:
   * **Variable name:** `DB` *(Wajib huruf besar sesuai kode `Astro.locals.runtime.env.DB`)*
   * **D1 Database:** Pilih `nihongo-repo-db`
5. Klik **Save**.
6. Lakukan redeploy ulang (*Retry deployment* atau buat commit baru) agar binding aktif di production.

---

## 6. Langkah 5: Keamanan & Akun Admin Production

1. Kredensial bawaan setelah seeder:
   * **URL Admin:** `https://DOMAIN-ANDA.pages.dev/admin/login`
   * **Username:** `admin`
   * **Password:** `admin123`
2. **Ganti Password Admin untuk Production:**
   Anda dapat mengubah password dengan mengenerate hash PBKDF2 baru dan memperbarui baris di tabel `admin_users`:
   ```bash
   # Ganti hash password di remote database
   npx wrangler d1 execute nihongo-repo-db --remote --command="UPDATE admin_users SET password_hash = 'HASH_BARU_ANDA' WHERE username = 'admin';"
   ```

---

## 7. Perawatan & Operasional Harian

* **Menambah Buku Baru:** Cukup login ke `/admin/materials/new` melalui browser di HP atau laptop, masukkan link Google Drive, dan simpan.
* **Backup Database D1:**
  ```bash
  npx wrangler d1 export nihongo-repo-db --remote --output=./backup-nihongo-db.sql
  ```
