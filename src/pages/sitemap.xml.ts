import type { APIRoute } from 'astro';
import { getDb, materials } from '../db';
import { eq, desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ url }) => {
  const siteUrl = url.origin;
  const db = getDb();
  let materialIds: string[] = [];

  if (db) {
    try {
      const rows = await db
        .select({ id: materials.id, updatedAt: materials.createdAt })
        .from(materials)
        .where(eq(materials.isPublished, 1))
        .all();
      materialIds = rows.map((r) => r.id);
    } catch (err) {
      console.error('Error querying materials for sitemap:', err);
    }
  }

  // Fallback IDs if database query is empty
  if (materialIds.length === 0) {
    materialIds = ['mat_minna1', 'mat_kanjilook', 'mat_skm_n3_bunpou', 'mat_skm_n2_dokkai', 'mat_skm_n1_bunpou'];
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${materialIds
  .map(
    (id) => `  <url>
    <loc>${siteUrl}/materi/${id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
