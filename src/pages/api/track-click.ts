import type { APIRoute } from 'astro';
import { getDb, materials } from '../../db';
import { eq, sql } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { materialId } = body;

    if (!materialId || typeof materialId !== 'string') {
      return new Response(JSON.stringify({ error: 'materialId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // @ts-ignore
    const d1 = locals?.runtime?.env?.DB;
    if (d1) {
      const db = getDb(d1);
      await db
        .update(materials)
        .set({
          clickCount: sql`${materials.clickCount} + 1`,
        })
        .where(eq(materials.id, materialId));
    }

    return new Response(JSON.stringify({ success: true, materialId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error tracking click:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
