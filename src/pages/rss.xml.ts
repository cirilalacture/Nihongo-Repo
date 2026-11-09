import type { APIRoute } from 'astro';
import { getDb, materials, categories, jlptLevels } from '../db';
import { eq, desc } from 'drizzle-orm';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export const GET: APIRoute = async ({ url }) => {
  const siteUrl = url.origin;
  const db = getDb();
  let itemsList: any[] = [];

  if (db) {
    try {
      itemsList = await db
        .select({
          id: materials.id,
          title: materials.title,
          description: materials.description,
          levelCode: jlptLevels.code,
          categoryName: categories.name,
          createdAt: materials.createdAt,
        })
        .from(materials)
        .leftJoin(categories, eq(materials.categoryId, categories.id))
        .leftJoin(jlptLevels, eq(materials.levelId, jlptLevels.id))
        .where(eq(materials.isPublished, 1))
        .orderBy(desc(materials.createdAt))
        .limit(20)
        .all();
    } catch (err) {
      console.error('Error querying materials for RSS:', err);
    }
  }

  const rssItems = itemsList.map((item) => {
    const itemUrl = `${siteUrl}/materi/${item.id}`;
    const pubDate = item.createdAt ? new Date(item.createdAt).toUTCString() : new Date().toUTCString();
    const descText = `${item.levelCode ? `[JLPT ${item.levelCode}] ` : ''}${item.categoryName ? `(${item.categoryName}) ` : ''}${item.description || ''}`;

    return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${itemUrl}</link>
      <guid>${itemUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(descText)}</description>
    </item>`;
  }).join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nihongo_repo (日本語レポ) — Materi Belajar Bahasa Jepang Terbaru</title>
    <link>${siteUrl}/</link>
    <description>Koleksi terkurasi buku teks, tata bahasa, kanji, audio pemahaman, dan bank soal JLPT N5 hingga N1.</description>
    <language>id</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  return new Response(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
