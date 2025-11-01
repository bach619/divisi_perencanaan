import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export function createClient(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request cookies.
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies.
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  return { supabase, response };
}