import React, { useState, useEffect } from 'react';
import { User, WalletTransaction } from '@delivery/shared';
import { api } from '../../services/apiClient';
import { GoogleMapsDriverNav } from '../../components/GoogleMapsDriverNav';
import { 
  Bike, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Power, 
  Wallet, 
  Navigation, 
  Phone,
  ArrowLeft,
  KeyRound,
  LogOut,
  Percent,
  AlertCircle,
  X,
  CreditCard,
  AlertTriangle,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';

interface DriverPortalProps {
  onBack: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
  onChangePassword?: () => void;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({ 
  onBack,
  currentUser,
  onLogout,
  onChangePassword
}) => {
  const isDriverActive = currentUser?.isActive !== false;
  const registeredBank = currentUser?.bankName || 'BCA';
  const registeredAccount = currentUser?.accountNumber || '1234567890';
  const registeredHolder = currentUser?.accountHolder || currentUser?.fullName || 'Rudi Hartono';

  const [activePortalTab, setActivePortalTab] = useState<'orders' | 'wallet'>('orders');
  const [isOnline, setIsOnline] = useState(isDriverActive);
  const [driverProfile, setDriverProfile] = useState({
    id: currentUser?.id || 'drv-1',
    name: currentUser?.fullName || 'Rudi Hartono',
    phone: currentUser?.phone || '081233445566',
    vehicle: 'Honda Vario 160 (B 1234 XYZ)',
    role: '🛵 Mitra Driver Motor',
    rating: 4.9,
    todayEarnings: 215000,
    completedTrips: 8
  });

  // Wallet & Finance State
  const [walletBalance, setWalletBalance] = useState(385000);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [commissionPercent, setCommissionPercent] = useState(15);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(100000);
  const [withdrawBank, setWithdrawBank] = useState(currentUser?.bankName || 'BCA');
  const [withdrawAccount, setWithdrawAccount] = useState(currentUser?.accountNumber || '1234567890');
  const [withdrawHolder, setWithdrawHolder] = useState(currentUser?.accountHolder || currentUser?.fullName || 'Rudi Hartono');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [waNotificationAlert, setWaNotificationAlert] = useState<{
    phone: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    isMismatched: boolean;
    time: string;
  } | null>(null);

  const isBankMismatched = withdrawBank !== registeredBank || withdrawAccount !== registeredAccount || withdrawHolder !== registeredHolder;

  // Load wallet from API
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.getPartnerWallet(driverProfile.id, 'DRIVER');
        if (res.success && res.data) {
          setWalletBalance(res.data.balance);
          setWalletTransactions(res.data.transactions);
        }
        const cfgRes = await api.getCommissionConfig();
        if (cfgRes.success && cfgRes.data) {
          setCommissionPercent(cfgRes.data.driverCommissionPercent || 15);
        }
      } catch (err) {
        console.error('Failed to load wallet data', err);
      }
    };
    fetchWallet();
  }, [driverProfile.id]);

  // State Pesanan Masuk (Dispatch Simulation)
  const [incomingOrder, setIncomingOrder] = useState<any>({
    id: 'ord-live-01',
    orderNumber: 'AZD-901824',
    serviceName: '🛵 Az Delivery (Makanan)',
    pickupAddress: 'Ayam Geprek Sambal Bawang Juara, Jl. Merdeka',
    dropoffAddress: 'Jl. Melati Indah No. 14, Blok C',
    distanceKm: 3.2,
    grossFare: 17000,
    commissionCut: 2550, // 15%
    fareIncome: 14450, // Net 85%
    customerName: 'Siti Rahma',
    customerPhone: '081299887766'
  });

  // State Pesanan Aktif yang Sedang Dijalankan
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [tripStep, setTripStep] = useState<'PICKING_UP' | 'ARRIVED_PICKUP' | 'IN_TRANSIT' | 'COMPLETED'>('PICKING_UP');

  // Terima Order Masuk
  const handleAcceptOrder = () => {
    setActiveOrder(incomingOrder);
    setIncomingOrder(null);
    setTripStep('PICKING_UP');
  };

  // Tolak Order Masuk
  const handleRejectOrder = () => {
    setIncomingOrder(null);
  };

  // Next Trip Step
  const handleNextStep = () => {
    if (tripStep === 'PICKING_UP') {
      setTripStep('ARRIVED_PICKUP');
    } else if (tripStep === 'ARRIVED_PICKUP') {
      setTripStep('IN_TRANSIT');
    } else if (tripStep === 'IN_TRANSIT') {
      setTripStep('COMPLETED');
      // Tambah saldo driver dan mutasi dompet
      const netIncome = activeOrder.fareIncome;
      setDriverProfile(prev => ({
        ...prev,
        todayEarnings: prev.todayEarnings + netIncome,
        completedTrips: prev.completedTrips + 1
      }));
      setWalletBalance(prev => prev + netIncome);
      const newTrx: WalletTransaction = {
        id: `trx-${Date.now()}`,
        partnerId: driverProfile.id,
        partnerType: 'DRIVER',
        partnerName: driverProfile.name,
        type: 'ORDER_INCOME',
        amount: netIncome,
        balanceAfter: walletBalance + netIncome,
        description: `Pendapatan Bersih Order ${activeOrder.orderNumber} (Gross Rp ${activeOrder.grossFare?.toLocaleString('id-ID') || netIncome} - Potongan Komisi AZ GO ${commissionPercent}%)`,
        orderNumber: activeOrder.orderNumber,
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      };
      setWalletTransactions(prev => [newTrx, ...prev]);
    }
  };

  // Ajukan Penarikan Dana
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) return;
    if (withdrawAmount > walletBalance) {
      setWithdrawError('Nominal penarikan melebihi saldo dompet Anda saat ini.');
      return;
    }
    if (withdrawAmount < 50000) {
      setWithdrawError('Minimal penarikan saldo adalah Rp 50.000.');
      return;
    }

    setWithdrawLoading(true);
    setWithdrawError('');
    try {
      const res = await api.requestWithdrawal({
        partnerId: driverProfile.id,
        partnerName: driverProfile.name,
        partnerType: 'DRIVER',
        amount: withdrawAmount,
        bankName: withdrawBank,
        accountNumber: withdrawAccount,
        accountHolder: withdrawHolder
      });

      if (res.success) {
        setWalletBalance(prev => prev - withdrawAmount);
        setShowWithdrawModal(false);
        setWithdrawSuccess(`✅ Permintaan penarikan Rp ${withdrawAmount.toLocaleString('id-ID')} ke ${withdrawBank} (${withdrawAccount}) berhasil diajukan dan sedang diproses tim admin!`);
        setTimeout(() => setWithdrawSuccess(''), 7000);
        // Trigger Notifikasi WhatsApp Konfirmasi Keamanan
        setWaNotificationAlert({
          phone: driverProfile.phone,
          amount: withdrawAmount,
          bankName: withdrawBank,
          accountNumber: withdrawAccount,
          accountHolder: withdrawHolder,
          isMismatched: isBankMismatched,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });
        // Refresh wallet transactions
        const wRes = await api.getPartnerWallet(driverProfile.id, 'DRIVER');
        if (wRes.success && wRes.data) {
          setWalletTransactions(wRes.data.transactions);
        }
      } else {
        setWithdrawError(res.message || 'Gagal mengajukan penarikan');
      }
    } catch (err: any) {
      setWithdrawError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Tampilan Pengguna
        </button>

        <div className="flex items-center gap-2 flex-wrap">
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
          <span className="text-xs font-bold bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Bike className="w-3.5 h-3.5" /> Portal Khusus Mitra Driver
          </span>
        </div>
      </div>

      {!isDriverActive && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-3xl text-rose-900 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-extrabold text-sm text-rose-950">Akun Mitra Driver Sedang Dinonaktifkan</h4>
            <p className="text-rose-700 leading-relaxed">
              Akun Anda saat ini dinonaktifkan oleh administrator. Anda tidak dapat menerima orderan baru atau mengaktifkan status online. Silakan hubungi admin AZ GO untuk informasi reaktivasi akun.
            </p>
          </div>
        </div>
      )}

      {/* Profil & Kesiapan Driver */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-2xl shadow-inner">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">{driverProfile.name}</h3>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  ★ {driverProfile.rating}
                </span>
              </div>
              <p className="text-xs text-slate-500">{driverProfile.vehicle}</p>
              <span className="text-[11px] font-bold text-slate-700">{driverProfile.role}</span>
            </div>
          </div>

          {/* Toggle Online / Offline */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition shadow-sm ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            {isOnline ? '🟢 Status: Siap Terima Order (Online)' : '⚪ Status: Istirahat (Offline)'}
          </button>
        </div>

        {/* Dompet & Performa Harian */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Saldo Dompet Saya</span>
                <p className="text-lg font-black text-slate-900">
                  Rp {walletBalance.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActivePortalTab('wallet');
                setShowWithdrawModal(true);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Tarik Saldo
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Trip Selesai Hari Ini</span>
              <p className="text-lg font-black text-slate-900">{driverProfile.completedTrips} Order</p>
            </div>
          </div>
        </div>
      </div>

      {withdrawSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{withdrawSuccess}</span>
        </div>
      )}

      {/* Driver Sub-tabs */}
      <div className="flex border-b border-slate-200 gap-2 pb-1">
        <button
          onClick={() => setActivePortalTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activePortalTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Bike className="w-4 h-4" /> Operasional & Order Aktif
        </button>

        <button
          onClick={() => setActivePortalTab('wallet')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activePortalTab === 'wallet' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Wallet className="w-4 h-4 text-emerald-400" /> Dompet & Bagi Hasil
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
            Rp {walletBalance.toLocaleString('id-ID')}
          </span>
        </button>
      </div>

      {/* ================= TAB 1: OPERASIONAL ORDER ================= */}
      {activePortalTab === 'orders' && (
        <>
          {/* JIKA ADA PESANAN MASUK (OFFER / DISPATCH POPUP) */}
          {isOnline && incomingOrder && !activeOrder && (
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4 border-2 border-amber-300/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  🔔 Pesanan Masuk di Sekitar Anda!
                </span>
                <span className="text-xs font-bold text-white/95 bg-black/20 px-2.5 py-1 rounded-full">
                  Waktu Terima: 25 detik
                </span>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 text-slate-900 space-y-3 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-amber-700">{incomingOrder.serviceName}</span>
                    <h4 className="font-extrabold text-base">{incomingOrder.orderNumber}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Pendapatan Bersih (85%)</span>
                    <span className="text-xl font-black text-emerald-600">
                      +Rp {incomingOrder.fareIncome.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Gross: Rp {incomingOrder.grossFare?.toLocaleString('id-ID')} (Potongan 15%: -Rp {incomingOrder.commissionCut?.toLocaleString('id-ID')})
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100 text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <strong>Ambil:</strong> {incomingOrder.pickupAddress}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <strong>Antar:</strong> {incomingOrder.dropoffAddress}
                  </p>
                </div>

                {/* ANIMASI GOOGLE MAPS REAL */}
                <div className="pt-2">
                  <div className="flex items-center justify-between pb-1.5 px-0.5">
                    <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
                      🗺️ Peta Navigasi Google Maps (Real-time):
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Jarak: {incomingOrder.distanceKm || 3.2} KM
                    </span>
                  </div>
                  <GoogleMapsDriverNav
                    pickupAddress={incomingOrder.pickupAddress}
                    dropoffAddress={incomingOrder.dropoffAddress}
                    distanceKm={incomingOrder.distanceKm || 3.2}
                    serviceName={incomingOrder.serviceName}
                    orderNumber={incomingOrder.orderNumber}
                    heightClass="h-64 sm:h-72"
                    tripPhase="OFFER"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleRejectOrder}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                  >
                    Lewati (Tolak)
                  </button>
                  <button
                    onClick={handleAcceptOrder}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition"
                  >
                    Terima Order Sekarang!
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WORKFLOW PESANAN AKTIF (SEDANG DIKERJAKAN DRIVER) */}
          {activeOrder && (
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-md space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    {activeOrder.serviceName}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-1">{activeOrder.orderNumber}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Pendapatan Bersih Anda</span>
                  <span className="text-xl font-black text-emerald-600">
                    Rp {activeOrder.fareIncome.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Bagi Hasil: 85% Mitra | 15% Platform
                  </span>
                </div>
              </div>

              {/* Stepper Status Pengantaran */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-2 rounded-xl font-bold ${
                  tripStep === 'PICKING_UP' ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400' : 'bg-slate-50 text-slate-400'
                }`}>
                  1. Menuju Lokasi
                </div>
                <div className={`p-2 rounded-xl font-bold ${
                  tripStep === 'ARRIVED_PICKUP' ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400' : 'bg-slate-50 text-slate-400'
                }`}>
                  2. Ambil Barang / Makanan
                </div>
                <div className={`p-2 rounded-xl font-bold ${
                  tripStep === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400' : 'bg-slate-50 text-slate-400'
                }`}>
                  3. Antar ke Tujuan
                </div>
              </div>

              {/* Rute & Pelanggan */}
              <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 border border-slate-200">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Pelanggan:</span>
                    <span className="font-bold text-slate-900">{activeOrder.customerName}</span>
                  </div>
                  <a
                    href={`tel:${activeOrder.customerPhone}`}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Hubungi
                  </a>
                </div>

                <p>📍 <strong>Titik Ambil:</strong> {activeOrder.pickupAddress}</p>
                <p>🏁 <strong>Titik Antar:</strong> {activeOrder.dropoffAddress}</p>
              </div>

              {/* LIVE GOOGLE MAPS NAVIGATION DRIVER */}
              {tripStep !== 'COMPLETED' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      Panduan Navigasi Google Maps (Live GPS Pengemudi)
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      GPS Aktif
                    </span>
                  </div>
                  <GoogleMapsDriverNav
                    pickupAddress={activeOrder.pickupAddress}
                    dropoffAddress={activeOrder.dropoffAddress}
                    distanceKm={activeOrder.distanceKm || 3.2}
                    serviceName={activeOrder.serviceName}
                    orderNumber={activeOrder.orderNumber}
                    heightClass="h-72 sm:h-80"
                    tripPhase={tripStep}
                  />
                </div>
              )}

              {/* Tombol Perubahan Status Perjalanan */}
              {tripStep !== 'COMPLETED' ? (
                <button
                  onClick={handleNextStep}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  {tripStep === 'PICKING_UP' && 'Konfirmasi: Saya Sudah Tiba di Lokasi Jemput'}
                  {tripStep === 'ARRIVED_PICKUP' && 'Konfirmasi: Makanan / Barang Sudah Dibawa, Menuju Tujuan'}
                  {tripStep === 'IN_TRANSIT' && 'Konfirmasi: Sudah Sampai di Tujuan & Selesaikan Order'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-lg">Order Telah Selesai!</h4>
                  <p className="text-xs text-emerald-700">
                    Pendapatan bersih <strong>Rp {activeOrder.fareIncome.toLocaleString('id-ID')}</strong> telah masuk ke dompet Anda setelah potongan komisi {commissionPercent}%.
                  </p>
                  <button
                    onClick={() => {
                      setActiveOrder(null);
                      setIncomingOrder({
                        id: 'ord-live-02',
                        orderNumber: 'AZC-20260927-4401',
                        serviceName: '📦 Az Courier (Paket Reguler)',
                        pickupAddress: 'Bandung Central Drop Point',
                        dropoffAddress: 'Jl. Dago Atas No. 88',
                        distanceKm: 5.1,
                        grossFare: 21000,
                        commissionCut: 3150,
                        fareIncome: 17850,
                        customerName: 'Ahmad Dahlan',
                        customerPhone: '081244556677'
                      });
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                  >
                    Cari Order Berikutnya
                  </button>
                </div>
              )}
            </div>
          )}

          {/* JIKA TIDAK ADA PESANAN AKTIF */}
          {isOnline && !incomingOrder && !activeOrder && (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
              <Navigation className="w-12 h-12 text-amber-500 mx-auto animate-spin" />
              <h4 className="font-bold text-slate-900 text-base">Sedang Menunggu Pesanan Baru...</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tetap online di aplikasi. Sistem otomatis mengalokasikan pesanan Az Delivery, Az Courier, atau Az Pickup terdekat.
              </p>
              <button
                onClick={() => setIncomingOrder({
                  id: 'ord-sim-03',
                  orderNumber: 'AZK-990212',
                  serviceName: '🚛 Az Cargo (Pickup Muatan)',
                  pickupAddress: 'Toko Material Sentosa, Daan Mogot',
                  dropoffAddress: 'Cluster Alam Sutera, Tangerang',
                  distanceKm: 8.5,
                  grossFare: 100000,
                  commissionCut: 15000,
                  fareIncome: 85000,
                  customerName: 'Pak Handoko',
                  customerPhone: '081277889900'
                })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition mt-2"
              >
                Simulasikan Pesanan Masuk
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= TAB 2: DOMPET & KELOLA KEUANGAN ================= */}
      {activePortalTab === 'wallet' && (
        <div className="space-y-6">
          {/* Card Saldo & Aksi Tarik */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Saldo Tersedia di Dompet
              </span>
              <p className="text-3xl sm:text-4xl font-black text-amber-400">
                Rp {walletBalance.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-slate-300">
                Bebas ditarik ke rekening bank atau e-wallet kapan pun (Min. Rp 50.000).
              </p>
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-xs shadow-lg transition flex items-center gap-2 shrink-0"
            >
              <CreditCard className="w-4 h-4" /> Tarik Saldo ke Rekening
            </button>
          </div>

          {/* Transparansi Bagi Hasil */}
          <div className="p-5 bg-amber-50 rounded-3xl border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
              <Percent className="w-4 h-4 text-amber-600" />
              Skema Bagi Hasil Transparan AZ GO
            </div>
            <p className="text-amber-800 leading-relaxed">
              Setiap kali Anda menyelesaikan order, <strong>{100 - commissionPercent}%</strong> dari ongkir langsung masuk bersih ke dompet Anda, dan <strong>{commissionPercent}%</strong> potongan masuk ke platform AZ GO untuk biaya server, proteksi santunan kecelakaan, dan pemasaran order.
            </p>
          </div>

          {/* Mutasi Transaksi Dompet */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Riwayat Mutasi Saldo Dompet</h3>
                <p className="text-xs text-slate-500">Catatan masuknya komisi order dan riwayat penarikan dana.</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">{walletTransactions.length} Transaksi</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Tipe Mutasi</th>
                    <th className="py-3 px-4">Keterangan</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-right">Saldo Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {walletTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                        {new Date(tx.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        {tx.type === 'ORDER_INCOME' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            + Order
                          </span>
                        )}
                        {tx.type === 'WITHDRAWAL' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            - Penarikan
                          </span>
                        )}
                        {tx.type === 'BONUS' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                            + Bonus
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate">{tx.description}</td>
                      <td className="py-3 px-4 text-right font-black">
                        {tx.type === 'WITHDRAWAL' ? (
                          <span className="text-rose-600">-Rp {tx.amount.toLocaleString('id-ID')}</span>
                        ) : (
                          <span className="text-emerald-600">+Rp {tx.amount.toLocaleString('id-ID')}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                        Rp {(tx.balanceAfter ?? 0).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                  {walletTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Belum ada riwayat transaksi dompet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL PENARIKAN SALDO DRIVER ================= */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Tarik Saldo ke Rekening Bank</h3>
                <p className="text-[11px] text-slate-500">Saldo tersedia: Rp {walletBalance.toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nominal Penarikan (IDR)</label>
                <input
                  type="number"
                  min={50000}
                  max={walletBalance}
                  step={10000}
                  required
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm font-mono"
                />
                <div className="flex gap-1.5 mt-1.5">
                  {[50000, 100000, 200000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setWithdrawAmount(val)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold"
                    >
                      Rp {val.toLocaleString('id-ID')}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(walletBalance)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[10px] font-bold"
                  >
                    Semua
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank / E-Wallet Tujuan</label>
                <select
                  value={withdrawBank}
                  onChange={e => setWithdrawBank(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                >
                  <option value="BCA">BCA (Bank Central Asia)</option>
                  <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BNI">BNI (Bank Negara Indonesia)</option>
                  <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                  <option value="GoPay">GoPay</option>
                  <option value="DANA">DANA</option>
                  <option value="OVO">OVO</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor Rekening / Akun E-Wallet</label>
                <input
                  type="text"
                  required
                  placeholder="Nomor rekening"
                  value={withdrawAccount}
                  onChange={e => setWithdrawAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pemilik Rekening</label>
                <input
                  type="text"
                  required
                  placeholder="Nama pemilik"
                  value={withdrawHolder}
                  onChange={e => setWithdrawHolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              {isBankMismatched && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    Peringatan: Rekening Berbeda dari Pendaftaran!
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Rekening tujuan ({withdrawBank} - {withdrawAccount}) berbeda dengan rekening awal ({registeredBank} - {registeredAccount}).
                    Notifikasi konfirmasi keamanan akan otomatis dikirimkan ke No. WhatsApp <strong>{driverProfile.phone}</strong> saat pengajuan berhasil dikirimkan.
                  </p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={withdrawLoading}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  {withdrawLoading ? 'Memproses...' : 'Kirim Permintaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SIMULASI NOTIFIKASI WHATSAPP KE NO HP DRIVER */}
      {waNotificationAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-emerald-300 animate-in fade-in zoom-in-95 duration-200">
            {/* WhatsApp Header */}
            <div className="bg-emerald-600 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">Notifikasi Keamanan WhatsApp</h4>
                  <p className="text-[11px] text-emerald-100 font-mono">Terkirim ke: {waNotificationAlert.phone}</p>
                </div>
              </div>
              <button 
                onClick={() => setWaNotificationAlert(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Chat Message Body */}
            <div className="p-5 bg-emerald-50/40 space-y-4 text-xs">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 space-y-3 relative">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-extrabold text-emerald-800 flex items-center gap-1.5 text-xs">
                    <ShieldAlert className="w-4 h-4 text-emerald-600" /> AZ GO Official Alert
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{waNotificationAlert.time} WIB</span>
                </div>

                <div className="space-y-2 text-slate-800 leading-relaxed text-xs">
                  <p>
                    Halo Mitra Driver <strong>{driverProfile.name}</strong>,
                  </p>
                  <p>
                    Permintaan pencairan dana (withdraw) saldo dompet sebesar <strong className="text-emerald-700">Rp {waNotificationAlert.amount.toLocaleString('id-ID')}</strong> berhasil kami catat dan sedang dalam antrean verifikasi admin.
                  </p>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                    <div>Bank: <strong>{waNotificationAlert.bankName}</strong></div>
                    <div>No. Rekening: <strong>{waNotificationAlert.accountNumber}</strong></div>
                    <div>Atas Nama: <strong>{waNotificationAlert.accountHolder}</strong></div>
                  </div>

                  {waNotificationAlert.isMismatched ? (
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-[11px]">
                      <strong>⚠️ PERINGATAN KEAMANAN:</strong> Nomor rekening penarikan ini <u>BERBEDA</u> dengan data rekening awal saat pendaftaran ({registeredBank} - {registeredAccount}). Mohon pastikan data di atas sudah benar untuk menghindari salah transfer oleh pihak tak bertanggung jawab.
                    </div>
                  ) : (
                    <p className="text-emerald-700 font-semibold text-[11px]">
                      ✅ Rekening penarikan sesuai dengan data rekening terdaftar.
                    </p>
                  )}

                  <p className="text-[11px] text-slate-500 pt-1">
                    Jika Anda merasa <strong>tidak melakukan transaksi penarikan ini</strong>, segera hubungi Call Center / WhatsApp CS AZ GO di 0811-AZGO-HELP untuk membatalkan proses pencairan.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setWaNotificationAlert(null)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Data Sudah Benar & Konfirmasi Diterima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
