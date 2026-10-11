import React, { useState } from 'react';
import { api } from '../../services/apiClient';
import { User } from '@delivery/shared';
import { 
  Lock, 
  Mail, 
  ShieldAlert, 
  X, 
  Bike, 
  Store, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  User as UserIcon, 
  Phone, 
  UserPlus, 
  LogIn 
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  targetRoleMessage?: string;
  initialTab?: 'LOGIN' | 'REGISTER';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetRoleMessage,
  initialTab = 'LOGIN'
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>(initialTab);
  
  // Login form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form states (Customer Self-Registration)
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (idVal?: string, passVal?: string) => {
    const emailToUse = idVal || identifier;
    const passToUse = passVal || password;

    if (!emailToUse || !passToUse) {
      setErrorMessage('Harap isi Email/No. HP dan Password');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.login(emailToUse, passToUse);
      if (res.success && res.data?.user) {
        onSuccess(res.data.user);
        onClose();
      } else {
        setErrorMessage(res.message || 'Login gagal, periksa email/password Anda');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regPhone.trim()) {
      setErrorMessage('Nama lengkap dan nomor handphone wajib diisi');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.registerCustomer({
        fullName: regFullName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim() || `${regPhone.trim()}@pelanggan.azgo.com`,
        password: regPassword || 'user123'
      });

      if (res.success && res.data?.user) {
        setSuccessMessage('Pendaftaran akun berhasil!');
        setTimeout(() => {
          onSuccess(res.data.user);
          onClose();
        }, 600);
      } else {
        setErrorMessage(res.message || 'Pendaftaran gagal');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftar akun');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    handleLogin(email, pass);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 relative my-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center">
          <img
            src="/logo-app-icon.png"
            alt="AZ GO App Icon"
            className="w-14 h-14 rounded-2xl mx-auto shadow-md object-contain"
          />
          <img
            src="/logo-horizontal.png"
            alt="AZ GO"
            className="h-7 mx-auto object-contain mt-2"
          />
          <p className="text-xs text-slate-500 mt-1">
            {targetRoleMessage 
              ? 'Silakan masuk untuk melanjutkan pesanan Anda'
              : 'Akses masuk akun Pelanggan, Mitra Driver, Toko, Hub, & Admin'}
          </p>
        </div>

        {targetRoleMessage && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Perhatian:</strong> {targetRoleMessage}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold text-center">
            {successMessage}
          </div>
        )}

        {/* Auth Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('LOGIN');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMode === 'LOGIN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-rose-600" />
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('REGISTER');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMode === 'REGISTER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-rose-600" />
            Daftar Pelanggan Baru
          </button>
        </div>

        {/* TAB 1: FORM LOGIN */}
        {authMode === 'LOGIN' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-3.5 text-xs"
          >
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email atau No. Handphone</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="0812... / nama@email.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kata Sandi (Password)</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* TAB 2: FORM DAFTAR PELANGGAN BARU */
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siti Rahma"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="081299887766"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email (Opsional)</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="nama@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kata Sandi Baru</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? 'Mendaftarkan...' : 'Daftar & Langsung Masuk'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 1-Click Quick Demo Accounts (Termasuk Pelanggan) */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-2">
            ⚡ Quick Demo Login (Pilih Akun Instan)
          </span>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {/* 1. PELANGGAN (CUSTOMER) */}
            <button
              type="button"
              onClick={() => handleQuickLogin('pelanggan@azgo.com', 'user123')}
              className="p-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 transition text-left flex items-center gap-2 col-span-2"
            >
              <div className="p-1.5 bg-rose-600 text-white rounded-lg">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-extrabold text-rose-950 block leading-tight">Pelanggan Demo (Order Makanan/Barang)</span>
                <span className="text-[10px] text-rose-700">Siti Rahma • 081299887766</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('driver@azgo.com', 'driver123')}
              className="p-2 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition text-left flex items-center gap-2"
            >
              <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg">
                <Bike className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-extrabold text-slate-900 block leading-tight truncate">Driver</span>
                <span className="text-[10px] text-slate-500">Rudi Hartono</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('resto@azgo.com', 'resto123')}
              className="p-2 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 transition text-left flex items-center gap-2"
            >
              <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-extrabold text-slate-900 block leading-tight truncate">Toko / Resto</span>
                <span className="text-[10px] text-slate-500 truncate">Ayam Geprek</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('hub@azgo.com', 'hub123')}
              className="p-2 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition text-left flex items-center gap-2"
            >
              <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-extrabold text-slate-900 block leading-tight truncate">Staff Hub</span>
                <span className="text-[10px] text-slate-500 truncate">Gateway JKT</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@azgo.com', 'admin123')}
              className="p-2 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition text-left flex items-center gap-2"
            >
              <div className="p-1.5 bg-slate-900 text-white rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="truncate">
                <span className="font-extrabold text-slate-900 block leading-tight truncate">Admin</span>
                <span className="text-[10px] text-slate-500 truncate">Super Admin</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
