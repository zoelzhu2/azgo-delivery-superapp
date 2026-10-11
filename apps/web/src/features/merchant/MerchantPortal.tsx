import React, { useState, useEffect } from 'react';
import { User, WalletTransaction } from '@delivery/shared';
import { api } from '../../services/apiClient';
import { 
  Store, 
  CheckCircle2, 
  ArrowLeft, 
  Power, 
  ChefHat, 
  Plus,
  KeyRound,
  LogOut,
  Percent,
  CreditCard,
  AlertCircle,
  X,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  ShieldAlert,
  Bike,
  Radio,
  Trash2,
  UserPlus,
  UserCheck,
  Phone
} from 'lucide-react';

interface MerchantPortalProps {
  onBack: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
  onChangePassword?: () => void;
}

export const MerchantPortal: React.FC<MerchantPortalProps> = ({ 
  onBack,
  currentUser,
  onLogout,
  onChangePassword
}) => {
  const isMerchantActive = currentUser?.isActive !== false;
  const accountStoreType: 'FOOD' | 'MART' = currentUser?.storeType || (currentUser?.email?.includes('mart') ? 'MART' : 'FOOD');
  const registeredBank = currentUser?.bankName || 'BCA';
  const registeredAccount = currentUser?.accountNumber || '8830192831';
  const registeredHolder = currentUser?.accountHolder || currentUser?.fullName || 'Bambang Sudiro';
  const storePhone = currentUser?.phone || '08123456789';

  const [activeMerchantTab, setActiveMerchantTab] = useState<'orders' | 'menu' | 'couriers' | 'finance'>('orders');
  const [isOpen, setIsOpen] = useState(isMerchantActive);
  const [selectedStoreType] = useState<'FOOD' | 'MART'>(accountStoreType);

  // Store Couriers (Kurir Mandiri Toko)
  const [storeCouriers, setStoreCouriers] = useState<Array<{
    id: string;
    name: string;
    phone: string;
    vehicleModel?: string;
    vehiclePlate?: string;
  }>>(() => {
    if (currentUser?.selfCouriers && currentUser.selfCouriers.length > 0) {
      return currentUser.selfCouriers;
    }
    return [
      {
        id: 'sc-1',
        name: 'Agus Santoso (Kurir Internal)',
        phone: '081299887711',
        vehicleModel: 'Honda Beat Hitam',
        vehiclePlate: 'L 3892 AZ'
      },
      {
        id: 'sc-2',
        name: 'Dedi Kurniawan (Staff Toko)',
        phone: '081377665544',
        vehicleModel: 'Yamaha Mio Soul GT',
        vehiclePlate: 'L 5519 BZ'
      }
    ];
  });

  useEffect(() => {
    if (currentUser?.selfCouriers && currentUser.selfCouriers.length > 0) {
      setStoreCouriers(currentUser.selfCouriers);
    }
  }, [currentUser?.selfCouriers]);

  // Dispatch Courier Modal state
  const [showCourierModalForOrder, setShowCourierModalForOrder] = useState<any | null>(null);
  const [selectedCourierId, setSelectedCourierId] = useState<string>('sc-1');
  const [customCourierName, setCustomCourierName] = useState('');
  const [customCourierPhone, setCustomCourierPhone] = useState('');
  const [customCourierPlate, setCustomCourierPlate] = useState('');
  const [orderActionNotice, setOrderActionNotice] = useState('');

  // Add Courier Modal state (for Kurir Mandiri tab)
  const [showAddCourierModal, setShowAddCourierModal] = useState(false);
  const [newCourierName, setNewCourierName] = useState('');
  const [newCourierPhone, setNewCourierPhone] = useState('');
  const [newCourierVehicle, setNewCourierVehicle] = useState('Honda Beat');
  const [newCourierPlate, setNewCourierPlate] = useState('');
  const [courierActionNotice, setCourierActionNotice] = useState('');

  // Wallet & Finance State
  const [walletBalance, setWalletBalance] = useState(1250000);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [commissionPercent, setCommissionPercent] = useState(15);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(250000);
  const [withdrawBank, setWithdrawBank] = useState(currentUser?.bankName || 'BCA');
  const [withdrawAccount, setWithdrawAccount] = useState(currentUser?.accountNumber || '8830192831');
  const [withdrawHolder, setWithdrawHolder] = useState(currentUser?.accountHolder || currentUser?.fullName || 'Bambang Sudiro');
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

  // Load wallet & commission config from backend
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const partnerId = currentUser?.id || 'mch-1';
        const res = await api.getPartnerWallet(partnerId, 'MERCHANT');
        if (res.success && res.data) {
          setWalletBalance(res.data.balance);
          setWalletTransactions(res.data.transactions);
        }
        const cfgRes = await api.getCommissionConfig();
        if (cfgRes.success && cfgRes.data) {
          setCommissionPercent(cfgRes.data.merchantCommissionPercent || 15);
        }
      } catch (err) {
        console.error('Failed to load merchant wallet', err);
      }
    };
    fetchWallet();
  }, [currentUser?.id]);

  // Order Inbox Resto / Mart
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'ord-m-1',
      orderNumber: 'AZD-119280',
      customerName: 'Maya Angelia',
      customerPhone: '08123456789',
      items: [
        { name: 'Paket Ayam Geprek Level 3 + Nasi', qty: 2, price: 25000 },
        { name: 'Es Teh Manis Jumbo', qty: 2, price: 6000 }
      ],
      total: 62000,
      status: 'NEW_ORDER', // NEW_ORDER -> PREPARING -> READY_FOR_PICKUP -> IN_TRANSIT -> COMPLETED
      driverName: 'Menunggu Konfirmasi Toko',
      deliveryType: undefined,
      isSelfCourier: false
    },
    {
      id: 'ord-m-2',
      orderNumber: 'AZD-119275',
      customerName: 'Denny Sumargo',
      customerPhone: '081299881122',
      items: [
        { name: 'Paket Ayam Geprek Level 1 + Nasi', qty: 1, price: 25000 }
      ],
      total: 25000,
      status: 'PREPARING',
      driverName: 'Menunggu Pengambilan Driver / Kurir',
      deliveryType: undefined,
      isSelfCourier: false
    }
  ]);

  // Menu / Product Stock Management
  const [menuItems, setMenuItems] = useState<any[]>([
    { id: 'item-1', name: 'Paket Ayam Geprek Level 3 + Nasi', price: 25000, isAvailable: true },
    { id: 'item-2', name: 'Es Teh Manis Jumbo', price: 6000, isAvailable: true },
    { id: 'item-3', name: 'Tahu & Tempe Goreng Krispi', price: 8000, isAvailable: false }
  ]);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<number>(15000);

  // Status Actions
  const handleUpdateStatus = (orderId: string, nextStatus: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (nextStatus === 'READY_FOR_PICKUP' || nextStatus === 'IN_TRANSIT') {
          // Tambahkan pendapatan bersih toko ke dompet jika belum dikreditkan
          if (!o.walletCredited) {
            const netPayout = Math.round(o.total * (1 - commissionPercent / 100));
            setWalletBalance(curr => curr + netPayout);
            const newTrx: WalletTransaction = {
              id: `trx-${Date.now()}`,
              partnerId: currentUser?.id || 'mch-1',
              partnerType: 'MERCHANT',
              partnerName: selectedStoreType === 'FOOD' ? 'Ayam Geprek Sambal Bawang Juara' : 'Az Mart Express - Sudirman',
              type: 'ORDER_INCOME',
              amount: netPayout,
              balanceAfter: walletBalance + netPayout,
              description: `Hasil Penjualan Order ${o.orderNumber} (Gross Rp ${o.total.toLocaleString('id-ID')} - Komisi AZ GO ${commissionPercent}%)`,
              orderNumber: o.orderNumber,
              status: 'COMPLETED',
              createdAt: new Date().toISOString()
            };
            setWalletTransactions(curTrx => [newTrx, ...curTrx]);
            return { ...o, status: nextStatus, walletCredited: true };
          }
        }
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  // Opsi 1: Panggil Driver AZ GO Terdekat
  const handleCallAzGoDriver = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (!o.walletCredited) {
          const netPayout = Math.round(o.total * (1 - commissionPercent / 100));
          setWalletBalance(curr => curr + netPayout);
          const newTrx: WalletTransaction = {
            id: `trx-${Date.now()}`,
            partnerId: currentUser?.id || 'mch-1',
            partnerType: 'MERCHANT',
            partnerName: selectedStoreType === 'FOOD' ? 'Ayam Geprek Sambal Bawang Juara' : 'Az Mart Express - Sudirman',
            type: 'ORDER_INCOME',
            amount: netPayout,
            balanceAfter: walletBalance + netPayout,
            description: `Hasil Penjualan Order ${o.orderNumber} (Gross Rp ${o.total.toLocaleString('id-ID')} - Komisi AZ GO ${commissionPercent}%)`,
            orderNumber: o.orderNumber,
            status: 'COMPLETED',
            createdAt: new Date().toISOString()
          };
          setWalletTransactions(curTrx => [newTrx, ...curTrx]);
        }
        return {
          ...o,
          status: 'READY_FOR_PICKUP',
          deliveryType: 'AZ_GO_DRIVER',
          isSelfCourier: false,
          walletCredited: true,
          driverName: '📡 Mencari Driver AZ GO Terdekat...'
        };
      }
      return o;
    }));

    setOrderActionNotice(`📡 Radar AZ GO diaktifkan! Driver online terdekat sedang dicari untuk menjemput pesanan.`);
    setTimeout(() => setOrderActionNotice(''), 5000);

    // Simulasi 2.5 detik kemudian driver AZ GO menerima order
    setTimeout(() => {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId && o.status === 'READY_FOR_PICKUP') {
          return {
            ...o,
            driverName: 'Budi Santoso (Driver AZ GO • Vario Hitam W 4421 ZZ)',
            driverPhone: '081233445566'
          };
        }
        return o;
      }));
    }, 2500);
  };

  // Opsi 2: Submit Kirim via Kurir Mandiri Toko
  const handleDispatchSelfCourierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCourierModalForOrder) return;
    const orderId = showCourierModalForOrder.id;

    let assignedName = '';
    let assignedPhone = '';
    let assignedPlate = '';

    if (selectedCourierId === 'custom') {
      if (!customCourierName.trim() || !customCourierPhone.trim()) {
        alert('Mohon masukkan nama dan nomor WhatsApp / HP kurir toko.');
        return;
      }
      assignedName = customCourierName.trim();
      assignedPhone = customCourierPhone.trim();
      assignedPlate = customCourierPlate.trim() || ('L ' + Math.floor(1000 + Math.random() * 9000) + ' AZ');

      // Tambahkan otomatis ke daftar kurir toko agar bisa dipakai lagi
      const newSc = {
        id: `sc-${Date.now()}`,
        name: assignedName,
        phone: assignedPhone,
        vehicleModel: 'Motor Toko',
        vehiclePlate: assignedPlate
      };
      setStoreCouriers(prev => [...prev, newSc]);
    } else {
      const found = storeCouriers.find(c => c.id === selectedCourierId);
      if (found) {
        assignedName = found.name;
        assignedPhone = found.phone;
        assignedPlate = found.vehiclePlate || 'L 3892 AZ';
      } else {
        assignedName = 'Kurir Mandiri Toko';
        assignedPhone = '081299887711';
        assignedPlate = 'L 3892 AZ';
      }
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (!o.walletCredited) {
          const netPayout = Math.round(o.total * (1 - commissionPercent / 100));
          setWalletBalance(curr => curr + netPayout);
          const newTrx: WalletTransaction = {
            id: `trx-${Date.now()}`,
            partnerId: currentUser?.id || 'mch-1',
            partnerType: 'MERCHANT',
            partnerName: selectedStoreType === 'FOOD' ? 'Ayam Geprek Sambal Bawang Juara' : 'Az Mart Express - Sudirman',
            type: 'ORDER_INCOME',
            amount: netPayout,
            balanceAfter: walletBalance + netPayout,
            description: `Hasil Penjualan Order ${o.orderNumber} (Gross Rp ${o.total.toLocaleString('id-ID')} - Kurir Mandiri Toko)`,
            orderNumber: o.orderNumber,
            status: 'COMPLETED',
            createdAt: new Date().toISOString()
          };
          setWalletTransactions(curTrx => [newTrx, ...curTrx]);
        }
        return {
          ...o,
          status: 'IN_TRANSIT',
          deliveryType: 'SELF_COURIER',
          isSelfCourier: true,
          walletCredited: true,
          driverName: `${assignedName} (${assignedPlate})`,
          driverPhone: assignedPhone,
          driverPlate: assignedPlate
        };
      }
      return o;
    }));

    setShowCourierModalForOrder(null);
    setCustomCourierName('');
    setCustomCourierPhone('');
    setCustomCourierPlate('');
    setOrderActionNotice(`🛵 Pesanan #${showCourierModalForOrder.orderNumber} diserahkan ke ${assignedName} (Kurir Mandiri Toko) untuk diantar langsung!`);
    setTimeout(() => setOrderActionNotice(''), 6000);
  };

  // Simulasi Driver Mengambil Pesanan
  const handleSimulateDriverPickup = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'IN_TRANSIT',
          driverName: o.driverName?.includes('Mencari') 
            ? 'Budi Santoso (Driver AZ GO • Vario Hitam W 4421 ZZ)' 
            : o.driverName
        };
      }
      return o;
    }));
    setOrderActionNotice(`🛵 Driver telah mengambil pesanan di resto dan sedang menuju ke alamat pelanggan.`);
    setTimeout(() => setOrderActionNotice(''), 4000);
  };

  // Konfirmasi Pesanan Telah Diterima Pelanggan
  const handleCompleteOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'COMPLETED' };
      }
      return o;
    }));
    setOrderActionNotice(`🎉 Pesanan telah sukses diantar dan diterima oleh pelanggan!`);
    setTimeout(() => setOrderActionNotice(''), 4000);
  };

  // Kurir Mandiri Management Handlers
  const handleAddCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourierName || !newCourierPhone) return;
    const newCourier = {
      id: `sc-${Date.now()}`,
      name: newCourierName,
      phone: newCourierPhone,
      vehicleModel: newCourierVehicle,
      vehiclePlate: newCourierPlate || ('L ' + Math.floor(1000 + Math.random() * 9000) + ' AZ')
    };
    setStoreCouriers(prev => [...prev, newCourier]);
    setShowAddCourierModal(false);
    setNewCourierName('');
    setNewCourierPhone('');
    setNewCourierVehicle('Honda Beat');
    setNewCourierPlate('');
    setCourierActionNotice(`✅ Kurir mandiri "${newCourier.name}" berhasil ditambahkan ke daftar armada toko.`);
    setTimeout(() => setCourierActionNotice(''), 4000);
  };

  const handleDeleteCourier = (id: string) => {
    setStoreCouriers(prev => prev.filter(c => c.id !== id));
    setCourierActionNotice('🗑️ Kurir mandiri berhasil dihapus dari daftar armada toko.');
    setTimeout(() => setCourierActionNotice(''), 4000);
  };

  const toggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;
    setMenuItems(prev => [
      ...prev,
      { id: `item-${Date.now()}`, name: newItemName, price: newItemPrice, isAvailable: true }
    ]);
    setShowAddModal(false);
    setNewItemName('');
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) return;
    if (withdrawAmount > walletBalance) {
      setWithdrawError('Nominal penarikan melebihi saldo dompet toko Anda.');
      return;
    }
    if (withdrawAmount < 50000) {
      setWithdrawError('Minimal penarikan saldo adalah Rp 50.000.');
      return;
    }

    setWithdrawLoading(true);
    setWithdrawError('');
    try {
      const partnerId = currentUser?.id || 'mch-1';
      const res = await api.requestWithdrawal({
        partnerId,
        partnerName: selectedStoreType === 'FOOD' ? 'Ayam Geprek Sambal Bawang Juara' : 'Az Mart Express - Sudirman',
        partnerType: 'MERCHANT',
        amount: withdrawAmount,
        bankName: withdrawBank,
        accountNumber: withdrawAccount,
        accountHolder: withdrawHolder
      });

      if (res.success) {
        setWalletBalance(prev => prev - withdrawAmount);
        setShowWithdrawModal(false);
        setWithdrawSuccess(`✅ Permintaan penarikan dana toko Rp ${withdrawAmount.toLocaleString('id-ID')} ke ${withdrawBank} (${withdrawAccount}) berhasil diajukan!`);
        setTimeout(() => setWithdrawSuccess(''), 7000);
        // Trigger Notifikasi WhatsApp Konfirmasi Keamanan
        setWaNotificationAlert({
          phone: storePhone,
          amount: withdrawAmount,
          bankName: withdrawBank,
          accountNumber: withdrawAccount,
          accountHolder: withdrawHolder,
          isMismatched: isBankMismatched,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });
        const wRes = await api.getPartnerWallet(partnerId, 'MERCHANT');
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Tampilan Pengguna
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="font-extrabold text-slate-900">{currentUser.fullName}</span>
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

          {/* Terkunci Sesuai Akun Toko Terdaftar: Resto tidak bisa beralih ke Mart, Mart tidak bisa beralih ke Resto */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 border border-slate-200">
            {accountStoreType === 'FOOD' ? (
              <span className="text-amber-800 flex items-center gap-1">
                🍗 Akun Mitra Restoran (Az Delivery)
              </span>
            ) : (
              <span className="text-emerald-800 flex items-center gap-1">
                🛒 Akun Mitra Minimarket (Az Mart)
              </span>
            )}
          </div>

          <span className="text-xs font-bold bg-emerald-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Store className="w-3.5 h-3.5" /> Portal Penjual
          </span>
        </div>
      </div>

      {!isMerchantActive && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-3xl text-rose-900 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-extrabold text-sm text-rose-950">Status Toko: Dinonaktifkan oleh Administrator</h4>
            <p className="text-rose-700 leading-relaxed">
              Toko/Resto Anda saat ini ditangguhkan oleh administrator. Toko Anda tidak ditampilkan pada aplikasi pelanggan sehingga tidak akan menerima pesanan baru. Silakan hubungi admin AZ GO untuk informasi reaktivasi.
            </p>
          </div>
        </div>
      )}

      {/* Profil Toko & Status Buka/Tutup */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl shadow-inner">
              🍗
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {selectedStoreType === 'FOOD' ? 'Ayam Geprek Sambal Bawang Juara' : 'Az Mart Express - Sudirman'}
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ★ 4.8
                </span>
              </div>
              <p className="text-xs text-slate-500">Cabang Jl. Merdeka Barat No. 12 • ID: MCH-9021</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition shadow-sm ${
              isOpen
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
            }`}
          >
            <Power className="w-4 h-4" />
            {isOpen ? '🟢 Toko Sedang Buka (Menerima Order)' : '🔴 Toko Tutup Sementara'}
          </button>
        </div>

        {/* Ringkasan Penjualan Hari Ini & Saldo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <span className="text-emerald-700 block mb-1 font-bold">Saldo Dompet Toko</span>
            <p className="text-xl font-black text-emerald-950">
              Rp {walletBalance.toLocaleString('id-ID')}
            </p>
            <button
              onClick={() => {
                setActiveMerchantTab('finance');
                setShowWithdrawModal(true);
              }}
              className="mt-2 text-[10px] font-bold text-emerald-800 bg-white border border-emerald-300 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition"
            >
              Tarik Saldo ↗
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl">
            <span className="text-slate-400 block mb-1">Total Omset Hari Ini</span>
            <p className="text-xl font-black text-slate-900">Rp 845.000</p>
            <span className="text-[10px] text-slate-400 block mt-1">Bruto Penjualan</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl">
            <span className="text-slate-400 block mb-1">Pesanan Selesai</span>
            <p className="text-xl font-black text-emerald-700">19 Order</p>
            <span className="text-[10px] text-slate-400 block mt-1">Sukses Diambil Kurir</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl">
            <span className="text-slate-400 block mb-1">Potongan Platform</span>
            <p className="text-xl font-black text-amber-700">{commissionPercent}%</p>
            <span className="text-[10px] text-slate-500 block mt-1">Bagi Hasil Resmi AZ GO</span>
          </div>
        </div>
      </div>

      {withdrawSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{withdrawSuccess}</span>
        </div>
      )}

      {/* Sub-tabs Mitra Toko */}
      <div className="flex border-b border-slate-200 gap-2 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveMerchantTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeMerchantTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ChefHat className="w-4 h-4 text-amber-400" /> Antrean Pesanan ({orders.length})
        </button>

        <button
          onClick={() => setActiveMerchantTab('menu')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeMerchantTab === 'menu' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Plus className="w-4 h-4 text-blue-400" /> Manajemen Menu & Stok ({menuItems.length})
        </button>

        <button
          onClick={() => setActiveMerchantTab('couriers')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeMerchantTab === 'couriers' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Bike className="w-4 h-4 text-emerald-400" /> Kurir Mandiri Toko ({storeCouriers.length})
        </button>

        <button
          onClick={() => setActiveMerchantTab('finance')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeMerchantTab === 'finance' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" /> Keuangan & Bagi Hasil
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
            Rp {walletBalance.toLocaleString('id-ID')}
          </span>
        </button>
      </div>

      {/* ================= TAB 1: INBOX PESANAN MASUK ================= */}
      {activeMerchantTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Antrean Pesanan Masuk ({orders.length})</h3>
            </div>
            <span className="text-xs text-slate-400">Update Real-Time</span>
          </div>

          {orderActionNotice && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-2xl font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{orderActionNotice}</span>
            </div>
          )}

          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="p-5 rounded-2xl border-2 border-slate-200 space-y-3 bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-base">{order.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        order.status === 'NEW_ORDER' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                        order.status === 'PREPARING' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'READY_FOR_PICKUP' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'IN_TRANSIT' ? (order.isSelfCourier ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800') :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {order.status === 'NEW_ORDER' && '🔔 Pesanan Baru Masuk'}
                        {order.status === 'PREPARING' && '🍳 Sedang Dimasak / Disiapkan'}
                        {order.status === 'READY_FOR_PICKUP' && '📦 Siap Diambil Driver AZ GO'}
                        {order.status === 'IN_TRANSIT' && (order.isSelfCourier ? '🛵 Diantar Kurir Mandiri Toko' : '🛵 Sedang Diantar Driver AZ GO')}
                        {order.status === 'COMPLETED' && '✅ Pesanan Selesai'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Pemesan: <strong>{order.customerName}</strong> ({order.customerPhone})</p>
                    <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                      Status Pengantaran: <span className="font-bold text-slate-800">{order.driverName}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 block">
                      Rp {order.total.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Bersih Toko ({100 - commissionPercent}%): Rp {Math.round(order.total * (1 - commissionPercent / 100)).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Rincian Item */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs divide-y divide-slate-100">
                  {order.items.map((it: any, idx: number) => (
                    <div key={idx} className="py-1 flex justify-between">
                      <span>{it.qty}x {it.name}</span>
                      <span className="font-semibold">Rp {(it.qty * it.price).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons Resto / Mart */}
                <div className="flex justify-end gap-2 pt-1 flex-wrap items-center">
                  {order.status === 'NEW_ORDER' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition"
                    >
                      Terima & Mulai Masak / Siapkan
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Pesanan selesai?</span>
                      
                      {/* Opsi 1: Panggil Driver AZ GO */}
                      <button
                        onClick={() => handleCallAzGoDriver(order.id)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
                        title="Panggil driver online AZ GO terdekat via radar sistem"
                      >
                        <Radio className="w-4 h-4 text-emerald-200 animate-pulse" />
                        <span>Panggil Driver AZ GO</span>
                      </button>

                      {/* Opsi 2: Pilih Kurir Mandiri */}
                      <button
                        onClick={() => {
                          setShowCourierModalForOrder(order);
                          if (storeCouriers.length > 0) {
                            setSelectedCourierId(storeCouriers[0].id);
                          } else {
                            setSelectedCourierId('custom');
                          }
                        }}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
                        title="Tugaskan staf/kurir toko sendiri untuk mengantar"
                      >
                        <Bike className="w-4 h-4 text-blue-200" />
                        <span>Pilih Kurir Mandiri Toko</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'READY_FOR_PICKUP' && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                        <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Menunggu Driver Pick-Up
                      </span>
                      <button
                        onClick={() => handleSimulateDriverPickup(order.id)}
                        className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300 transition shadow-xs"
                      >
                        Simulasi Driver Ambil Pesanan ➔
                      </button>
                    </div>
                  )}

                  {order.status === 'IN_TRANSIT' && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                        order.isSelfCourier 
                          ? 'text-purple-800 bg-purple-50 border-purple-200' 
                          : 'text-indigo-800 bg-indigo-50 border-indigo-200'
                      }`}>
                        <Bike className="w-3.5 h-3.5 text-purple-600 animate-bounce" /> 
                        {order.isSelfCourier ? 'Sedang Diantar Kurir Toko' : 'Sedang Diantar Driver AZ GO'}
                      </span>
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Konfirmasi Pesanan Diterima Pelanggan
                      </button>
                    </div>
                  )}

                  {order.status === 'COMPLETED' && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" /> Pesanan Selesai • Hasil Penjualan Masuk Dompet
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MANAJEMEN MENU & STATUS STOK ================= */}
      {activeMerchantTab === 'menu' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Manajemen Menu & Ketersediaan Stok</h3>
              <p className="text-xs text-slate-500">Matikan stok jika habis agar pelanggan tidak memesan.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Tambah Menu Baru
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {menuItems.map(item => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                  <span className="text-slate-500">Rp {item.price.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.isAvailable ? 'Tersedia' : 'Habis (Sold Out)'}
                  </span>

                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                      item.isAvailable
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {item.isAvailable ? 'Tandai Habis' : 'Tandai Tersedia'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: MANAJEMEN KURIR MANDIRI TOKO ================= */}
      {activeMerchantTab === 'couriers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Kurir Mandiri Toko / Internal</h3>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  {storeCouriers.length} Kurir Siap Antar
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Staf toko yang ditugaskan untuk mengantar pesanan langsung ke pelanggan tanpa harus memanggil driver online AZ GO.
              </p>
            </div>

            <button
              onClick={() => setShowAddCourierModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition shrink-0"
            >
              <UserPlus className="w-4 h-4" /> Tambah Kurir Baru
            </button>
          </div>

          {courierActionNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{courierActionNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {storeCouriers.map(courier => (
              <div key={courier.id} className="p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 transition bg-slate-50/50 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
                    🛵
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{courier.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Aktif
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{courier.phone}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {courier.vehicleModel || 'Sepeda Motor'} • <strong className="text-slate-800 font-mono">{courier.vehiclePlate || 'Plat Toko'}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  <a
                    href={`https://wa.me/62${courier.phone.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-bold transition"
                    title="Hubungi WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteCourier(courier.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    title="Hapus Kurir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {storeCouriers.length === 0 && (
              <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-2">
                <Bike className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600 text-sm">Belum ada kurir mandiri yang didaftarkan</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Klik tombol &quot;Tambah Kurir Baru&quot; di atas untuk mendaftarkan staf toko yang bertugas mengantar pesanan langsung.
                </p>
              </div>
            )}
          </div>

          {/* Banner Info Keuntungan Kurir Mandiri */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-blue-900">
              <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
              Keuntungan Menggunakan Kurir Mandiri Toko
            </div>
            <p className="text-blue-800 leading-relaxed text-[11px]">
              Pesanan dapat langsung diantar begitu makanan/barang siap tanpa harus menunggu ketersediaan driver online jaringan AZ GO. Pelanggan tetap dapat melihat rute perjalanan kurir dan info kontak kurir toko Anda.
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB 4: KEUANGAN & BAGI HASIL ================= */}
      {activeMerchantTab === 'finance' && (
        <div className="space-y-6">
          {/* Card Saldo Toko */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-emerald-300 block uppercase tracking-wider">
                Saldo Dompet Toko Siap Ditarik
              </span>
              <p className="text-3xl sm:text-4xl font-black text-white">
                Rp {walletBalance.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-slate-300">
                Pencairan dana langsung ke rekening bank usaha Anda (Min. Rp 50.000).
              </p>
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl text-xs shadow-lg transition flex items-center gap-2 shrink-0"
            >
              <CreditCard className="w-4 h-4" /> Tarik Saldo Toko
            </button>
          </div>

          {/* Transparansi Bagi Hasil Toko */}
          <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <Percent className="w-4 h-4 text-emerald-600" />
              Skema Bagi Hasil Transparan Toko & Resto AZ GO
            </div>
            <p className="text-emerald-800 leading-relaxed">
              Dari setiap pesanan pelanggan yang diselesaikan, toko Anda menerima <strong>{100 - commissionPercent}%</strong> bersih dari harga produk menu, dan potongan <strong>{commissionPercent}%</strong> dialokasikan kepada platform AZ GO untuk promosi kupon aplikasi, jangkauan pengantaran kurir, serta infrastruktur teknologi.
            </p>
          </div>

          {/* Mutasi Transaksi Dompet Toko */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Mutasi & Riwayat Transaksi Dompet Toko</h3>
                <p className="text-xs text-slate-500">Catatan pencairan dana dan hasil penjualan bersih.</p>
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
                            + Penjualan
                          </span>
                        )}
                        {tx.type === 'WITHDRAWAL' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            - Penarikan
                          </span>
                        )}
                        {tx.type === 'BONUS' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                            + Refund
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
                        Belum ada riwayat transaksi dompet toko.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH MENU */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Tambah Menu Makanan Baru</h3>
            <form onSubmit={handleAddNewItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Menu</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bebek Goreng Sambal Ijo"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  value={newItemPrice}
                  onChange={e => setNewItemPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PENARIKAN DANA TOKO */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Tarik Saldo Toko ke Rekening</h3>
                <p className="text-[11px] text-slate-500">Saldo siap ditarik: Rp {walletBalance.toLocaleString('id-ID')}</p>
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
                  step={25000}
                  required
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm font-mono"
                />
                <div className="flex gap-1.5 mt-1.5">
                  {[100000, 250000, 500000].map(val => (
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
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold"
                  >
                    Semua
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Rekening Toko</label>
                <select
                  value={withdrawBank}
                  onChange={e => setWithdrawBank(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                >
                  <option value="BCA">BCA (Bank Central Asia)</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                  <option value="BNI">BNI (Bank Negara Indonesia)</option>
                  <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor Rekening Bank</label>
                <input
                  type="text"
                  required
                  placeholder="Nomor rekening usaha"
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
                  placeholder="Nama pemilik rekening"
                  value={withdrawHolder}
                  onChange={e => setWithdrawHolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              {isBankMismatched && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    Peringatan: Rekening Berbeda dari Pendaftaran Toko!
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Rekening tujuan ({withdrawBank} - {withdrawAccount}) berbeda dengan rekening terdaftar ({registeredBank} - {registeredAccount}).
                    Notifikasi konfirmasi keamanan akan dikirimkan otomatis ke WhatsApp pemilik toko (<strong>{storePhone}</strong>).
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
                  {withdrawLoading ? 'Memproses...' : 'Kirim Pengajuan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SIMULASI NOTIFIKASI WHATSAPP KE NO HP MITRA TOKO */}
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
                    <ShieldAlert className="w-4 h-4 text-emerald-600" /> AZ GO Merchant Security Alert
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{waNotificationAlert.time} WIB</span>
                </div>

                <div className="space-y-2 text-slate-800 leading-relaxed text-xs">
                  <p>
                    Halo Mitra Toko <strong>{currentUser?.fullName || 'Mitra AZ GO'}</strong>,
                  </p>
                  <p>
                    Permintaan pencairan dana toko sebesar <strong className="text-emerald-700">Rp {waNotificationAlert.amount.toLocaleString('id-ID')}</strong> berhasil kami catat dan dalam proses verifikasi keuangan.
                  </p>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                    <div>Bank: <strong>{waNotificationAlert.bankName}</strong></div>
                    <div>No. Rekening: <strong>{waNotificationAlert.accountNumber}</strong></div>
                    <div>Atas Nama: <strong>{waNotificationAlert.accountHolder}</strong></div>
                  </div>

                  {waNotificationAlert.isMismatched ? (
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-[11px]">
                      <strong>⚠️ PERINGATAN KEAMANAN:</strong> Rekening tujuan ini <u>BERBEDA</u> dengan data rekening saat pendaftaran ({registeredBank} - {registeredAccount}). Mohon pastikan data di atas sudah benar untuk menghindari penyalahgunaan oleh pihak yang tidak berwenang.
                    </div>
                  ) : (
                    <p className="text-emerald-700 font-semibold text-[11px]">
                      ✅ Rekening penarikan sesuai dengan data terdaftar saat pendaftaran.
                    </p>
                  )}

                  <p className="text-[11px] text-slate-500 pt-1">
                    Jika Anda merasa <strong>tidak melakukan penarikan ini</strong>, segera hubungi Call Center / WhatsApp CS AZ GO di 0811-AZGO-HELP untuk membatalkan proses pencairan.
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

      {/* MODAL PILIH KURIR MANDIRI TOKO SAAT SIAPKAN ORDER */}
      {showCourierModalForOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Pengantaran Mandiri Toko
                </span>
                <h3 className="font-black text-slate-900 text-lg mt-1">Pilih Kurir Mandiri Toko</h3>
                <p className="text-xs text-slate-500">
                  Pesanan <strong className="text-slate-900 font-mono">#{showCourierModalForOrder.orderNumber}</strong> ({showCourierModalForOrder.customerName})
                </p>
              </div>
              <button 
                onClick={() => setShowCourierModalForOrder(null)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSelfCourierSubmit} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Pilih Staf / Kurir Toko Pengantar:</label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {storeCouriers.map(c => (
                    <label 
                      key={c.id} 
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                        selectedCourierId === c.id 
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="courierOption"
                          checked={selectedCourierId === c.id}
                          onChange={() => setSelectedCourierId(c.id)}
                          className="accent-blue-600 w-4 h-4"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">{c.name}</p>
                          <p className="text-[11px] text-slate-500">{c.phone} • {c.vehicleModel || 'Motor'} ({c.vehiclePlate || 'Plat Toko'})</p>
                        </div>
                      </div>
                      <Bike className="w-4 h-4 text-blue-600 shrink-0" />
                    </label>
                  ))}

                  {/* Option to type custom courier */}
                  <label 
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                      selectedCourierId === 'custom' 
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="courierOption"
                        checked={selectedCourierId === 'custom'}
                        onChange={() => setSelectedCourierId('custom')}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">+ Input Nama Kurir Baru / Staf Lain</p>
                        <p className="text-[11px] text-slate-500">Ketik nama kurir secara cepat</p>
                      </div>
                    </div>
                    <UserPlus className="w-4 h-4 text-blue-600 shrink-0" />
                  </label>
                </div>
              </div>

              {selectedCourierId === 'custom' && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">Nama Staf / Kurir</label>
                    <input
                      type="text"
                      required={selectedCourierId === 'custom'}
                      placeholder="Contoh: Budi Santoso"
                      value={customCourierName}
                      onChange={e => setCustomCourierName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">No. WhatsApp / HP</label>
                      <input
                        type="tel"
                        required={selectedCourierId === 'custom'}
                        placeholder="0812xxxx"
                        value={customCourierPhone}
                        onChange={e => setCustomCourierPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Plat Nomor Motor</label>
                      <input
                        type="text"
                        placeholder="L 1234 XX"
                        value={customCourierPlate}
                        onChange={e => setCustomCourierPlate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Pesanan akan berpindah ke status <strong>Sedang Diantar</strong> dan kontak kurir toko Anda akan ditampilkan pada status pelacakan pelanggan.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCourierModalForOrder(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Bike className="w-4 h-4" /> Serahkan & Antar Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KURIR BARU TOKO (UNTUK TAB KURIR MANDIRI) */}
      {showAddCourierModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Tambah Kurir Mandiri Toko</h3>
                <p className="text-xs text-slate-500">Daftarkan staf atau kurir internal toko Anda.</p>
              </div>
              <button 
                onClick={() => setShowAddCourierModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCourier} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Kurir / Staf</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hendra Saputra"
                  value={newCourierName}
                  onChange={e => setNewCourierName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP Kurir</label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={newCourierPhone}
                  onChange={e => setNewCourierPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Kendaraan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Honda Beat"
                    value={newCourierVehicle}
                    onChange={e => setNewCourierVehicle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plat Nomor Kendaraan</label>
                  <input
                    type="text"
                    placeholder="Contoh: L 4812 BZ"
                    value={newCourierPlate}
                    onChange={e => setNewCourierPlate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourierModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Simpan Kurir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
