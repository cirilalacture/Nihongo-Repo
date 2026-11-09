import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('nihongo_admin_session', { path: '/' });
  return redirect('/admin/login?msg=Anda telah berhasil keluar.');
};
