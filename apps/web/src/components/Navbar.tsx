import React from 'react';
import { User as UserType } from '@delivery/shared';
import { Search, ShieldCheck, Bike, Store, User, Building2, Lock, LogOut, KeyRound } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickTrack: (awb: string) => void;
  currentUser: UserType | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onChangePasswordClick: () => void;
  activeOrderCount?: number;
  onOpenTracking?: () => void;
  canTrack?: boolean;
  isDemoMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onQuickTrack,
  currentUser,
  onLoginClick,
  onLogoutClick,
  onChangePasswordClick,
  activeOrderCount = 0,
  onOpenTracking,
  canTrack = false,
  isDemoMode = true
}) => {
  const [quickAwb, setQuickAwb] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAwb.trim()) {
      onQuickTrack(quickAwb.trim());
      setActiveTab('tracking');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="text-[10px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">Admin</span>;
      case 'DRIVER':
        return <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">Driver</span>;
      case 'MERCHANT':
        return <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Toko</span>;
      case 'HUB_STAFF':
        return <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Hub</span>;
      case 'CUSTOMER':
        return <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Pelanggan</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo AZ GO */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 text-left group"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="/logo-app-icon.png"
                alt="AZ GO Icon"
                className="w-10 h-10 rounded-xl object-contain shadow-sm group-hover:scale-105 transition-transform"
              />
              <img
                src="/logo-with-slogan.png"
                alt="AZ GO — Antar Cepat, Kirim Mudah"
                className="hidden sm:block h-11 w-auto object-contain group-hover:scale-102 transition-transform"
              />
              <img
                src="/logo-horizontal.png"
                alt="AZ GO"
                className="sm:hidden h-8 w-auto object-contain"
              />
              {isDemoMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  DEMO
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Quick Resi Tracker Input: Hanya muncul jika sudah login sebagai Admin, Pelanggan, atau Toko */}
        {canTrack && (
          <form onSubmit={handleSearch} className="w-full md:w-64 flex items-center relative">
            <input
              type="text"
              placeholder="Lacak Resi (AZC/AZX)..."
              value={quickAwb}
              onChange={e => setQuickAwb(e.target.value)}
              className="w-full pl-9 pr-14 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono uppercase tracking-wider focus:outline-rose-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold"
            >
              Cek
            </button>
          </form>
        )}

        {/* Role Selector Tabs + Auth Status */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                ['home', 'delivery', 'courier', 'express', 'cargo', 'mart', 'pickup', 'tracking'].includes(activeTab)
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-rose-600" />
              Pelanggan
            </button>

            <button
              onClick={() => setActiveTab('driver-portal')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'driver-portal'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              Driver
            </button>

            <button
              onClick={() => setActiveTab('merchant-portal')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'merchant-portal'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Toko
            </button>

            <button
              onClick={() => setActiveTab('hub-portal')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'hub-portal'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Hub
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              Admin
            </button>
          </div>

          {/* User Auth Section */}
          <div className="shrink-0 flex items-center gap-1.5 pl-1">
            {canTrack && activeOrderCount > 0 && onOpenTracking && (
              <button
                onClick={onOpenTracking}
                title="Lacak Pesanan Aktif Anda"
                className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition animate-pulse"
              >
                <Bike className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline">Lacak</span> ({activeOrderCount})
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-2xl">
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-slate-900 max-w-[100px] truncate">{currentUser.fullName}</span>
                    {getRoleBadge(currentUser.role)}
                  </div>
                </div>
                <button
                  onClick={onChangePasswordClick}
                  title="Ubah Kata Sandi"
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-700 transition"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                </button>
                <button
                  onClick={onLogoutClick}
                  title="Keluar"
                  className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-600 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Lock className="w-3.5 h-3.5" />
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
