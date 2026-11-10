import type { APIRoute } from 'astro';
import { getDb, materialRequests } from '../../../db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    let payload: any = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      payload = {
        type: formData.get('type'),
        title: formData.get('title'),
        materialId: formData.get('materialId'),
        authorOrPublisher: formData.get('authorOrPublisher'),
        jlptLevel: formData.get('jlptLevel'),
        notes: formData.get('notes'),
        contactEmail: formData.get('contactEmail'),
      };
    }

    const {
      type = 'REQUEST',
      title,
      materialId = null,
      authorOrPublisher = null,
      jlptLevel = 'ALL',
      notes = null,
      contactEmail = null,
    } = payload;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Judul materi / buku wajib diisi' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validTypes = ['REQUEST', 'BROKEN_LINK'];
    const safeType = validTypes.includes(type) ? type : 'REQUEST';

    const newId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const db = getDb();
    if (db) {
      await db.insert(materialRequests).values({
        id: newId,
        type: safeType,
        title: title.trim(),
        materialId: materialId ? String(materialId).trim() : null,
        authorOrPublisher: authorOrPublisher ? String(authorOrPublisher).trim() : null,
        jlptLevel: jlptLevel ? String(jlptLevel).trim() : 'ALL',
        notes: notes ? String(notes).trim() : null,
        contactEmail: contactEmail ? String(contactEmail).trim() : null,
        status: 'PENDING',
      });
    }

    const message =
      safeType === 'BROKEN_LINK'
        ? 'Laporan link bermasalah telah berhasil terkirim. Terima kasih atas bantuan Anda menjaga kualitas repositori!'
        : 'Permintaan materi baru telah diterima. Sensei akan segera meninjau dan menambahkan materi ini ke katalog!';

    return new Response(
      JSON.stringify({
        success: true,
        id: newId,
        message,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Error submitting material request:', err);
    return new Response(
      JSON.stringify({
        error: 'Terjadi kesalahan sistem saat menyimpan laporan. Silakan coba beberapa saat lagi.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
