import type { APIRoute } from 'astro';
import { getDb, materialRequests } from '../../../../db';
import { eq, sql } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return new Response(JSON.stringify({ error: 'id and status are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validStatuses = ['PENDING', 'RESOLVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = getDb();
    if (db) {
      await db
        .update(materialRequests)
        .set({
          status,
          updatedAt: sql`(strftime('%s', 'now'))`,
        })
        .where(eq(materialRequests.id, id));
    }

    return new Response(JSON.stringify({ success: true, id, status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error updating request status:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
