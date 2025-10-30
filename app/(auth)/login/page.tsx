'use client';

import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/app/supabase-client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await getSupabaseClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error('Login error:', error);
      // Tampilkan pesan error ke pengguna jika perlu
    } else {
      // Pastikan pengalihan terjadi setelah login sukses
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Login ke Sistem
        </h1>
        <Button
          onClick={handleLogin}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        >
          Login dengan Google
        </Button>
      </div>
    </div>
  );
}
