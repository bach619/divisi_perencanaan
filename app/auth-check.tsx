'use client';

import { useEffect } from 'react';
import { getSupabaseClient } from '@/app/supabase-client';
import { useRouter } from 'next/navigation';

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (!data.session || error) {
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]); // The linter is likely mistaken, but let's ensure it's correct. No changes needed here if router is present.

  return <>{children}</>;
}
