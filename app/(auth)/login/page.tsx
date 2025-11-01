'use client';

import dynamic from 'next/dynamic';

const LoginClientPage = dynamic(
  () => import('./login-client-page'),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <LoginClientPage />
  );
}
