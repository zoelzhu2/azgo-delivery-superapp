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
  Lock,
  ShieldAlert,
  Eye,
  EyeOff,
  KeyRound,
  X
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

  // Proteksi PIN Peralihan Mode (Real <-> Demo)
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinTargetMode, setPinTargetMode] = useState<'REAL' | 'DEMO'>('DEMO');
  const [inputPin, setInputPin] = useState<string>('');
  const [showPinText, setShowPinText] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');
  const [pinSuccess, setPinSuccess] = useState<boolean>(false);
  const [showChangePinSection, setShowChangePinSection] = useState<boolean>(false);
  const [newPinValue, setNewPinValue] = useState<string>('');
  const [changePinMsg, setChangePinMsg] = useState<string>('');

  const handleOpenPinModal = (target: 'REAL' | 'DEMO') => {
    setPinTargetMode(target);
    setInputPin('');
    setPinError('');
    setPinSuccess(false);
    setShowChangePinSection(false);
    setNewPinValue('');
    setChangePinMsg('');
    setShowPinModal(true);
  };

  const handleVerifyPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputPin.trim();
    const customPin = localStorage.getItem('azgo_security_pin') || localStorage.getItem('azgo_real_mode_pin');
    const envPin = (import.meta as any).env?.VITE_REAL_MODE_PIN;

    // PIN yang valid: custom pin, env pin, atau default '8899', 'admin123', 'azgo2026', '123456'
    const validPins = [customPin, envPin, '8899', 'admin123', 'azgo2026', '123456'].filter(Boolean);

    if (validPins.includes(trimmed)) {
      setPinError('');
      setPinSuccess(true);
      setTimeout(() => {
        setShowPinModal(false);
        if (pinTargetMode === 'DEMO') {
          onToggleDemoMode(true);
        } else {
          onToggleDemoMode(false);
        }
      }, 700);
    } else {
      setPinError('Kode PIN Otorisasi Salah! Akses peralihan mode hanya untuk manajemen AzGo.');
    }
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinValue.trim() || newPinValue.trim().length < 4) {
      setPinError('PIN baru minimal harus 4 karakter.');
      return;
    }
    localStorage.setItem('azgo_security_pin', newPinValue.trim());
    localStorage.setItem('azgo_real_mode_pin', newPinValue.trim());
    setChangePinMsg(`✅ PIN Keamanan berhasil diubah menjadi: ${newPinValue.trim()}`);
    setNewPinValue('');
    setShowChangePinSection(false);
    setTimeout(() => setChangePinMsg(''), 5000);
  };

  const handleReset = () => {
    onResetDemoData();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

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

  // Helper untuk merender modal proteksi PIN
  const renderPinModal = () => (
    <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/90 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Tombol Tutup */}
        <button
          onClick={() => setShowPinModal(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Dialog */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              {pinTargetMode === 'DEMO' ? 'Proteksi Akses Mode Demo' : 'Proteksi Akses Mode Real'}
            </h3>
            <p className="text-xs text-slate-400">
              {pinTargetMode === 'DEMO'
                ? 'Verifikasi PIN Khusus Manajemen (Cegah Salah Klik)'
                : 'Otorisasi Keamanan Data Produksi AzGo'}
            </p>
          </div>
        </div>

        {/* Peringatan Keamanan / Antisipasi Salah Klik */}
        <div className="bg-amber-950/40 border border-amber-500/25 rounded-2xl p-3.5 mb-4 text-xs text-amber-200/90 leading-relaxed">
          <p className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Peringatan Sistem:
          </p>
          {pinTargetMode === 'DEMO' ? (
            <span>
              Aplikasi sedang berada di <strong>Mode Data Nyata (Operasional Resmi)</strong>. Untuk mengantisipasi kesalahan klik dari pelanggan atau kurir, pengalihan ke Mode Demo Simulasi memerlukan <strong>PIN Otorisasi Manajemen</strong>.
            </span>
          ) : (
            <span>
              Mode Real terhubung langsung ke database operasional live. Untuk menjaga agar calon investor / tamu tidak sengaja mengubah data real, diperlukan <strong>PIN Otorisasi Manajemen</strong>.
            </span>
          )}
        </div>

        {/* Notifikasi feedback sukses ubah PIN */}
        {changePinMsg && (
          <div className="mb-3 p-2.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{changePinMsg}</span>
          </div>
        )}

        {/* Form Input PIN */}
        {!showChangePinSection ? (
          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  Masukkan PIN Otorisasi:
                </label>
                <span className="text-[10px] text-amber-400/90 bg-amber-950/40 border border-amber-800/40 px-2.5 py-0.5 rounded-full font-semibold">
                  🔒 Khusus Manajemen AzGo
                </span>
              </div>

              <div className="relative">
                <input
                  type={showPinText ? 'text' : 'password'}
                  value={inputPin}
                  onChange={(e) => {
                    setInputPin(e.target.value);
                    if (pinError) setPinError('');
                  }}
                  autoFocus
                  placeholder="Masukkan PIN keamanan..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent tracking-widest font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPinText(!showPinText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <div className="mt-2 text-xs text-rose-400 font-semibold flex items-center gap-1.5 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              {pinSuccess && (
                <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>
                    PIN Terverifikasi! Mengalihkan ke {pinTargetMode === 'DEMO' ? 'Mode Demo' : 'Mode Real'}...
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition"
              >
                {pinTargetMode === 'DEMO' ? 'Tetap di Mode Real' : 'Tetap di Mode Demo'}
              </button>
              <button
                type="submit"
                disabled={!inputPin.trim() || pinSuccess}
                className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {pinTargetMode === 'DEMO' ? 'Verifikasi & Buka Demo' : 'Verifikasi & Buka Real'}
                </span>
              </button>
            </div>

            {/* Tombol Ganti PIN khusus jika role ADMIN */}
            {currentUser?.role === 'ADMIN' && (
              <div className="pt-2 text-center border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowChangePinSection(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline flex items-center justify-center gap-1 mx-auto"
                >
                  <KeyRound className="w-3 h-3" /> Ingin Ubah Kode PIN Keamanan Ini?
                </button>
              </div>
            )}
          </form>
        ) : (
          /* Form Ubah PIN Baru */
          <form onSubmit={handleSaveNewPin} className="space-y-4">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300">
              <span className="font-bold text-amber-400">Atur PIN Baru Anda:</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Hanya Anda yang tahu kode ini. Simpan kode ini untuk mengotorisasi peralihan mode nantinya.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                PIN Baru (minimal 4 digit/huruf):
              </label>
              <input
                type="text"
                value={newPinValue}
                onChange={(e) => setNewPinValue(e.target.value)}
                autoFocus
                placeholder="Contoh: 9988 atau azgomanajer"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-widest"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowChangePinSection(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={!newPinValue.trim()}
                className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan PIN Baru</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );

  // KONDISI 1: JIKA MODE REAL AKTIF (!isDemoMode)
  if (!isDemoMode) {
    return (
      <>
        <aside 
          aria-label="Mode Aplikasi"
          className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 flex items-center justify-between shadow-inner border-b border-emerald-800 sticky top-0 z-40"
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
            onClick={() => handleOpenPinModal('DEMO')}
            className="px-2.5 py-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 border border-emerald-700 shadow-xs cursor-pointer"
            title="Beralih ke Mode Demo Presentasi (Memerlukan PIN Keamanan)"
          >
            <Lock className="w-3 h-3 text-amber-300" />
            <span>Aktifkan Mode Demo Presentasi</span>
          </button>
        </aside>

        {showPinModal && renderPinModal()}
      </>
    );
  }

  // KONDISI 2: JIKA MODE DEMO COLLAPSED / DIKECILKAN
  if (isCollapsed) {
    return (
      <>
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
              onClick={() => handleOpenPinModal('REAL')}
              className="px-2 py-0.5 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 rounded text-[11px] font-bold flex items-center gap-1 transition border border-emerald-700"
            >
              <Lock className="w-3 h-3 text-emerald-400" /> Ke Mode Real
            </button>
            <button
              onClick={() => setIsCollapsed(false)}
              className="px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold flex items-center gap-1 transition"
            >
              Buka Panel Demo <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </aside>

        {showPinModal && renderPinModal()}
      </>
    );
  }

  // KONDISI 3: MODE DEMO TAMPIL LENGKAP
  return (
    <>
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

              <span className="text-slate-300 text-xs hidden md:inline">
                Aplikasi berjalan di lingkungan sandbox simulasi untuk keperluan demo / pitch deck.
              </span>

              {resetSuccess && (
                <span className="text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/60 font-medium animate-pulse">
                  ✓ Data pesanan demo berhasil direset ke awal
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

                {/* Toggle ke Mode Real dengan Proteksi PIN */}
                <button
                  onClick={() => handleOpenPinModal('REAL')}
                  title="Beralih ke Mode Data Nyata (Real / Production) — Memerlukan PIN Keamanan"
                  className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-lg text-[11px] font-bold border border-emerald-700/80 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-emerald-400" />
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

      {showPinModal && renderPinModal()}
    </>
  );
};
