'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconLoader2 } from '@tabler/icons-react';
import { useAuth } from './auth-context';

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user === null) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <IconLoader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (user !== null) {
    return <>{children}</>;
  }

  return null; // Atau komponen loading lain saat redirect sedang berlangsung
}
