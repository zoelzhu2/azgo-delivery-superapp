import React, { useState } from 'react';
import { User as UserType } from '@delivery/shared';
import { 
  Sparkles, 
  RotateCcw, 
  User, 
  Bike, 
  Store, 
  ShoppingCart, 
  Building2, 
  ShieldCheck, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Database
} from 'lucide-react';

interface DemoBannerProps {
  isDemoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
  onQuickLogin: (email: string, pass: string) => void;
  onResetDemoData: () => void;
  currentUser: UserType | null;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  isDemoMode,
  onToggleDemoMode,
  onQuickLogin,
  onResetDemoData,
  currentUser
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const demoAccounts = [
    {
      role: 'CUSTOMER',
      label: 'Pelanggan',
      sublabel: 'Siti Rahma',
      email: 'pelanggan@azgo.com',
      pass: 'user123',
      icon: User,
      color: 'bg-rose-500 hover:bg-rose-600 text-white'
    },
    {
      role: 'DRIVER',
      label: 'Driver',
      sublabel: 'Rudi Hartono',
      email: 'driver@azgo.com',
      pass: 'driver123',
      icon: Bike,
      color: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
    },
    {
      role: 'MERCHANT',
      label: 'Toko Resto',
      sublabel: 'Ayam Geprek',
      email: 'resto@azgo.com',
      pass: 'resto123',
      icon: Store,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    },
    {
      role: 'MART',
      label: 'Toko Mart',
      sublabel: 'Az Mart',
      email: 'mart@azgo.com',
      pass: 'mart123',
      icon: ShoppingCart,
      color: 'bg-teal-600 hover:bg-teal-700 text-white'
    },
    {
      role: 'HUB_STAFF',
      label: 'Staf Hub',
      sublabel: 'Gateway JKT',
      email: 'hub@azgo.com',
      pass: 'hub123',
      icon: Building2,
      color: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      role: 'ADMIN',
      label: 'Admin',
      sublabel: 'Super Admin',
      email: 'admin@azgo.com',
      pass: 'admin123',
      icon: ShieldCheck,
      color: 'bg-slate-900 hover:bg-black text-white'
    }
  ];

  const handleReset = () => {
    onResetDemoData();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  // Jika mode demo dimatikan (Mode Real Aktif)
  if (!isDemoMode) {
    return (
      <aside 
        aria-label="Mode Aplikasi"
        className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 flex items-center justify-between shadow-inner border-b border-emerald-800"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-bold tracking-wide">
            🟢 MODE DATA NYATA (PRODUCTION / LIVE)
          </span>
          <span className="hidden md:inline text-emerald-300 text-[11px]">
            — Terhubung ke database operasional riil.
          </span>
        </div>
        <button
          onClick={() => onToggleDemoMode(true)}
          className="px-2.5 py-0.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5 border border-emerald-700"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          Aktifkan Mode Demo Presentasi
        </button>
      </aside>
    );
  }

  // Jika collapsed (dikecilkan untuk menghemat ruang layar presentasi)
  if (isCollapsed) {
    return (
      <aside 
        aria-label="Mode Demo Minimized"
        className="bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-800 text-white text-xs py-1 px-4 flex items-center justify-between shadow-md transition-all sticky top-0 z-50"
      >
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-amber-400 text-amber-950 font-black text-[10px] rounded-full uppercase tracking-wider">
            🎭 Demo Sandbox
          </span>
          <span className="text-[11px] text-amber-100 hidden sm:inline">
            Mode Presentasi Aktif {currentUser ? `• Sedang Login sbg ${currentUser.fullName} (${currentUser.role})` : '• Belum Login'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold flex items-center gap-1 transition"
          >
            Buka Panel Demo <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      aria-label="Mode Demo Presentasi"
      className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/60 shadow-lg text-xs relative z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Kolom Kiri: Status & Penjelasan */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[11px] rounded-xl shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>MODE DEMO PRESENTASI</span>
            </div>
            
            <span className="text-[11px] text-slate-300">
              Data simulasi aman untuk dipamerkan. Transaksi bebas biaya.
            </span>

            {resetSuccess && (
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold animate-fade-in flex items-center gap-1">
                <Check className="w-3 h-3" /> Data Demo Berhasil Di-Reset!
              </span>
            )}
          </div>

          {/* Kolom Kanan: Quick Switch Akun & Aksi Demo */}
          <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end">
            
            {/* 1-Click Role Switcher */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1 hidden sm:inline">
                Simulasi Login:
              </span>

              {demoAccounts.map(acc => {
                const isCurrent = currentUser?.email?.toLowerCase() === acc.email.toLowerCase() ||
                  (acc.role === 'MERCHANT' && currentUser?.role === 'MERCHANT' && acc.email === 'resto@azgo.com' && currentUser?.email?.includes('resto')) ||
                  (acc.role === 'MART' && currentUser?.role === 'MERCHANT' && currentUser?.email?.includes('mart'));
                
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.email}
                    onClick={() => onQuickLogin(acc.email, acc.pass)}
                    title={`Login instan sebagai ${acc.label} (${acc.sublabel})`}
                    className={`px-2 py-1 rounded-lg text-[11px] transition flex items-center gap-1 shrink-0 ${
                      isCurrent 
                        ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 font-black shadow ' + acc.color
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{acc.label}</span>
                    {isCurrent && <span className="text-[9px] bg-black/30 px-1 rounded">Aktif</span>}
                  </button>
                );
              })}
            </div>

            {/* Aksi Reset Data & Switch ke Real Mode */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
              {showResetConfirm ? (
                <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-600/50 p-1 rounded-xl">
                  <span className="text-[10px] text-rose-200 font-bold px-1">Reset pesanan demo?</span>
                  <button
                    onClick={handleReset}
                    className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold transition"
                  >
                    Ya, Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  title="Kembalikan semua pesanan demo ke kondisi awal yang bersih"
                  className="px-2.5 py-1 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 rounded-lg text-[11px] font-semibold border border-slate-700 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3 text-rose-400" />
                  <span className="hidden sm:inline">Reset Demo</span>
                </button>
              )}

              {/* Toggle ke Mode Real */}
              <button
                onClick={() => onToggleDemoMode(false)}
                title="Beralih ke Mode Data Nyata (Real / Production)"
                className="px-2 py-1 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 rounded-lg text-[11px] font-semibold border border-emerald-800/80 transition flex items-center gap-1"
              >
                <Database className="w-3 h-3 text-emerald-400" />
                <span className="hidden md:inline">Ke Mode Real</span>
              </button>

              {/* Minimize bar */}
              <button
                onClick={() => setIsCollapsed(true)}
                title="Sembunyikan panel demo ke atas"
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </aside>
  );
};
