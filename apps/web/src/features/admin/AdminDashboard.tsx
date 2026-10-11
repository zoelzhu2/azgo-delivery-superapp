import React, { useEffect, useState } from 'react';
import { api } from '../../services/apiClient';
import { 
  User, 
  UserRole,
  PartnerApplication,
  PartnerType,
  PartnerApplicationStatus,
  CommissionConfig,
  WithdrawalRequest,
  PlatformFinanceSummary
} from '@delivery/shared';
import { 
  Sliders, 
  Users, 
  MapPin, 
  ArrowLeft, 
  CheckCircle2, 
  Save, 
  Activity,
  Plus,
  Store,
  X,
  UserPlus,
  KeyRound,
  ShieldCheck,
  LogOut,
  UserCheck,
  DollarSign,
  Eye,
  Check,
  Percent,
  Bike,
  Layers,
  Power,
  Ban
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
  onChangePassword?: () => void;
  onServicesUpdated?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onBack,
  currentUser,
  onLogout,
  onChangePassword,
  onServicesUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'pricing' | 'drivers' | 'merchants' | 'hubs' | 'users' | 'partners' | 'finance' | 'services'>('orders');
  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [pricing, setPricing] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [hubs, setHubs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Partner Applications State
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>([]);
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<'ALL' | PartnerApplicationStatus>('ALL');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<'ALL' | PartnerType>('ALL');
  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(null);
  const [showAppDetailModal, setShowAppDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [partnerActionSuccess, setPartnerActionSuccess] = useState('');
  const [createdAccountPopup, setCreatedAccountPopup] = useState<any>(null);

  // Finance & Commission State
  const [financeSummary, setFinanceSummary] = useState<PlatformFinanceSummary | null>(null);
  const [commissionConfig, setCommissionConfig] = useState<CommissionConfig | null>(null);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalActionType, setWithdrawalActionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [transferRefCode, setTransferRefCode] = useState('');
  const [withdrawalReviewNotes, setWithdrawalReviewNotes] = useState('');
  const [financeSuccess, setFinanceSuccess] = useState('');

  // User Management State (Super Admin Only)
  const [users, setUsers] = useState<User[]>([]);
  const [userSuccess, setUserSuccess] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [targetResetUser, setTargetResetUser] = useState<User | null>(null);
  const [adminNewPassword, setAdminNewPassword] = useState('azgo123');

  // Form New User
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('DRIVER');
  const [newUserPassword, setNewUserPassword] = useState('azgo123');

  // Modal States
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [showHubModal, setShowHubModal] = useState(false);

  // New Driver Form
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newDriverVehicle, setNewDriverVehicle] = useState('');
  const [newDriverRole, setNewDriverRole] = useState('MOTORBIKE');

  // New Merchant Form
  const [newMerchantName, setNewMerchantName] = useState('');
  const [newMerchantType, setNewMerchantType] = useState<'FOOD' | 'MART'>('FOOD');
  const [newMerchantCategory, setNewMerchantCategory] = useState('');
  const [newMerchantAddress, setNewMerchantAddress] = useState('');
  const [newInitialItem, setNewInitialItem] = useState('');
  const [newInitialPrice, setNewInitialPrice] = useState<number>(25000);

  // New Hub Form
  const [newHubCode, setNewHubCode] = useState('');
  const [newHubName, setNewHubName] = useState('');
  const [newHubType, setNewHubType] = useState<'DROP_POINT' | 'SORTING_CENTER'>('DROP_POINT');
  const [newHubCity, setNewHubCity] = useState('Jakarta');
  const [newHubAddress, setNewHubAddress] = useState('');

  // Fetch Initial Data
  const loadData = async () => {
    try {
      const [mRes, oRes, pRes, dRes, merchRes, hRes, uRes, partRes, finRes, commRes, wRes, srvRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getAdminOrders(serviceFilter),
        api.getAdminPricing(),
        api.getAdminDrivers(),
        api.getAdminMerchants(),
        api.getAdminHubs(),
        api.getAdminUsers(),
        api.getPartnerApplications(),
        api.getFinanceSummary(),
        api.getCommissionConfig(),
        api.getWithdrawalRequests(),
        api.getAdminServices()
      ]);
      if (mRes.success) setMetrics(mRes.data);
      if (oRes.success) setOrders(oRes.data);
      if (pRes.success) setPricing(pRes.data);
      if (dRes.success) setDrivers(dRes.data);
      if (merchRes.success) setMerchants(merchRes.data);
      if (hRes.success) setHubs(hRes.data);
      if (uRes.success) setUsers(uRes.data);
      if (partRes.success) setPartnerApplications(partRes.data);
      if (finRes.success) setFinanceSummary(finRes.data);
      if (commRes.success) setCommissionConfig(commRes.data);
      if (wRes.success) setWithdrawalRequests(wRes.data);
      if (srvRes?.success) setServices(srvRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [serviceFilter]);

  // Toggle Handlers
  const handleToggleDriver = async (driverId: string) => {
    try {
      const res = await api.toggleAdminDriver(driverId);
      if (res.success && res.data) {
        setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, isActive: res.data.isActive } : d));
        setSaveSuccess(`Status driver berhasil diubah: ${res.data.isActive ? '🟢 AKTIF (Bisa Terima Order)' : '🔴 NONAKTIF (Ditangguhkan)'}`);
        setTimeout(() => setSaveSuccess(''), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status driver');
    }
  };

  const handleToggleMerchant = async (merchantId: string) => {
    try {
      const res = await api.toggleAdminMerchant(merchantId);
      if (res.success && res.data) {
        setMerchants(prev => prev.map(m => m.id === merchantId ? { ...m, isActive: res.data.isActive } : m));
        setSaveSuccess(`Status toko berhasil diubah: ${res.data.isActive ? '🟢 AKTIF (Tampil di Pelanggan)' : '🔴 NONAKTIF (Toko Ditutup)'}`);
        setTimeout(() => setSaveSuccess(''), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status merchant');
    }
  };

  const handleToggleHub = async (hubId: string) => {
    try {
      const res = await api.toggleAdminHub(hubId);
      if (res.success && res.data) {
        setHubs(prev => prev.map(h => h.id === hubId ? { ...h, isActive: res.data.isActive } : h));
        setSaveSuccess(`Status cabang hub berhasil diubah: ${res.data.isActive ? '🟢 AKTIF (Beroperasi Normal)' : '🔴 NONAKTIF'}`);
        setTimeout(() => setSaveSuccess(''), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status hub');
    }
  };

  const handleToggleUser = async (userId: string) => {
    try {
      const res = await api.toggleAdminUser(userId);
      if (res.success && res.data) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: res.data.isActive } : u));
        setUserSuccess(`Akses login user ${res.data.fullName} berhasil ${res.data.isActive ? 'DIAKTIFKAN' : 'DIBLOKIR / DINONAKTIFKAN'}!`);
        setTimeout(() => setUserSuccess(''), 5000);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status user');
    }
  };

  const handleToggleService = async (serviceId: string) => {
    try {
      const res = await api.toggleAdminService(serviceId);
      if (res.success && res.data) {
        setServices(prev => prev.map(s => s.id === serviceId ? res.data : s));
        const activeStatus = res.data.isActive ?? res.data.isEnabled;
        setSaveSuccess(`Layanan ${res.data.name} berhasil ${activeStatus ? 'DIAKTIFKAN' : 'DINONAKTIFKAN'} pada aplikasi pelanggan!`);
        setTimeout(() => setSaveSuccess(''), 4000);
        onServicesUpdated?.();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status layanan');
    }
  };

  // Partner Review Handlers
  const handleApproveApplication = async (appId: string) => {
    try {
      const res = await api.reviewPartnerApplication(appId, 'APPROVE');
      if (res.success && res.data) {
        setPartnerApplications(prev => prev.map(a => a.id === appId ? res.data : a));
        setShowAppDetailModal(false);
        setSelectedApp(null);
        setCreatedAccountPopup({
          fullName: res.data.fullName,
          role: res.data.type === 'DRIVER' ? 'Mitra Driver' : 'Mitra Toko',
          email: res.data.email,
          temporaryPassword: res.data.tempPassword || 'mitra123'
        });
        setPartnerActionSuccess(`✅ Berkas pendaftaran mitra disetujui! Akun login otomatis dibuat untuk ${res.data.fullName}.`);
        setTimeout(() => setPartnerActionSuccess(''), 7000);
        loadData();
      } else {
        alert(res.message || 'Gagal menyetujui pengajuan');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem');
    }
  };

  const handleRejectApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      const res = await api.reviewPartnerApplication(selectedApp.id, 'REJECT', rejectNotes);
      if (res.success && res.data) {
        setPartnerApplications(prev => prev.map(a => a.id === selectedApp.id ? res.data : a));
        setShowRejectModal(false);
        setShowAppDetailModal(false);
        setSelectedApp(null);
        setRejectNotes('');
        setPartnerActionSuccess(`ℹ️ Pengajuan kemitraan telah ditolak dengan catatan: "${rejectNotes || 'Dokumen belum memenuhi syarat'}".`);
        setTimeout(() => setPartnerActionSuccess(''), 7000);
      } else {
        alert(res.message || 'Gagal menolak pengajuan');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem');
    }
  };

  // Finance Handlers
  const handleSaveCommissionConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionConfig) return;
    try {
      const res = await api.updateCommissionConfig(commissionConfig);
      if (res.success) {
        setCommissionConfig(res.data);
        setFinanceSuccess('✅ Pengaturan skema bagi hasil & komisi platform berhasil disimpan secara live!');
        setTimeout(() => setFinanceSuccess(''), 5000);
      } else {
        alert(res.message || 'Gagal menyimpan konfigurasi');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem');
    }
  };

  const handleReviewWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWithdrawal) return;
    try {
      const status = withdrawalActionType === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      const res = await api.reviewWithdrawal(
        selectedWithdrawal.id, 
        withdrawalActionType, 
        withdrawalActionType === 'APPROVE' ? (transferRefCode ? `Ref: ${transferRefCode}` : 'Disetujui Admin') : withdrawalReviewNotes
      );
      if (res.success) {
        setWithdrawalRequests(prev => prev.map(w => w.id === selectedWithdrawal.id ? res.data : w));
        setShowWithdrawalModal(false);
        setSelectedWithdrawal(null);
        setTransferRefCode('');
        setWithdrawalReviewNotes('');
        setFinanceSuccess(status === 'APPROVED' 
          ? `✅ Penarikan dana Rp ${selectedWithdrawal.amount.toLocaleString('id-ID')} disetujui (Ref: ${transferRefCode || 'TRF-AUTO'})!`
          : `ℹ️ Penarikan dana ditolak dan saldo telah dikembalikan ke dompet mitra.`
        );
        setTimeout(() => setFinanceSuccess(''), 6000);
        const finRes = await api.getFinanceSummary();
        if (finRes.success) setFinanceSummary(finRes.data);
      } else {
        alert(res.message || 'Gagal memproses penarikan');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem');
    }
  };

  // Admin User Creation
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPhone) return;
    try {
      const res = await api.createAdminUser({
        fullName: newUserName,
        email: newUserEmail,
        phone: newUserPhone,
        role: newUserRole,
        password: newUserPassword
      });
      if (res.success) {
        setUsers(prev => [res.data, ...prev]);
        setShowUserModal(false);
        setUserSuccess(`✅ User baru ${res.data.fullName} (${res.data.role}) berhasil ditambahkan!`);
        setTimeout(() => setUserSuccess(''), 5000);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPhone('');
        setNewUserPassword('azgo123');
      } else {
        alert(res.message || 'Gagal menambahkan user');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem');
    }
  };

  // Admin Password Reset
  const handleAdminResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetResetUser || !adminNewPassword) return;
    try {
      const res = await api.adminResetPassword(targetResetUser.id, adminNewPassword);
      if (res.success) {
        setUserSuccess(`✅ Password untuk ${targetResetUser.fullName} (${targetResetUser.email}) berhasil direset menjadi: ${adminNewPassword}`);
        setTimeout(() => setUserSuccess(''), 6000);
        setShowResetModal(false);
        setTargetResetUser(null);
      } else {
        alert(res.message || 'Gagal mereset password');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem');
    }
  };

  // Handle Update Pricing
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateAdminPricing(pricing);
      if (res.success) {
        setSaveSuccess('✅ Konfigurasi tarif berhasil diperbarui secara live!');
        setTimeout(() => setSaveSuccess(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Verify Driver
  const handleVerify = async (driverId: string) => {
    try {
      const res = await api.verifyDriver(driverId);
      if (res.success) {
        setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status: 'VERIFIED' } : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit New Driver
  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName || !newDriverPhone || !newDriverVehicle) return;
    try {
      const res = await api.createAdminDriver({
        name: newDriverName,
        phone: newDriverPhone,
        vehicle: newDriverVehicle,
        role: newDriverRole
      });
      if (res.success) {
        setDrivers(prev => [res.data, ...prev]);
        setShowDriverModal(false);
        setNewDriverName('');
        setNewDriverPhone('');
        setNewDriverVehicle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit New Merchant
  const handleAddMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchantName || !newMerchantCategory || !newMerchantAddress) return;
    try {
      const res = await api.createAdminMerchant({
        name: newMerchantName,
        type: newMerchantType,
        category: newMerchantCategory,
        address: newMerchantAddress,
        initialItemName: newInitialItem,
        initialItemPrice: newInitialPrice
      });
      if (res.success) {
        setMerchants(prev => [res.data, ...prev]);
        setShowMerchantModal(false);
        setNewMerchantName('');
        setNewMerchantCategory('');
        setNewMerchantAddress('');
        setNewInitialItem('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit New Hub
  const handleAddHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHubCode || !newHubName || !newHubAddress) return;
    try {
      const res = await api.createAdminHub({
        hubCode: newHubCode,
        name: newHubName,
        hubType: newHubType,
        city: newHubCity,
        address: newHubAddress
      });
      if (res.success) {
        setHubs(prev => [...prev, res.data]);
        setShowHubModal(false);
        setNewHubCode('');
        setNewHubName('');
        setNewHubAddress('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getServiceBadge = (type: string) => {
    switch (type) {
      case 'AZ_DELIVERY': return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">🛵 Az Delivery</span>;
      case 'AZ_COURIER': return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">📦 Az Courier</span>;
      case 'AZ_EXPRESS': return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">🚚 Az Express</span>;
      case 'AZ_CARGO': return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800">🚛 Az Cargo</span>;
      case 'AZ_MART': return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">🛒 Az Mart</span>;
      case 'AZ_PICKUP': return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800">📍 Az Pickup</span>;
      default: return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{type}</span>;
    }
  };

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">Super Admin</span>;
      case 'DRIVER':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">Mitra Driver</span>;
      case 'MERCHANT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">Mitra Toko/Resto</span>;
      case 'HUB_STAFF':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">Staff Hub/Gudang</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{role}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Tampilan Pengguna
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {currentUser && (
            <div className="flex items-center gap-2 text-xs bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="font-extrabold text-slate-900">{currentUser.fullName}</span>
              <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">{currentUser.role}</span>
            </div>
          )}
          {onChangePassword && (
            <button
              onClick={onChangePassword}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" /> Ubah Password
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          )}
          <span className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Mode Administrator
          </span>
        </div>
      </div>

      {/* KPI METRICS OVERVIEW */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block mb-1">Omset Transaksi Hari Ini</span>
            <p className="text-2xl font-black text-slate-900">Rp {metrics.todayRevenue.toLocaleString('id-ID')}</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">↑ +14.2% vs kemarin</span>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block mb-1">Pesanan Aktif (Live)</span>
            <p className="text-2xl font-black text-rose-600">{metrics.activeOrdersCount} Order</p>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">Di seluruh 7 layanan</span>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block mb-1">Armada Driver Online</span>
            <p className="text-2xl font-black text-indigo-600">{metrics.onlineDriversCount} Driver</p>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Motor, Pickup & Truk</span>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block mb-1">Paket Masuk Hari Ini</span>
            <p className="text-2xl font-black text-slate-900">{metrics.totalParcelsToday} Resi</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Tingkat Ketepatan: {metrics.onTimeDeliveryRate}</span>
          </div>
        </div>
      )}

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" /> Live Orders Monitor
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'pricing' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" /> Konfigurasi Tarif
        </button>

        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'drivers' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Mitra Pengemudi ({drivers.length})
        </button>

        <button
          onClick={() => setActiveTab('merchants')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'merchants' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Store className="w-4 h-4" /> Mitra Resto & Mart ({merchants.length})
        </button>

        <button
          onClick={() => setActiveTab('hubs')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'hubs' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" /> Jaringan Drop Point & Hub ({hubs.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'users' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4 text-amber-400" /> Manajemen User ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'partners' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4 text-rose-400" /> Verifikasi Mitra
          {partnerApplications.filter(a => a.status === 'PENDING_REVIEW').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
              {partnerApplications.filter(a => a.status === 'PENDING_REVIEW').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'finance' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" /> Kelola Keuangan & Bagi Hasil
          {withdrawalRequests.filter(w => w.status === 'PENDING').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
              {withdrawalRequests.filter(w => w.status === 'PENDING').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'services' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-400" /> Kontrol Layanan AZ GO ({services.filter(s => s.isActive !== false).length}/{services.length || 7})
        </button>
      </div>

      {/* TAB 1: LIVE ORDERS MONITOR */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Monitoring Transaksi Real-Time</h3>
              <p className="text-xs text-slate-400">Pantau seluruh pesanan dari 7 layanan AZ GO.</p>
            </div>

            <select
              value={serviceFilter}
              onChange={e => setServiceFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-slate-900"
            >
              <option value="ALL">Semua Layanan (All)</option>
              <option value="AZ_DELIVERY">🛵 Az Delivery</option>
              <option value="AZ_COURIER">📦 Az Courier</option>
              <option value="AZ_EXPRESS">🚚 Az Express</option>
              <option value="AZ_CARGO">🚛 Az Cargo</option>
              <option value="AZ_MART">🛒 Az Mart</option>
              <option value="AZ_PICKUP">📍 Az Pickup</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Order / Resi</th>
                  <th className="py-3 px-4">Layanan</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Armada / Driver</th>
                  <th className="py-3 px-4">Rute</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                    <td className="py-3 px-4">{getServiceBadge(o.serviceType)}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{o.customerName}</td>
                    <td className="py-3 px-4 text-slate-600">{o.driverName}</td>
                    <td className="py-3 px-4 text-[11px] text-slate-500 max-w-xs truncate">
                      {o.pickup} → {o.dropoff}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      {o.totalAmount > 0 ? `Rp ${o.totalAmount.toLocaleString('id-ID')}` : 'Gratis Jemput'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PENGATURAN TARIF DINAMIS */}
      {activeTab === 'pricing' && pricing && (
        <form onSubmit={handleSavePricing} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Konfigurasi Tarif Operasional</h3>
              <p className="text-xs text-slate-500">Ubah tarif dasar atau per kilometer tanpa perlu mengubah kode program.</p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Save className="w-3.5 h-3.5" /> Simpan Perubahan
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-bold">
              {saveSuccess}
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block text-sm">🛵 Tarif Az Delivery & Antar Jemput</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1">Tarif Dasar (0-3 KM):</label>
                  <input
                    type="number"
                    value={pricing.deliveryBaseFare}
                    onChange={e => setPricing({ ...pricing, deliveryBaseFare: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Tarif per KM Berikutnya:</label>
                  <input
                    type="number"
                    value={pricing.deliveryPerKm}
                    onChange={e => setPricing({ ...pricing, deliveryPerKm: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block text-sm">📦 Tarif Az Courier & Express</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1">Tarif Dasar per Kg (Reguler):</label>
                  <input
                    type="number"
                    value={pricing.courierRatePerKg}
                    onChange={e => setPricing({ ...pricing, courierRatePerKg: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Multiplier Kilat (Az Express):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricing.expressRateMultiplier}
                    onChange={e => setPricing({ ...pricing, expressRateMultiplier: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block text-sm">🚛 Tarif Az Cargo (Muatan Besar)</span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Dasar Pickup Bak:</label>
                  <input
                    type="number"
                    value={pricing.cargoPickupBakBase}
                    onChange={e => setPricing({ ...pricing, cargoPickupBakBase: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Dasar Truk Engkel:</label>
                  <input
                    type="number"
                    value={pricing.cargoTruckEngkelBase}
                    onChange={e => setPricing({ ...pricing, cargoTruckEngkelBase: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Upah Helper (/org):</label>
                  <input
                    type="number"
                    value={pricing.cargoHelperFee}
                    onChange={e => setPricing({ ...pricing, cargoHelperFee: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Biaya Layanan Aplikasi (Platform Fee per Transaksi):</label>
              <input
                type="number"
                value={pricing.platformFee}
                onChange={e => setPricing({ ...pricing, platformFee: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: MANAJEMEN MITRA PENGEMUDI */}
      {activeTab === 'drivers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Daftar & Verifikasi Mitra Pengemudi</h3>
              <p className="text-xs text-slate-500">Kelola armada motor, kurir penjemputan, hingga truk kargo.</p>
            </div>
            <button
              onClick={() => setShowDriverModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Tambah Mitra Pengemudi
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {drivers.map(d => (
              <div key={d.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{d.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {d.isActive !== false ? '🟢 Akun Aktif' : '🔴 Ditangguhkan'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.isOnline ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {d.isOnline ? 'Online' : 'Offline'}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {d.role}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">Armada: <strong>{d.vehicle}</strong> • Kontak: {d.phone}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleDriver(d.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                      d.isActive !== false 
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' 
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {d.isActive !== false ? <><Ban className="w-3.5 h-3.5" /> Nonaktifkan</> : <><Power className="w-3.5 h-3.5" /> Aktifkan</>}
                  </button>
                  {d.status === 'VERIFIED' ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                    </span>
                  ) : (
                    <button
                      onClick={() => handleVerify(d.id)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition"
                    >
                      Verifikasi Akun
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MANAJEMEN MITRA RESTO & MART */}
      {activeTab === 'merchants' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Daftar Mitra Restoran & Toko Sembako</h3>
              <p className="text-xs text-slate-500">Toko mitra untuk layanan Az Delivery (Makanan) dan Az Mart (Belanja).</p>
            </div>
            <button
              onClick={() => setShowMerchantModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Tambah Toko / Resto
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {merchants.map(m => (
              <div key={m.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      m.type === 'FOOD' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {m.type === 'FOOD' ? '🛵 Restoran Az Delivery' : '🛒 Minimarket Az Mart'}
                    </span>
                    <span className="text-amber-600 font-bold">★ {m.rating}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                  <p className="text-slate-500">{m.category} • {m.address}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                  <span className="font-semibold">{m.items?.length || 0} Menu/Produk Terdaftar</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      m.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {m.isActive !== false ? '🟢 Toko Aktif' : '🔴 Toko Tutup'}
                    </span>
                    <button
                      onClick={() => handleToggleMerchant(m.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition flex items-center gap-1 ${
                        m.isActive !== false ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {m.isActive !== false ? <><Ban className="w-3 h-3" /> Nonaktifkan</> : <><Power className="w-3 h-3" /> Aktifkan</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: JARINGAN DROP POINT & HUB */}
      {activeTab === 'hubs' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Jaringan Cabang & Gateway Sorting AZ GO</h3>
              <p className="text-xs text-slate-500">Drop Point penyerahan barang dan Gateway sortir antar-kota.</p>
            </div>
            <button
              onClick={() => setShowHubModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Tambah Cabang Hub / Agen
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {hubs.map(h => (
              <div key={h.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    h.hubType === 'DROP_POINT' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {h.hubType}
                  </span>
                  <span className="font-mono font-bold text-slate-500">{h.hubCode}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{h.name}</h4>
                <p className="text-slate-500">{h.address}, {h.city}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className={`text-[11px] font-bold ${h.isActive !== false ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {h.isActive !== false ? '● Beroperasi Normal' : '● Cabang Nonaktif'}
                  </span>
                  <button
                    onClick={() => handleToggleHub(h.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition flex items-center gap-1 ${
                      h.isActive !== false ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {h.isActive !== false ? <><Ban className="w-3 h-3" /> Nonaktifkan</> : <><Power className="w-3 h-3" /> Aktifkan</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: MANAJEMEN USER & PASSWORD (KHUSUS ADMIN) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Manajemen Akun & Hak Akses Pengguna</h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                  Khusus Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hanya Administrator yang memiliki wewenang membuat akun baru dan mereset password mitra/staf.
              </p>
            </div>
            <button
              onClick={() => setShowUserModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" /> Tambah User Baru
            </button>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Ketentuan Akses:</strong> Mitra Driver, Mitra Toko, dan Staff Hub hanya dapat mengubah password pribadi mereka sendiri pada portal masing-masing. Mereka tidak memiliki akses untuk menambah atau menghapus user akun.
            </div>
          </div>

          {userSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {userSuccess}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">No. HP</th>
                  <th className="py-3 px-4">Hak Akses (Role)</th>
                  <th className="py-3 px-4">Terdaftar</th>
                  <th className="py-3 px-4 text-right">Aksi Administrator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.fullName}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{u.email}</td>
                    <td className="py-3 px-4 text-slate-600">{u.phone}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getUserRoleBadge(u.role)}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {u.isActive !== false ? 'Aktif' : 'Diblokir'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleUser(u.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition inline-flex items-center gap-1 ${
                            u.isActive !== false 
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' 
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {u.isActive !== false ? <><Ban className="w-3 h-3" /> Blokir Akses</> : <><Power className="w-3 h-3" /> Buka Akses</>}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setTargetResetUser(u);
                          setAdminNewPassword('azgo123');
                          setShowResetModal(true);
                        }}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-bold text-[11px] border border-amber-200 transition inline-flex items-center gap-1"
                      >
                        <KeyRound className="w-3 h-3 text-amber-700" /> Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 7: VERIFIKASI PENDAFTARAN MITRA ================= */}
      {activeTab === 'partners' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Verifikasi & Tinjauan Berkas Pendaftaran Mitra</h3>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                  Approval Tim Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tinjau berkas identitas (KTP, SIM, STNK, Foto Toko). Sistem akan otomatis membuatkan akun login mitra saat disetujui.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={partnerTypeFilter}
                onChange={e => setPartnerTypeFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
              >
                <option value="ALL">Semua Jenis Mitra</option>
                <option value="DRIVER">Mitra Driver (Kurir & Kargo)</option>
                <option value="MERCHANT">Mitra Toko (Resto & Mart)</option>
              </select>

              <select
                value={partnerStatusFilter}
                onChange={e => setPartnerStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING_REVIEW">Menunggu Verifikasi (Pending)</option>
                <option value="APPROVED">Disetujui (Approved)</option>
                <option value="REJECTED">Ditolak (Rejected)</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Total Pengajuan</span>
              <span className="text-xl font-black text-slate-900">{partnerApplications.length}</span>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-amber-700 block font-bold">Menunggu Tinjauan</span>
              <span className="text-xl font-black text-amber-900">
                {partnerApplications.filter(a => a.status === 'PENDING_REVIEW').length}
              </span>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-emerald-700 block font-bold">Mitra Disetujui</span>
              <span className="text-xl font-black text-emerald-900">
                {partnerApplications.filter(a => a.status === 'APPROVED').length}
              </span>
            </div>
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200">
              <span className="text-rose-700 block font-bold">Pengajuan Ditolak</span>
              <span className="text-xl font-black text-rose-900">
                {partnerApplications.filter(a => a.status === 'REJECTED').length}
              </span>
            </div>
          </div>

          {partnerActionSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{partnerActionSuccess}</span>
            </div>
          )}

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Pengajuan</th>
                  <th className="py-3 px-4">Pemohon</th>
                  <th className="py-3 px-4">Jenis Mitra</th>
                  <th className="py-3 px-4">Detail Usaha / Armada</th>
                  <th className="py-3 px-4">Dokumen Berkas</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partnerApplications
                  .filter(app => partnerStatusFilter === 'ALL' || app.status === partnerStatusFilter)
                  .filter(app => partnerTypeFilter === 'ALL' || app.type === partnerTypeFilter)
                  .map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{app.id}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(app.submittedAt).toLocaleDateString('id-ID')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{app.fullName}</div>
                        <div className="text-slate-500 text-[11px]">{app.phone} • {app.city}</div>
                        <div className="text-slate-400 text-[10px] font-mono">{app.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        {app.type === 'DRIVER' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 inline-flex items-center gap-1">
                            <Bike className="w-3 h-3 text-amber-700" /> Driver ({app.vehicleCategory})
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 inline-flex items-center gap-1">
                            <Store className="w-3 h-3 text-emerald-700" /> {app.merchantType === 'FOOD' ? 'Resto' : 'Mart'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-700">
                        {app.type === 'DRIVER' ? (
                          <div>
                            <span className="font-bold text-slate-900">{app.vehicleModel}</span>
                            <span className="block font-mono text-slate-500">{app.vehiclePlate}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-slate-900">{app.storeName}</span>
                            <span className="block text-slate-500">{app.storeCategory}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowAppDetailModal(true);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3 text-slate-500" /> Tinjau Berkas
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        {app.status === 'PENDING_REVIEW' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                            Menunggu Review
                          </span>
                        )}
                        {app.status === 'APPROVED' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Disetujui
                          </span>
                        )}
                        {app.status === 'REJECTED' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                            Ditolak
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {app.status === 'PENDING_REVIEW' ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleApproveApplication(app.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] shadow-sm transition inline-flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Setujui
                            </button>
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setRejectNotes('');
                                setShowRejectModal(true);
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-[11px] border border-rose-200 transition"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            {app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString('id-ID') : '-'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 8: KELOLA KEUANGAN & BAGI HASIL ================= */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* KPI Keuangan Platform */}
          {financeSummary && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Total Omset GMV</span>
                <p className="text-lg font-black text-slate-900">
                  Rp {financeSummary.totalGmv.toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Semua Transaksi Order</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-700 block mb-1">Kas Masuk Platform</span>
                <p className="text-lg font-black text-emerald-950">
                  Rp {financeSummary.totalPlatformRevenue.toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Bagi Hasil & Fee AZ GO</span>
              </div>

              <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Hak Bersih Mitra</span>
                <p className="text-lg font-black text-amber-700">
                  Rp {financeSummary.totalPartnerDisbursed.toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Diserahkan ke Mitra</span>
              </div>

              <div className="p-4 bg-amber-50 rounded-3xl border border-amber-200 shadow-sm">
                <span className="text-[11px] font-bold text-amber-800 block mb-1">Komisi Driver</span>
                <p className="text-lg font-black text-amber-900">
                  {financeSummary.commissionConfig.driverCommissionPercent}%
                </p>
                <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">Potongan Ongkir</span>
              </div>

              <div className="p-4 bg-indigo-50 rounded-3xl border border-indigo-200 shadow-sm">
                <span className="text-[11px] font-bold text-indigo-700 block mb-1">Komisi Toko/Resto</span>
                <p className="text-lg font-black text-indigo-900">
                  {financeSummary.commissionConfig.merchantCommissionPercent}%
                </p>
                <span className="text-[10px] text-indigo-700 font-semibold block mt-0.5">Potongan Resto & Mart</span>
              </div>

              <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Withdrawal Pending</span>
                <p className="text-lg font-black text-rose-600">
                  Rp {financeSummary.totalPendingWithdrawals.toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
                  {withdrawalRequests.filter(w => w.status === 'PENDING').length} Permintaan
                </span>
              </div>
            </div>
          )}

          {financeSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{financeSuccess}</span>
            </div>
          )}

          {/* Form Pengaturan Skema Bagi Hasil / Potongan Komisi */}
          {commissionConfig && (
            <form onSubmit={handleSaveCommissionConfig} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-amber-500" />
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Pengaturan Skema Bagi Hasil & Potongan Komisi Platform
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atur persentase potongan jasa atau fee tetap yang masuk ke kas admin AZ GO untuk setiap transaksi.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Save className="w-4 h-4" /> Simpan Skema Bagi Hasil
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
                  <span className="font-bold text-slate-800 block text-sm">🛵 Komisi Mitra Driver</span>
                  <label className="block text-slate-600 text-[11px]">
                    Persentase potongan kas admin dari ongkos kirim:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      step={1}
                      value={commissionConfig.driverCommissionPercent}
                      onChange={e => setCommissionConfig({ ...commissionConfig, driverCommissionPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-sm bg-white"
                    />
                    <span className="absolute right-3 top-2 font-bold text-slate-400">%</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Contoh: Ongkir Rp 10.000 → Platform dapat Rp {(10000 * (commissionConfig.driverCommissionPercent / 100)).toLocaleString('id-ID')}, Driver terima Rp {(10000 * (1 - commissionConfig.driverCommissionPercent / 100)).toLocaleString('id-ID')}.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                  <span className="font-bold text-slate-800 block text-sm">🍗 Komisi Mitra Toko/Resto</span>
                  <label className="block text-slate-600 text-[11px]">
                    Persentase potongan kas admin dari pesanan makanan/mart:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      step={1}
                      value={commissionConfig.merchantCommissionPercent}
                      onChange={e => setCommissionConfig({ ...commissionConfig, merchantCommissionPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-sm bg-white"
                    />
                    <span className="absolute right-3 top-2 font-bold text-slate-400">%</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Contoh: Order Rp 100.000 → Platform dapat Rp {(100000 * (commissionConfig.merchantCommissionPercent / 100)).toLocaleString('id-ID')}, Toko terima Rp {(100000 * (1 - commissionConfig.merchantCommissionPercent / 100)).toLocaleString('id-ID')}.
                  </p>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-2">
                  <span className="font-bold text-slate-800 block text-sm">🚛 Komisi Layanan Kargo</span>
                  <label className="block text-slate-600 text-[11px]">
                    Persentase potongan kas admin dari sewa armada kargo:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      step={1}
                      value={commissionConfig.cargoCommissionPercent}
                      onChange={e => setCommissionConfig({ ...commissionConfig, cargoCommissionPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-sm bg-white"
                    />
                    <span className="absolute right-3 top-2 font-bold text-slate-400">%</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Dikenakan pada layanan Az Cargo (Pickup Bak, Box, & Truk Engkel).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <label className="font-bold text-slate-700 block">Biaya Penanganan Platform Tetap (Fixed Fee per Order):</label>
                  <p className="text-[10px] text-slate-500">Biaya pemeliharaan server/aplikasi yang ditagihkan ke setiap order.</p>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      value={commissionConfig.platformFixedFee}
                      onChange={e => setCommissionConfig({ ...commissionConfig, platformFixedFee: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                    />
                    <span className="absolute right-3 top-2 font-bold text-slate-400">IDR</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <label className="font-bold text-slate-700 block">Batas Minimal Penarikan Dana Mitra (Minimum Withdrawal):</label>
                  <p className="text-[10px] text-slate-500">Saldo minimal di dompet mitra agar dapat mengajukan penarikan ke rekening bank.</p>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      value={commissionConfig.minimumWithdrawalAmount}
                      onChange={e => setCommissionConfig({ ...commissionConfig, minimumWithdrawalAmount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                    />
                    <span className="absolute right-3 top-2 font-bold text-slate-400">IDR</span>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Permintaan Penarikan Dana Mitra (Withdrawal Requests) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Permintaan Penarikan Dana Mitra (Withdrawal Requests)
                </h3>
                <p className="text-xs text-slate-500">
                  Verifikasi dan transfer saldo pendapatan mitra ke rekening bank terdaftar mereka.
                </p>
              </div>

              <select
                value={withdrawalStatusFilter}
                onChange={e => setWithdrawalStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
              >
                <option value="ALL">Semua Status Penarikan</option>
                <option value="PENDING">Menunggu Transfer (Pending)</option>
                <option value="APPROVED">Berhasil Ditransfer (Approved)</option>
                <option value="REJECTED">Ditolak (Rejected)</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">ID Penarikan</th>
                    <th className="py-3 px-4">Mitra</th>
                    <th className="py-3 px-4">Nominal Penarikan</th>
                    <th className="py-3 px-4">Rekening Tujuan</th>
                    <th className="py-3 px-4">Tanggal Pengajuan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {withdrawalRequests
                    .filter(w => withdrawalStatusFilter === 'ALL' || w.status === withdrawalStatusFilter)
                    .map(w => (
                      <tr key={w.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{w.id}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{w.partnerName}</span>
                          <span className="text-[10px] text-slate-500">{w.partnerType === 'DRIVER' ? 'Mitra Driver' : 'Mitra Toko'}</span>
                        </td>
                        <td className="py-3 px-4 font-black text-slate-900 text-sm">
                          Rp {w.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 block">{w.bankName} - {w.accountNumber}</span>
                          <span className="text-[10px] text-slate-500">a/n {w.accountHolder}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {new Date(w.requestedAt).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          {w.status === 'PENDING' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              Menunggu Transfer
                            </span>
                          )}
                          {w.status === 'APPROVED' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Berhasil Ditransfer
                            </span>
                          )}
                          {w.status === 'REJECTED' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                              Ditolak (Refund)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {w.status === 'PENDING' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedWithdrawal(w);
                                  setWithdrawalActionType('APPROVE');
                                  setTransferRefCode(`TRF-${Date.now().toString().slice(-6)}`);
                                  setWithdrawalReviewNotes('');
                                  setShowWithdrawalModal(true);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] shadow-sm transition"
                              >
                                Setujui Transfer
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedWithdrawal(w);
                                  setWithdrawalActionType('REJECT');
                                  setWithdrawalReviewNotes('');
                                  setShowWithdrawalModal(true);
                                }}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-[11px] border border-rose-200 transition"
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {w.rejectionReason || (w.processedAt ? `Selesai ${new Date(w.processedAt).toLocaleDateString('id-ID')}` : '-')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 9: PENGATURAN & KONTROL LAYANAN AZ GO ================= */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">Kontrol Layanan AZ GO (Live Toggle)</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {services.filter(s => s.isActive !== false).length} dari {services.length || 7} Layanan Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Aktifkan atau nonaktifkan layanan yang tampil pada halaman pelanggan secara instan. Layanan nonaktif akan disembunyikan atau ditutup sementara.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(srv => {
              const isActive = srv.isActive !== false;
              return (
                <div 
                  key={srv.id} 
                  className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                    isActive 
                      ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300' 
                      : 'bg-slate-50 border-rose-200 shadow-none opacity-85'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-400 font-mono">{srv.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isActive ? '● AKTIF DI PELANGGAN' : '● NONAKTIF'}
                      </span>
                    </div>

                    <h4 className="font-black text-slate-900 text-base">{srv.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{srv.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {isActive ? 'Dapat dipesan pelanggan' : 'Disembunyikan'}
                    </span>
                    <button
                      onClick={() => handleToggleService(srv.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm ${
                        isActive 
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' 
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Ban className="w-3.5 h-3.5" /> Nonaktifkan
                        </>
                      ) : (
                        <>
                          <Power className="w-3.5 h-3.5" /> Aktifkan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH MITRA PENGEMUDI ================= */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-base">Tambah Mitra Pengemudi Baru</h3>
              <button onClick={() => setShowDriverModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Driver</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Joko Widodo"
                  value={newDriverName}
                  onChange={e => setNewDriverName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081288889999"
                  value={newDriverPhone}
                  onChange={e => setNewDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Armada Layanan</label>
                <select
                  value={newDriverRole}
                  onChange={e => setNewDriverRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
                >
                  <option value="MOTORBIKE">🛵 Motor (Az Delivery & Antar Jemput)</option>
                  <option value="COURIER_PICKUP">📦 Kurir Motor (Az Courier & Pickup)</option>
                  <option value="CARGO_PICKUP">🛻 Pickup Bak/Box (Az Cargo)</option>
                  <option value="CARGO_TRUCK">🚛 Truk Engkel CDE (Az Cargo)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan Kendaraan & Plat Nomor</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Honda Beat (B 1234 GHO)"
                  value={newDriverVehicle}
                  onChange={e => setNewDriverVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDriverModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Mitra Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH MITRA RESTO / MART ================= */}
      {showMerchantModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-base">Tambah Mitra Restoran / Toko Baru</h3>
              <button onClick={() => setShowMerchantModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMerchant} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Mitra</label>
                  <select
                    value={newMerchantType}
                    onChange={e => setNewMerchantType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                  >
                    <option value="FOOD">🛵 Resto (Az Delivery)</option>
                    <option value="MART">🛒 Toko/Mart (Az Mart)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Usaha</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Aneka Jus & Buah"
                    value={newMerchantCategory}
                    onChange={e => setNewMerchantCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Toko / Resto</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dapur Nusantara Enak"
                  value={newMerchantName}
                  onChange={e => setNewMerchantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap Toko</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jl. Pahlawan No. 45"
                  value={newMerchantAddress}
                  onChange={e => setNewMerchantAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block">Menu / Produk Unggulan Pertama:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nama produk (Nasi Goreng Spesial)"
                    value={newInitialItem}
                    onChange={e => setNewInitialItem(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                  <input
                    type="number"
                    placeholder="Harga (Rp)"
                    value={newInitialPrice}
                    onChange={e => setNewInitialPrice(parseInt(e.target.value) || 0)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMerchantModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Toko / Resto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH HUB / DROP POINT ================= */}
      {showHubModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-base">Tambah Cabang Drop Point / Hub Baru</h3>
              <button onClick={() => setShowHubModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHub} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Cabang Hub</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: HUB-SMG-01"
                    value={newHubCode}
                    onChange={e => setNewHubCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Fasilitas</label>
                  <select
                    value={newHubType}
                    onChange={e => setNewHubType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                  >
                    <option value="DROP_POINT">Drop Point (Agen)</option>
                    <option value="SORTING_CENTER">Sorting Center (Gateway)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Cabang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Semarang Simpang Lima Agen"
                  value={newHubName}
                  onChange={e => setNewHubName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kota</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Semarang"
                  value={newHubCity}
                  onChange={e => setNewHubCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap Cabang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jl. Pandanaran No. 12"
                  value={newHubAddress}
                  onChange={e => setNewHubAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowHubModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Cabang Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH USER BARU (ADMIN ONLY) ================= */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Tambah Akun Pengguna Baru</h3>
                <p className="text-[11px] text-slate-500">Daftarkan akun driver, toko, hub, atau sesama admin</p>
              </div>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Yani"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Pengguna (Login)</label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: ahmad@azgo.com"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor Handphone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 08123456789"
                  value={newUserPhone}
                  onChange={e => setNewUserPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role / Hak Akses Akun</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                >
                  <option value="DRIVER">🛵 Mitra Driver (Portal Driver)</option>
                  <option value="MERCHANT">🍗 Mitra Toko / Resto (Portal Toko)</option>
                  <option value="HUB_STAFF">🏢 Staff Hub / Gudang (Scan Gateway)</option>
                  <option value="ADMIN">🛡️ Super Administrator (Backoffice)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Sandi Awal</label>
                <input
                  type="text"
                  required
                  placeholder="Default: azgo123"
                  value={newUserPassword}
                  onChange={e => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition"
                >
                  Buat Akun User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL RESET PASSWORD (ADMIN ONLY) ================= */}
      {showResetModal && targetResetUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Reset Password Pengguna</h3>
                <p className="text-[11px] text-slate-500">Atur ulang password user tanpa perlu password lama</p>
              </div>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
              <span className="text-slate-500 block">Akun Target:</span>
              <p className="font-extrabold text-slate-900 text-sm">{targetResetUser.fullName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-slate-500 font-mono">{targetResetUser.email}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {targetResetUser.role}
                </span>
              </div>
            </div>

            <form onSubmit={handleAdminResetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Password Baru yang Diaturkan</label>
                <input
                  type="text"
                  required
                  placeholder="Password baru"
                  value={adminNewPassword}
                  onChange={e => setAdminNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Konfirmasi Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DETAIL & TINJAU BERKAS PENDAFTARAN MITRA ================= */}
      {showAppDetailModal && selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 my-8">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 font-mono block">ID: {selectedApp.id}</span>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2 mt-0.5">
                  Tinjau Berkas: {selectedApp.fullName}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    selectedApp.type === 'DRIVER' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {selectedApp.type === 'DRIVER' ? '🛵 Mitra Driver' : '🏪 Mitra Toko/Resto'}
                  </span>
                </h3>
              </div>
              <button 
                onClick={() => setShowAppDetailModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profil Pemohon */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block font-medium">Nomor WhatsApp:</span>
                <span className="font-bold text-slate-900">{selectedApp.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email:</span>
                <span className="font-mono font-bold text-slate-900">{selectedApp.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Kota & Domisili:</span>
                <span className="font-bold text-slate-900">{selectedApp.city}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Alamat Lengkap:</span>
                <span className="text-slate-700">{selectedApp.address}</span>
              </div>

              {selectedApp.type === 'DRIVER' && (
                <>
                  <div>
                    <span className="text-slate-400 block font-medium">Kategori & Kendaraan:</span>
                    <span className="font-bold text-slate-900">{selectedApp.vehicleCategory} — {selectedApp.vehicleModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Nomor Plat & Lisensi:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedApp.vehiclePlate} (SIM: {selectedApp.simNumber || '-'})
                    </span>
                  </div>
                </>
              )}

              {selectedApp.type === 'MERCHANT' && (
                <>
                  <div>
                    <span className="text-slate-400 block font-medium">Nama & Jenis Toko:</span>
                    <span className="font-bold text-slate-900">
                      {selectedApp.storeName} ({selectedApp.merchantType === 'FOOD' ? 'Resto Kuliner' : 'Minimarket/Mart'})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Kategori Usaha:</span>
                    <span className="font-bold text-slate-900">{selectedApp.storeCategory}</span>
                  </div>
                </>
              )}
            </div>

            {/* Lampiran Dokumen & Foto */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Lampiran Berkas & Identitas
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {selectedApp.documents?.ktpUrl && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <img 
                      src={selectedApp.documents.ktpUrl} 
                      alt="Foto KTP" 
                      className="w-full h-24 object-cover rounded-xl border border-slate-200"
                    />
                    <span className="font-bold text-slate-700 block text-[11px]">Foto KTP</span>
                    <a 
                      href={selectedApp.documents.ktpUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[10px] text-blue-600 hover:underline inline-block font-semibold"
                    >
                      Buka Resolusi Asli ↗
                    </a>
                  </div>
                )}

                {selectedApp.type === 'DRIVER' && selectedApp.documents?.simUrl && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <img 
                      src={selectedApp.documents.simUrl} 
                      alt="Foto SIM" 
                      className="w-full h-24 object-cover rounded-xl border border-slate-200"
                    />
                    <span className="font-bold text-slate-700 block text-[11px]">Foto SIM</span>
                    <a 
                      href={selectedApp.documents.simUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[10px] text-blue-600 hover:underline inline-block font-semibold"
                    >
                      Buka Resolusi Asli ↗
                    </a>
                  </div>
                )}

                {selectedApp.type === 'DRIVER' && selectedApp.documents?.stnkUrl && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <img 
                      src={selectedApp.documents.stnkUrl} 
                      alt="Foto STNK" 
                      className="w-full h-24 object-cover rounded-xl border border-slate-200"
                    />
                    <span className="font-bold text-slate-700 block text-[11px]">Foto STNK</span>
                    <a 
                      href={selectedApp.documents.stnkUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[10px] text-blue-600 hover:underline inline-block font-semibold"
                    >
                      Buka Resolusi Asli ↗
                    </a>
                  </div>
                )}

                {selectedApp.type === 'DRIVER' && selectedApp.documents?.vehiclePhotoUrl && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <img 
                      src={selectedApp.documents.vehiclePhotoUrl} 
                      alt="Foto Kendaraan" 
                      className="w-full h-24 object-cover rounded-xl border border-slate-200"
                    />
                    <span className="font-bold text-slate-700 block text-[11px]">Foto Kendaraan</span>
                    <a 
                      href={selectedApp.documents.vehiclePhotoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[10px] text-blue-600 hover:underline inline-block font-semibold"
                    >
                      Buka Resolusi Asli ↗
                    </a>
                  </div>
                )}

                {selectedApp.type === 'MERCHANT' && selectedApp.documents?.storePhotoUrl && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2 col-span-2">
                    <img 
                      src={selectedApp.documents.storePhotoUrl} 
                      alt="Foto Toko" 
                      className="w-full h-24 object-cover rounded-xl border border-slate-200"
                    />
                    <span className="font-bold text-slate-700 block text-[11px]">Foto Tampak Depan Toko / Resto</span>
                    <a 
                      href={selectedApp.documents.storePhotoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[10px] text-blue-600 hover:underline inline-block font-semibold"
                    >
                      Buka Resolusi Asli ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Review Actions */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs text-slate-500">
                Status saat ini:{' '}
                <span className="font-black text-slate-900">{selectedApp.status}</span>
                {selectedApp.rejectionReason && (
                  <span className="text-rose-600 ml-1">({selectedApp.rejectionReason})</span>
                )}
              </div>

              {selectedApp.status === 'PENDING_REVIEW' ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setRejectNotes('');
                      setShowRejectModal(true);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition"
                  >
                    Tolak Pengajuan
                  </button>
                  <button
                    onClick={() => handleApproveApplication(selectedApp.id)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Setujui & Buat Akun Mitra
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAppDetailModal(false)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TOLAK PENDAFTARAN MITRA ================= */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-base">Tolak Pengajuan Kemitraan</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Tuliskan alasan penolakan berkas untuk pemohon <strong>{selectedApp.fullName}</strong>.
            </p>

            <form onSubmit={handleRejectApplication} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Pilih Alasan Cepat:</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Foto KTP buram / tidak terbaca',
                    'Masa berlaku SIM sudah kadaluarsa',
                    'Plat nomor kendaraan tidak sesuai STNK',
                    'Foto toko tidak mencerminkan tempat usaha',
                    'Wilayah belum terjangkau layanan AZ GO'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectNotes(preset)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Penolakan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ketik rincian alasan penolakan..."
                  value={rejectNotes}
                  onChange={e => setRejectNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Konfirmasi Penolakan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL NOTIFIKASI AKUN MITRA OTOMATIS DIBUAT ================= */}
      {createdAccountPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Pendaftaran Disetujui!
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg mt-1">
                Akun Mitra Otomatis Berhasil Dibuat
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kredensial login berikut telah dibuat dan dapat diberikan kepada mitra untuk masuk ke aplikasi.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Nama Mitra:</span>
                <span className="font-bold text-slate-900">{createdAccountPopup.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role Akses:</span>
                <span className="font-black text-rose-600">{createdAccountPopup.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email Login:</span>
                <span className="font-mono font-bold text-slate-900">{createdAccountPopup.email}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-400">Password Awal:</span>
                <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {createdAccountPopup.temporaryPassword}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Mitra dapat mengubah password awal mereka sewaktu-waktu di portal masing-masing.
            </p>

            <button
              onClick={() => setCreatedAccountPopup(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition"
            >
              Mengerti & Selesai
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL TINJAU PENARIKAN DANA (WITHDRAWAL) ================= */}
      {showWithdrawalModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {withdrawalActionType === 'APPROVE' ? 'Setujui Transfer Penarikan' : 'Tolak Penarikan Saldo'}
                </h3>
                <p className="text-[11px] text-slate-500">ID: {selectedWithdrawal.id}</p>
              </div>
              <button onClick={() => setShowWithdrawalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Mitra:</span>
                <span className="font-bold text-slate-900">{selectedWithdrawal.partnerName} ({selectedWithdrawal.partnerType === 'DRIVER' ? 'Mitra Driver' : 'Mitra Toko'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nominal Penarikan:</span>
                <span className="font-black text-slate-900 text-sm">
                  Rp {selectedWithdrawal.amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rekening Tujuan:</span>
                <span className="font-bold text-slate-800">
                  {selectedWithdrawal.bankName} - {selectedWithdrawal.accountNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Atas Nama:</span>
                <span className="font-bold text-slate-800">{selectedWithdrawal.accountHolder}</span>
              </div>
            </div>

            <form onSubmit={handleReviewWithdrawal} className="space-y-3 text-xs">
              {withdrawalActionType === 'APPROVE' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Referensi Transfer Bank (Mutasi)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TRF-BCA-9801824"
                    value={transferRefCode}
                    onChange={e => setTransferRefCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Pastikan dana telah berhasil ditransfer via m-Banking/Corporate Banking sebelum menekan tombol setujui.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alasan Penolakan Penarikan Dana
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Contoh: Nomor rekening tidak cocok dengan nama akun mitra."
                    value={withdrawalReviewNotes}
                    onChange={e => setWithdrawalReviewNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                  <p className="text-[10px] text-rose-600 mt-1">
                    Saldo sebesar Rp {selectedWithdrawal.amount.toLocaleString('id-ID')} akan otomatis dikembalikan ke dompet mitra.
                  </p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 text-white font-bold rounded-xl shadow-md transition ${
                    withdrawalActionType === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {withdrawalActionType === 'APPROVE' ? 'Konfirmasi Transfer Selesai' : 'Konfirmasi Tolak Penarikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
