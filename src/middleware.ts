import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './utils/auth';

export const onRequest = defineMiddleware(async ({ url, cookies, redirect, locals }, next) => {
  const pathname = url.pathname;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin')) {
    const sessionCookie = cookies.get('nihongo_admin_session')?.value;
    const session = sessionCookie ? await verifySessionToken(sessionCookie) : { valid: false };

    if (pathname === '/admin/login') {
      // If already logged in, redirect to admin dashboard
      if (session.valid) {
        return redirect('/admin');
      }
      return next();
    }

    // For any other /admin routes, require valid session
    if (!session.valid) {
      return redirect('/admin/login');
    }

    // Pass admin user info to locals if needed
    // @ts-ignore
    locals.adminUsername = session.username;
  }

  return next();
});
