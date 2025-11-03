'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { IconBrandGoogle, IconLoader2 } from '@tabler/icons-react'; // IconBrandGoogle sudah tidak dipakai
import { IconLoader2 } from '@tabler/icons-react'; // Hanya butuh IconLoader2

import { getSupabaseClient } from '@/app/supabase-client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginClientPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const supabase = getSupabaseClient();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Arahkan ke dasbor setelah login berhasil.
      // Di masa depan, ini dapat diperluas untuk menangani pengalihan dinamis
      // berdasarkan peran pengguna atau parameter URL.
      console.log('Login success. Redirecting to dashboard...');
      router.push('/dashboard');
      router.refresh(); // Tambahkan ini untuk memastikan tata letak diperbarui
    } else {
      setError("Gagal mendapatkan data pengguna setelah login.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Kantoor Antang</span>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Log in</h1>
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="#" className="text-green-600 hover:text-green-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-12 border-gray-300 focus:border-green-600 focus:ring-green-600 text-gray-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Link 
                  href="#" 
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 border-gray-300 focus:border-green-600 focus:ring-green-600 text-gray-900"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-base" 
              disabled={isLoading}
            >
              {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
              Log in
            </Button>
          </form>

          {/* --- BAGIAN DIVIDER DIHAPUS --- */}
          
          {/* --- BAGIAN SOCIAL LOGIN (GOOGLE) DIHAPUS --- */}
          
          {/* Footer */}
          {/* Memberi jarak atas (mt-8) agar tidak terlalu rapat setelah tombol google dihapus */}
          <div className="mt-8 text-center text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <Link href="#" className="text-gray-700 hover:text-gray-900 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-gray-700 hover:text-gray-900 underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 via-green-600 to-green-700 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Manajemen Proposal dan Anggaran Terpusat
          </h2>
          <p className="text-lg text-green-50 leading-relaxed mb-8">
            Platform untuk Divisi Perencanaan Yayasan Antang Patahu Mahaga Lewu dalam mengelola pengajuan dan persetujuan anggaran secara efisien.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-green-50">Alur kerja pengajuan yang terstruktur</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-green-50">Monitoring status proposal secara real-time</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-green-50">Sentralisasi dokumen dan data anggaran</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
