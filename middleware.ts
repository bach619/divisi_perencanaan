import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from './server';

export async function middleware(request: NextRequest) {
  // Buat respons dan Supabase client.
  // Destrukturisasi dengan benar untuk mendapatkan `supabase` dan `response`.
  const { supabase, response } = createClient(request, NextResponse.next());

  // Ambil sesi. Ini akan menyegarkan token jika perlu dan menyimpannya di cookie.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Tentukan rute yang dilindungi. Semua rute kecuali halaman login (root).
  // Anda bisa menambahkan rute publik lain di sini jika ada, misal: !pathname.startsWith('/about')
  const isProtectedRoute = pathname !== '/';

  if (!session && isProtectedRoute) {
    // Redirect ke halaman login
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Jika pengguna sudah login dan mencoba mengakses halaman login, alihkan ke dashboard
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};