import type { APIRoute } from 'astro';
import { getDb, materials } from '../../../../db';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  try {
    let materialId = '';
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      materialId = body.materialId;
    } else {
      const formData = await request.formData();
      materialId = (formData.get('materialId') || '').toString();
    }

    if (!materialId) {
      return redirect('/admin/materials?err=ID materi tidak valid.');
    }

    // @ts-ignore
    const d1 = locals?.runtime?.env?.DB;
    if (d1) {
      const db = getDb(d1);
      await db.delete(materials).where(eq(materials.id, materialId));
    }

    return redirect('/admin/materials?msg=Materi berhasil dihapus.');
  } catch (err) {
    console.error('Error deleting material:', err);
    return redirect('/admin/materials?err=Gagal menghapus materi.');
  }
};
