import type { APIRoute } from 'astro';
import { getDb, materials, categories, jlptLevels } from '../../../../db';
import { eq, desc } from 'drizzle-orm';

function escapeCsvCell(cell: any): string {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell).replace(/"/g, '""');
  return `"${str}"`;
}

export const GET: APIRoute = async () => {
  const db = getDb();
  if (!db) {
    return new Response('Database not available', { status: 500 });
  }

  try {
    const rows = await db
      .select({
        id: materials.id,
        title: materials.title,
        romajiTitle: materials.romajiTitle,
        originalTitle: materials.originalTitle,
        author: materials.author,
        publisher: materials.publisher,
        publishYear: materials.publishYear,
        categorySlug: categories.slug,
        levelCode: jlptLevels.code,
        driveUrl: materials.driveUrl,
        driveFileId: materials.driveFileId,
        coverImageUrl: materials.coverImageUrl,
        fileType: materials.fileType,
        fileSize: materials.fileSize,
        isRecommended: materials.isRecommended,
        isPublished: materials.isPublished,
        description: materials.description,
      })
      .from(materials)
      .leftJoin(categories, eq(materials.categoryId, categories.id))
      .leftJoin(jlptLevels, eq(materials.levelId, jlptLevels.id))
      .orderBy(desc(materials.createdAt))
      .all();

    const headers = [
      'id',
      'title',
      'romajiTitle',
      'originalTitle',
      'author',
      'publisher',
      'publishYear',
      'categorySlug',
      'levelCode',
      'driveUrl',
      'driveFileId',
      'coverImageUrl',
      'fileType',
      'fileSize',
      'isRecommended',
      'isPublished',
      'description',
    ];

    const csvLines = [headers.join(',')];

    for (const r of rows) {
      const line = [
        escapeCsvCell(r.id),
        escapeCsvCell(r.title),
        escapeCsvCell(r.romajiTitle),
        escapeCsvCell(r.originalTitle),
        escapeCsvCell(r.author),
        escapeCsvCell(r.publisher),
        escapeCsvCell(r.publishYear),
        escapeCsvCell(r.categorySlug || 'grammar'),
        escapeCsvCell(r.levelCode || 'ALL'),
        escapeCsvCell(r.driveUrl),
        escapeCsvCell(r.driveFileId),
        escapeCsvCell(r.coverImageUrl),
        escapeCsvCell(r.fileType || 'PDF'),
        escapeCsvCell(r.fileSize),
        escapeCsvCell(r.isRecommended || 0),
        escapeCsvCell(r.isPublished || 1),
        escapeCsvCell(r.description),
      ].join(',');
      csvLines.push(line);
    }

    const csvContent = '\uFEFF' + csvLines.join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10);

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="nihongo_repo_materials_${timestamp}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Export CSV error:', err);
    return new Response('Error generating CSV export', { status: 500 });
  }
};
