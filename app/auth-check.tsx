'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/app/supabase-client';
import { useRouter } from 'next/navigation';
import { IconLoader2 } from '@tabler/icons-react';

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (!data.session || error) {
        setIsAuthenticated(false);
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <IconLoader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null; // Atau komponen loading lain saat redirect
}
