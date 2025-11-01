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
  }, [router]);

  return <>{children}</>;
}
