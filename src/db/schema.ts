import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 1. Tabel Administrator (CMS Auth)
export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// 2. Tabel Kategori Materi
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  japaneseName: text('japanese_name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'), // Lucide icon name, e.g. 'book-open', 'pen-tool'
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// 3. Tabel Level JLPT
export const jlptLevels = sqliteTable('jlpt_levels', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(), // 'N5', 'N4', 'N3', 'N2', 'N1', 'ALL'
  label: text('label').notNull(),
  badgeBg: text('badge_bg').notNull(),
  badgeText: text('badge_text').notNull(),
  sortOrder: integer('sort_order').default(0),
});

// 4. Tabel Materi / Buku
export const materials = sqliteTable('materials', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  romajiTitle: text('romaji_title'),
  originalTitle: text('original_title'),
  author: text('author'),
  publisher: text('publisher'),
  publishYear: integer('publish_year'),
  description: text('description'),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict' }),
  levelId: text('level_id')
    .notNull()
    .references(() => jlptLevels.id, { onDelete: 'restrict' }),
  driveUrl: text('drive_url').notNull(),
  driveFileId: text('drive_file_id'),
  coverImageUrl: text('cover_image_url'),
  fileType: text('file_type').default('PDF'), // 'PDF', 'AUDIO', 'ANKI', etc.
  fileSize: text('file_size'),
  isRecommended: integer('is_recommended').default(0), // 0: no, 1: yes
  isPublished: integer('is_published').default(1), // 0: draft, 1: published
  clickCount: integer('click_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// 5. Tabel Tag & Relasi Material-Tag
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
});

export const materialTags = sqliteTable('material_tags', {
  materialId: text('material_id')
    .notNull()
    .references(() => materials.id, { onDelete: 'cascade' }),
  tagId: text('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),
});
