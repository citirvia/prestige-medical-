'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes('/admin/login')) {
      return;
    }
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        const parts = pathname.split('/');
        const lang = parts[1] || 'fr';
        router.replace(`/${lang}/admin/login`);
      }
    };
    checkAuth();
  }, [router, pathname]);

  return (
    pathname.includes('/admin/login')
      ? <>{children}</>
      : (
        <div className="flex min-h-screen bg-slate-50">
          <AdminSidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </div>
      )
  );
}
