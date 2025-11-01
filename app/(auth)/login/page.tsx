'use client';

import dynamic from 'next/dynamic';
import { IconLoader2 } from '@tabler/icons-react';

const LoginClientPage = dynamic(
  () => import('./login-client-page'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <IconLoader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    ),
  }
);

export default function LoginPage() {
  return (
    <LoginClientPage />
  );
}
