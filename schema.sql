-- Nihongo_repo Schema Migration for Cloudflare D1 (SQLite)

-- 1. Tabel Administrator (CMS Auth)
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT,
    last_login_at INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- 2. Tabel Kategori Materi
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    japanese_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- 3. Tabel Level JLPT
CREATE TABLE IF NOT EXISTS jlpt_levels (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE, -- 'N5', 'N4', 'N3', 'N2', 'N1', 'ALL'
    label TEXT NOT NULL,
    badge_bg TEXT NOT NULL,
    badge_text TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- 4. Tabel Materi / Buku
CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    romaji_title TEXT,
    original_title TEXT,
    author TEXT,
    publisher TEXT,
    publish_year INTEGER,
    description TEXT,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    level_id TEXT NOT NULL REFERENCES jlpt_levels(id) ON DELETE RESTRICT,
    drive_url TEXT NOT NULL,
    drive_file_id TEXT,
    cover_image_url TEXT,
    file_type TEXT DEFAULT 'PDF',
    file_size TEXT,
    is_recommended INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    click_count INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- 5. Tabel Tag & Relasi
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS material_tags (
    material_id TEXT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (material_id, tag_id)
);

-- Indeks Performa
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category_id);
CREATE INDEX IF NOT EXISTS idx_materials_level ON materials(level_id);
CREATE INDEX IF NOT EXISTS idx_materials_title ON materials(title);
CREATE INDEX IF NOT EXISTS idx_materials_published ON materials(is_published);
