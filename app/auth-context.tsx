'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabaseClient } from '@/app/supabase-client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile extends User {
  profile: {
    role: string;
    division: string | null;
    full_name: string | null;
  } | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Fungsi untuk memeriksa sesi saat ini dan mengambil profil
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, division, full_name')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.warn('Warning fetching user profile on initial load:', error.message);
        }
        setUser({ ...session.user, profile: profile || null });
      } else {
        setUser(null);
      }
      // Pastikan loading di-set ke false setelah pengecekan awal selesai
      setLoading(false);
    };

    // Jalankan pengecekan sesi saat komponen pertama kali dimuat
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Jika ada perubahan status (misalnya, pengguna login/logout setelah halaman dimuat),
      // jalankan kembali pengecekan sesi untuk memperbarui data.
      setLoading(true); // Tampilkan loading saat status berubah
      await checkSession();
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);