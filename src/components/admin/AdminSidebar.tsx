import { Link } from '@/navigation';
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-medical-blue">Prestige Admin</h2>
        <p className="text-xs text-slate-400 mt-1">Control Center</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <ShoppingCart className="w-5 h-5" />
          Orders
        </Link>
        <Link href="/admin/inventory" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <Package className="w-5 h-5" />
          Inventory
        </Link>
        <Link href="/admin/registrations" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <Users className="w-5 h-5" />
          Registrations
        </Link>
        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={async () => {
            try {
              await supabase.auth.signOut();
              await fetch('/api/admin/session', { method: 'DELETE' });
            } finally {
              const parts = window.location.pathname.split('/');
              const lang = parts[1] || 'fr';
              window.location.href = `/${lang}/admin/login`;
            }
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
