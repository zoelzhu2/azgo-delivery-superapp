import React, { useState, useEffect } from 'react';
import { User, WalletTransaction, PosSubscriptionApplication, PosPackageType, PosPricingConfig } from '@delivery/shared';
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
  Phone,
  Receipt,
  Calendar,
  Sparkles,
  Clock,
  Printer,
  Search,
  ShoppingBag,
  Check,
  CheckCircle,
  QrCode,
  History,
  BarChart3,
  Send,
  Upload
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

  const [activeMerchantTab, setActiveMerchantTab] = useState<'orders' | 'menu' | 'couriers' | 'finance' | 'pos'>('orders');
  const [isOpen, setIsOpen] = useState(isMerchantActive);
  const [selectedStoreType] = useState<'FOOD' | 'MART'>(accountStoreType);

  // POS Bundling & Subscription States
  const [posPricing] = useState<PosPricingConfig>(() => api.getPosPricingConfig());
  const [posSub, setPosSub] = useState<PosSubscriptionApplication | null>(null);
  const [selectedPosPkg, setSelectedPosPkg] = useState<PosPackageType>('TRIAL_3_DAYS');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'TRANSFER_BANK' | 'QRIS'>('TRANSFER_BANK');
  const [posPaymentProofUrl, setPosPaymentProofUrl] = useState<string>('');
  const [posPaymentProofName, setPosPaymentProofName] = useState<string>('');
  const [posSubmitLoading, setPosSubmitLoading] = useState(false);
  const [posNotice, setPosNotice] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // POS Cashier Operations State
  const [posSubView, setPosSubView] = useState<'CASHIER' | 'REPORTS'>('CASHIER');
  const [posOrderType, setPosOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'MART_DIRECT'>(
    accountStoreType === 'FOOD' ? 'DINE_IN' : 'MART_DIRECT'
  );
  const [posTableNumber, setPosTableNumber] = useState('Meja 01');
  const [posCustomerName, setPosCustomerName] = useState('Pelanggan Kasir');
  const [posSearchQuery, setPosSearchQuery] = useState('');
  const [posCart, setPosCart] = useState<Array<{ id: string; name: string; price: number; qty: number; notes?: string }>>([]);
  const [posDiscount, setPosDiscount] = useState<number>(0);
  const [posTaxEnabled, setPosTaxEnabled] = useState<boolean>(false);
  const [showPosPaymentModal, setShowPosPaymentModal] = useState(false);
  const [posPayMethod, setPosPayMethod] = useState<'CASH' | 'QRIS' | 'DEBIT'>('CASH');
  const [posCashTendered, setPosCashTendered] = useState<number>(0);
  const [posDebitRef, setPosDebitRef] = useState<string>('');
  const [completedPosSale, setCompletedPosSale] = useState<any | null>(null);
  const [buyerWaPhone, setBuyerWaPhone] = useState('');
  const [posSalesHistory, setPosSalesHistory] = useState<any[]>([
    {
      id: 'pos-101',
      receiptNumber: 'POS-20261102-001',
      time: '09:15',
      orderType: 'DINE_IN',
      tableNumber: 'Meja 02',
      customerName: 'Maya A.',
      items: [
        { name: 'Paket Ayam Geprek Level 3 + Nasi', qty: 2, price: 25000 },
        { name: 'Es Teh Manis Jumbo', qty: 2, price: 6000 }
      ],
      subtotal: 62000,
      discount: 0,
      tax: 0,
      total: 62000,
      payMethod: 'QRIS',
      cashTendered: 62000,
      cashChange: 0,
      cashierName: currentUser?.fullName || 'Kasir Resto'
    },
    {
      id: 'pos-102',
      receiptNumber: 'POS-20261102-002',
      time: '09:40',
      orderType: 'TAKEAWAY',
      tableNumber: '-',
      customerName: 'Bapak Rian',
      items: [
        { name: 'Paket Ayam Geprek Level 1 + Nasi', qty: 1, price: 25000 }
      ],
      subtotal: 25000,
      discount: 5000,
      tax: 0,
      total: 20000,
      payMethod: 'CASH',
      cashTendered: 50000,
      cashChange: 30000,
      cashierName: currentUser?.fullName || 'Kasir Resto'
    }
  ]);

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

    const fetchPos = async () => {
      try {
        const partnerId = currentUser?.id || 'mch-1';
        const pRes = await api.getMerchantPosSubscription(partnerId);
        if (pRes?.success && pRes.data) {
          setPosSub(pRes.data);
        }
      } catch (err) {
        console.error('Failed to load merchant POS subscription', err);
      }
    };
    fetchWallet();
    fetchPos();
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

  // POS Bundling Subscription Handlers
  const handleUploadPosProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file bukti pembayaran maksimal 5 MB.');
      return;
    }
    setPosPaymentProofName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setPosPaymentProofUrl(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRequestPosSubscription = async (pkgType: PosPackageType) => {
    const partnerId = currentUser?.id || 'mch-1';
    const isTrial = pkgType === 'TRIAL_3_DAYS';

    if (!isTrial && !posPaymentProofUrl) {
      alert('Mohon unggah foto / tangkapan layar bukti transfer pembayaran terlebih dahulu.');
      return;
    }

    setPosSubmitLoading(true);
    try {
      const res = await api.requestPosSubscription({
        merchantId: partnerId,
        merchantName: selectedStoreType === 'FOOD' ? 'Ayam Geprek Sambal Bawang Juara' : 'Az Mart Express - Sudirman',
        storeType: selectedStoreType,
        phone: storePhone,
        email: currentUser?.email || 'mitra@resto.id',
        packageType: pkgType,
        paymentMethod: isTrial ? 'FREE_TRIAL' : posPaymentMethod,
        paymentProofUrl: isTrial ? undefined : posPaymentProofUrl,
        paymentProofName: isTrial ? undefined : posPaymentProofName
      });

      if (res.success && res.data) {
        setPosSub(res.data);
        setShowUpgradeModal(false);
        setPosNotice(res.message || 'Permohonan berhasil dikirim!');
        setTimeout(() => setPosNotice(''), 7000);
      } else {
        alert(res.message || 'Gagal mengirim permohonan paket bundling');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem saat mendaftar paket');
    } finally {
      setPosSubmitLoading(false);
    }
  };

  // POS Cashier Cart & Order Handlers
  const handleAddToCart = (item: any) => {
    setPosCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const handleUpdateCartQty = (itemId: string, delta: number) => {
    setPosCart(prev => {
      return prev
        .map(i => i.id === itemId ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0);
    });
  };

  const handleClearCart = () => {
    setPosCart([]);
    setPosDiscount(0);
    setPosTaxEnabled(false);
  };

  const cartSubtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartTax = posTaxEnabled ? Math.round(cartSubtotal * 0.1) : 0;
  const cartTotal = Math.max(0, cartSubtotal + cartTax - posDiscount);
  const cashChange = posPayMethod === 'CASH' ? Math.max(0, posCashTendered - cartTotal) : 0;

  const handleOpenCheckout = () => {
    if (posCart.length === 0) {
      alert('Keranjang kasir masih kosong. Silakan pilih menu/produk terlebih dahulu.');
      return;
    }
    setPosPayMethod('CASH');
    setPosCashTendered(cartTotal);
    setPosDebitRef('');
    setShowPosPaymentModal(true);
  };

  const handlePrintReceipt = (sale: any) => {
    const storeTitle = currentUser?.fullName || (selectedStoreType === 'FOOD' ? 'Resto Kuliner AZ GO' : 'Az Mart Superstore');
    const storeAddress = currentUser?.phone ? `Hubungi: ${currentUser.phone}` : 'Jl. Merdeka Barat No. 12';

    const printWindow = window.open('', '_blank', 'width=380,height=600');
    if (!printWindow) {
      window.print();
      return;
    }

    const itemsHtml = sale.items.map((it: any) => `
      <div style="margin-bottom: 4px;">
        <div style="font-weight: bold;">${it.name}</div>
        <div style="display: flex; justify-content: space-between; font-size: 11px;">
          <span>${it.qty} x Rp ${it.price.toLocaleString('id-ID')}</span>
          <span style="font-weight: bold;">Rp ${(it.qty * it.price).toLocaleString('id-ID')}</span>
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Struk Nota - ${sale.receiptNumber}</title>
        <style>
          @page { size: 58mm auto; margin: 0; }
          body {
            font-family: 'Courier New', Courier, monospace;
            width: 58mm;
            max-width: 100%;
            margin: 0 auto;
            padding: 8px 6px;
            font-size: 11px;
            line-height: 1.3;
            color: #000000;
            background: #ffffff;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .bold { font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 6px 0; }
          .double-divider { border-top: 2px dashed #000; margin: 6px 0; }
          .row { display: flex; justify-content: space-between; margin: 2px 0; }
          @media print {
            body { width: 100%; margin: 0; padding: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="text-center">
          <div class="bold" style="font-size: 13px; text-transform: uppercase;">${storeTitle}</div>
          <div style="font-size: 10px;">${storeAddress}</div>
        </div>
        <div class="divider"></div>
        <div class="row"><span>No. Nota:</span><span class="bold">${sale.receiptNumber}</span></div>
        <div class="row"><span>Waktu:</span><span>${sale.date} ${sale.time}</span></div>
        <div class="row"><span>Kasir:</span><span>${sale.cashierName}</span></div>
        <div class="row"><span>Tipe:</span><span>${sale.orderType === 'DINE_IN' ? `Dine-In (${sale.tableNumber})` : 'Takeaway'}</span></div>
        <div class="row"><span>Pelanggan:</span><span>${sale.customerName}</span></div>
        <div class="divider"></div>
        <div style="margin: 6px 0;">
          ${itemsHtml}
        </div>
        <div class="divider"></div>
        <div class="row"><span>Subtotal:</span><span>Rp ${sale.subtotal.toLocaleString('id-ID')}</span></div>
        ${sale.discount > 0 ? `<div class="row"><span>Diskon:</span><span>-Rp ${sale.discount.toLocaleString('id-ID')}</span></div>` : ''}
        ${sale.tax > 0 ? `<div class="row"><span>Pajak (10%):</span><span>+Rp ${sale.tax.toLocaleString('id-ID')}</span></div>` : ''}
        <div class="double-divider"></div>
        <div class="row bold" style="font-size: 13px;"><span>TOTAL TAGIHAN:</span><span>Rp ${sale.total.toLocaleString('id-ID')}</span></div>
        <div class="divider"></div>
        <div class="row"><span>Metode Bayar:</span><span>${sale.payMethod}</span></div>
        <div class="row"><span>Nominal Bayar:</span><span>Rp ${sale.cashTendered.toLocaleString('id-ID')}</span></div>
        ${sale.payMethod === 'CASH' ? `<div class="row bold"><span>Kembalian:</span><span>Rp ${sale.cashChange.toLocaleString('id-ID')}</span></div>` : ''}
        <div class="double-divider"></div>
        <div class="text-center" style="font-size: 10px; margin-top: 8px;">
          <div>*** TERIMA KASIH ***</div>
          <div>Selamat Menikmati & Datang Kembali</div>
          <div style="margin-top: 5px; font-size: 8px; color: #555;">Powered by AZ GO SuperApp</div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleConfirmPosPayment = (shouldPrint: boolean = false) => {
    if (posPayMethod === 'CASH' && posCashTendered < cartTotal) {
      alert(`Uang tunai yang diterima (Rp ${posCashTendered.toLocaleString('id-ID')}) kurang dari total tagihan (Rp ${cartTotal.toLocaleString('id-ID')}).`);
      return;
    }

    const newSale = {
      id: `pos-${Date.now()}`,
      receiptNumber: `POS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('id-ID'),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      orderType: posOrderType,
      tableNumber: posOrderType === 'DINE_IN' ? posTableNumber : '-',
      customerName: posCustomerName || 'Pelanggan Kasir',
      items: [...posCart],
      subtotal: cartSubtotal,
      discount: posDiscount,
      tax: cartTax,
      total: cartTotal,
      payMethod: posPayMethod,
      cashTendered: posPayMethod === 'CASH' ? posCashTendered : cartTotal,
      cashChange,
      cashierName: currentUser?.fullName || 'Kasir Toko'
    };

    setPosSalesHistory(prev => [newSale, ...prev]);
    setShowPosPaymentModal(false);
    handleClearCart();
    setCompletedPosSale(newSale);

    if (shouldPrint) {
      setTimeout(() => {
        handlePrintReceipt(newSale);
      }, 300);
    }
  };

  const handleShareWhatsAppReceipt = (sale: any, phone: string) => {
    if (!phone || phone.trim().length < 9) {
      alert('Mohon masukkan nomor WhatsApp pelanggan yang valid (contoh: 08123456789).');
      return;
    }
    let clean = phone.trim().replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }

    const storeName = selectedStoreType === 'FOOD' ? 'Ayam Geprek Sambal Bawang Juara' : 'Az Mart Express - Sudirman';
    const itemsText = sale.items.map((it: any) => `• ${it.qty}x ${it.name} = Rp ${(it.qty * it.price).toLocaleString('id-ID')}`).join('\n');

    const msg = `*STRUK DIGITAL AZ GO POS* 🧾
*${storeName}*
----------------------------------------
No. Struk: ${sale.receiptNumber}
Waktu: ${sale.date} ${sale.time} WIB
Tipe: ${sale.orderType === 'DINE_IN' ? `Makan di Tempat (${sale.tableNumber})` : 'Bungkus / Belanja Kasir'}
Kasir: ${sale.cashierName}
----------------------------------------
*Rincian Pembelian:*
${itemsText}
----------------------------------------
Subtotal: Rp ${sale.subtotal.toLocaleString('id-ID')}
${sale.discount > 0 ? `Diskon: -Rp ${sale.discount.toLocaleString('id-ID')}\n` : ''}${sale.tax > 0 ? `Pajak (10%): Rp ${sale.tax.toLocaleString('id-ID')}\n` : ''}*TOTAL BAYAR: Rp ${sale.total.toLocaleString('id-ID')}*
Metode Bayar: ${sale.payMethod === 'CASH' ? `Tunai (Diterima: Rp ${sale.cashTendered.toLocaleString('id-ID')}, Kembali: Rp ${sale.cashChange.toLocaleString('id-ID')})` : sale.payMethod}
----------------------------------------
Terima kasih telah berbelanja di tempat kami! 🙏
_Struk digital ini dibuat otomatis melalui AZGO POS SuperApp._`;

    const url = `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
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

        <button
          onClick={() => setActiveMerchantTab('pos')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeMerchantTab === 'pos' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-400" /> POS Kasir & Bundling
          {posSub?.status === 'ACTIVE' && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white">
              PRO AKTIF
            </span>
          )}
          {posSub?.status === 'TRIAL' && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-500 text-white">
              TRIAL 3 HARI
            </span>
          )}
          {posSub?.status === 'PENDING_APPROVAL' && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white animate-pulse">
              MENUNGGU ACC
            </span>
          )}
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

      {/* ================= TAB 5: POS KASIR & PAKET BUNDLING ================= */}
      {activeMerchantTab === 'pos' && (
        <div className="space-y-6">
          {posNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl font-bold flex items-center gap-2.5 animate-in fade-in duration-200 shadow-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{posNotice}</span>
            </div>
          )}

          {/* KONDISI 1: MITRA BELUM AKTIF BERLANGGANAN / SEDANG MENUNGGU APPROVAL */}
          {(!posSub || posSub.status === 'NONE' || posSub.status === 'EXPIRED' || posSub.status === 'REJECTED' || posSub.status === 'PENDING_APPROVAL') ? (
            <div className="space-y-6">
              {/* Showcase Banner */}
              <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-emerald-700/30">
                <div className="relative z-10 max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Paket Bundling POS & Laporan Keuangan Toko</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Kelola Penjualan Kasir Offline & Online Dalam Satu Layar
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Tingkatkan efisiensi {selectedStoreType === 'FOOD' ? 'Restoran / Rumah Makan' : 'Toko / Mart'} Anda dengan sistem POS kasir meja, cetak struk thermal, hitung kembalian cepat, dan laporan keuangan terpadu yang menggabungkan penjualan kasir offline langsung dengan pesanan online AZ GO.
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-10 pointer-events-none">
                  <Receipt className="w-64 h-64 text-emerald-400" />
                </div>
              </div>

              {/* 4 Feature Highlights */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Kasir Meja & Bungkus</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Catat pesanan Dine-In per nomor meja atau Takeaway dengan kalkulasi harga instan.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Printer className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Struk Bluetooth & WA</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Cetak struk lewat printer thermal atau kirim struk digital langsung ke nomor WhatsApp pembeli.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs">QRIS & Uang Pas</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Kalkulator hitung kembalian otomatis serta barcode QRIS kasir dinamis/statis.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Laporan 1 Pintu</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Rekapitulasi otomatis gabungan omset pesanan online delivery dan penjualan offline kasir.
                  </p>
                </div>
              </div>

              {/* Status Alert if Pending Approval */}
              {posSub?.status === 'PENDING_APPROVAL' && (
                <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-3xl text-amber-950 space-y-2 shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-black text-sm text-amber-900">
                    <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                    <span>⏳ Permohonan Paket Bundling POS Sedang Diverifikasi Owner/Admin</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Anda telah mengajukan <strong>{posSub.packageType === 'MONTHLY' ? `Paket Bulanan (Rp ${posPricing.monthlyPrice.toLocaleString('id-ID')})` : `Paket Tahunan (Rp ${posPricing.annualPrice.toLocaleString('id-ID')})`}</strong> pada {new Date(posSub.requestedAt).toLocaleDateString('id-ID')}.
                    Owner / Administrator AZ GO sedang memvalidasi mutasi bukti pembayaran Anda. Begitu disetujui, modul POS Kasir akan otomatis aktif dan dapat langsung digunakan.
                  </p>
                  <div className="text-[11px] text-amber-700 font-medium">
                    Catatan: Jika butuh aktivasi segera, hubungi Admin melalui Call Center / WhatsApp resmi AZ GO.
                  </div>
                </div>
              )}

              {/* 3 Package Tier Cards */}
              <div>
                <div className="text-center max-w-md mx-auto mb-6 space-y-1">
                  <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                    Pilih Paket Bundling Sesuai Kebutuhan Usaha Anda
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tersedia masa percobaan 3 hari gratis tanpa biaya bagi mitra yang ingin mencoba terlebih dahulu!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* TIER 1: TRIAL 3 HARI */}
                  <div className={`p-6 rounded-3xl border-2 transition relative flex flex-col justify-between ${
                    selectedPosPkg === 'TRIAL_3_DAYS' 
                      ? 'border-blue-500 bg-blue-50/40 shadow-lg ring-2 ring-blue-400/20' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Uji Coba Gratis
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 text-lg">Masa Percobaan {posPricing.trialDays} Hari</h4>
                        <p className="text-xs text-slate-500">Coba semua fitur kasir & laporan tanpa risiko</p>
                      </div>

                      <div className="py-2 border-y border-slate-100">
                        <span className="text-3xl font-black text-slate-900">GRATIS</span>
                        <span className="text-xs text-slate-400 block mt-0.5">Masa aktif {posPricing.trialDays} hari penuh</span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Akses penuh seluruh fitur kasir POS</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Cetak struk & kirim via WhatsApp</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Laporan gabungan offline & online</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Aktivasi otomatis kilat (Langsung aktif)</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      disabled={posSubmitLoading || posSub?.status === 'PENDING_APPROVAL'}
                      onClick={() => handleRequestPosSubscription('TRIAL_3_DAYS')}
                      className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{posSubmitLoading ? 'Mengaktifkan...' : `Mulai Coba Gratis ${posPricing.trialDays} Hari`}</span>
                    </button>
                  </div>

                  {/* TIER 2: BULANAN */}
                  <div className={`p-6 rounded-3xl border-2 transition relative flex flex-col justify-between ${
                    selectedPosPkg === 'MONTHLY' 
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-lg ring-2 ring-emerald-500/20' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Fleksibel
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 text-lg">Paket Bulanan</h4>
                        <p className="text-xs text-slate-500">Bayar per bulan sesuai pemakaian toko</p>
                      </div>

                      <div className="py-2 border-y border-slate-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">Rp {posPricing.monthlyPrice.toLocaleString('id-ID')}</span>
                          <span className="text-xs text-slate-400 font-semibold">/ bulan</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">Masa aktif 30 hari</span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Transaksi kasir offline tanpa batas</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Dukungan printer Bluetooth & WhatsApp</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Rekapitulasi keuangan harian & bulanan</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Bantuan teknis & update sistem gratis</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPosPkg('MONTHLY')}
                      className={`mt-6 w-full py-3 rounded-2xl text-xs font-bold transition shadow-sm ${
                        selectedPosPkg === 'MONTHLY'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {selectedPosPkg === 'MONTHLY' ? '✓ Paket Terpilih' : 'Pilih Paket Bulanan'}
                    </button>
                  </div>

                  {/* TIER 3: TAHUNAN (PALING HEMAT) */}
                  <div className={`p-6 rounded-3xl border-2 transition relative flex flex-col justify-between ${
                    selectedPosPkg === 'ANNUAL' 
                      ? 'border-amber-500 bg-amber-50/40 shadow-xl ring-2 ring-amber-400/20' 
                      : 'border-amber-300 bg-white hover:border-amber-400'
                  }`}>
                    <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                      🔥 Hemat Rp {(posPricing.monthlyPrice * 12 - posPricing.annualPrice).toLocaleString('id-ID')}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Paling Hemat
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 text-lg">Paket Tahunan</h4>
                        <p className="text-xs text-slate-500">Bayar 10 bulan gratis 2 bulan penuh</p>
                      </div>

                      <div className="py-2 border-y border-slate-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">Rp {posPricing.annualPrice.toLocaleString('id-ID')}</span>
                          <span className="text-xs text-slate-400 font-semibold">/ tahun</span>
                        </div>
                        <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                          Setara Rp {Math.round(posPricing.annualPrice / 12).toLocaleString('id-ID')} / bulan (Masa aktif 365 hari)
                        </span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Semua fitur lengkap paket bulanan</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Gratis biaya setup & aktivasi akun</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Prioritas bantuan teknis Owner / Admin</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Jaminan harga langganan terkunci 1 tahun</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPosPkg('ANNUAL')}
                      className={`mt-6 w-full py-3 rounded-2xl text-xs font-bold transition shadow-sm ${
                        selectedPosPkg === 'ANNUAL'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {selectedPosPkg === 'ANNUAL' ? '✓ Paket Terpilih' : 'Pilih Paket Tahunan'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Pembayaran & Upload Bukti Transfer (Ketika Memilih Bulanan / Tahunan) */}
              {(selectedPosPkg === 'MONTHLY' || selectedPosPkg === 'ANNUAL') && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-md space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        Pembayaran & Konfirmasi Aktivasi: {selectedPosPkg === 'MONTHLY' ? `Paket Bulanan (Rp ${posPricing.monthlyPrice.toLocaleString('id-ID')})` : `Paket Tahunan (Rp ${posPricing.annualPrice.toLocaleString('id-ID')})`}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Lakukan pembayaran sesuai nominal paket, lalu unggah bukti transfer untuk disetujui Owner / Admin.
                      </p>
                    </div>
                    <span className="text-xl font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      Rp {selectedPosPkg === 'MONTHLY' ? posPricing.monthlyPrice.toLocaleString('id-ID') : posPricing.annualPrice.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Rekening Tujuan Pembayaran */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div 
                      onClick={() => setPosPaymentMethod('TRANSFER_BANK')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-2 ${
                        posPaymentMethod === 'TRANSFER_BANK' ? 'bg-blue-50/70 border-blue-500 shadow-sm' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="font-bold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-blue-600" /> Transfer Rekening Bank (BCA)
                        </span>
                        {posPaymentMethod === 'TRANSFER_BANK' && (
                          <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Dipilih</span>
                        )}
                      </span>
                      <div className="space-y-1 font-mono text-[11px] text-slate-800">
                        <div>Bank: <strong>BCA</strong></div>
                        <div>No. Rekening: <strong>8830-192-831</strong></div>
                        <div>Atas Nama: <strong>PT AZ GO SUPERAPP INDONESIA</strong></div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setPosPaymentMethod('QRIS')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-2 ${
                        posPaymentMethod === 'QRIS' ? 'bg-rose-50/70 border-rose-500 shadow-sm' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="font-bold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-rose-600" /> Scan QRIS Resmi AZ GO
                        </span>
                        {posPaymentMethod === 'QRIS' && (
                          <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">Dipilih</span>
                        )}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Bisa di-scan dari aplikasi BCA, Mandiri, GoPay, OVO, ShopeePay, DANA, atau Livin'.
                      </p>
                      <div className="text-[11px] font-mono text-slate-700">
                        NMID: <strong>ID1029384756209</strong> (AZ GO KASIR)
                      </div>
                    </div>
                  </div>

                  {/* Upload Bukti Pembayaran */}
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 text-xs">
                      Unggah Bukti Transfer / Pembayaran (Foto / Screenshot m-Banking)
                    </label>
                    <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/20 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition text-center group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPosProof}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 group-hover:scale-110 flex items-center justify-center transition mb-2 shadow-sm">
                        <Upload className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-bold text-slate-700 text-xs group-hover:text-emerald-700 transition">
                        {posPaymentProofName ? `Berkas Terpilih: ${posPaymentProofName}` : 'Klik untuk Pilih Foto Bukti Transfer'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Format JPG, PNG, atau WEBP (Maksimal 5 MB)
                      </span>
                    </label>

                    {posPaymentProofUrl && (
                      <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px]">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Foto bukti berhasil dimuat dan siap dikirim ke Owner/Admin.</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={posSubmitLoading || !posPaymentProofUrl}
                    onClick={() => handleRequestPosSubscription(selectedPosPkg)}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{posSubmitLoading ? 'Mengirim Bukti...' : 'Kirim Bukti Pembayaran untuk Persetujuan Admin'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* KONDISI 2: MITRA SUDAH MEMILIKI AKSES AKTIF (TRIAL ATAU BERLANGGANAN) */
            <div className="space-y-5">
              {/* POS Status Header */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-inner">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-slate-900 text-base">AZGO POS Kasir Pintar</h3>
                      {posSub.status === 'TRIAL' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          Masa Uji Coba 3 Hari Aktif
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          Paket {posSub.packageType === 'ANNUAL' ? 'Tahunan' : 'Bulanan'} Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {posSub.endDate ? (
                        <>Berlaku sampai: <strong>{new Date(posSub.endDate).toLocaleDateString('id-ID')}</strong> ({Math.max(0, Math.ceil((new Date(posSub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} hari lagi)</>
                      ) : (
                        'Masa aktif aktif tanpa batas'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Perpanjang / Upgrade Paket</span>
                  </button>

                  {/* Switch Sub-View POS */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setPosSubView('CASHIER')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        posSubView === 'CASHIER' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Kasir / Kasir Meja</span>
                    </button>
                    <button
                      onClick={() => setPosSubView('REPORTS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        posSubView === 'REPORTS' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Laporan Keuangan</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= SUB-VIEW 1: LAYAR KASIR TRANSAKSI ================= */}
              {posSubView === 'CASHIER' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Kolom Kiri / Tengah: Katalog Menu & Pilihan Meja */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Setup Tipe Order */}
                    <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-slate-500">Tipe Pesanan Kasir:</span>
                        <div className="flex gap-2">
                          {selectedStoreType === 'FOOD' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setPosOrderType('DINE_IN')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                  posOrderType === 'DINE_IN'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                <span>🍽️ Makan di Tempat (Dine-In)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPosOrderType('TAKEAWAY')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                  posOrderType === 'TAKEAWAY'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                <span>🛍️ Bungkus (Takeaway)</span>
                              </button>
                            </>
                          ) : (
                            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-100 text-blue-800">
                              🛒 Belanja Kasir Toko / Mart
                            </span>
                          )}
                        </div>
                      </div>

                      {posOrderType === 'DINE_IN' && selectedStoreType === 'FOOD' && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Nomor Meja</label>
                            <input
                              type="text"
                              placeholder="Contoh: Meja 04"
                              value={posTableNumber}
                              onChange={e => setPosTableNumber(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Pembeli (Opsional)</label>
                            <input
                              type="text"
                              placeholder="Nama tamu"
                              value={posCustomerName}
                              onChange={e => setPosCustomerName(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Cari menu, makanan, produk, atau barcode..."
                          value={posSearchQuery}
                          onChange={e => setPosSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-slate-900"
                        />
                      </div>

                      {/* Grid Item Katalog */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {menuItems
                          .filter(it => it.name.toLowerCase().includes(posSearchQuery.toLowerCase()))
                          .map(item => {
                            const cartCount = posCart.find(c => c.id === item.id)?.qty || 0;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleAddToCart(item)}
                                className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between group ${
                                  cartCount > 0 
                                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm'
                                }`}
                              >
                                {cartCount > 0 && (
                                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shadow-md animate-in zoom-in-50">
                                    {cartCount}
                                  </span>
                                )}

                                <div className="space-y-1">
                                  <span className="text-xl block">
                                    {selectedStoreType === 'FOOD' ? '🍛' : '📦'}
                                  </span>
                                  <h5 className="font-extrabold text-slate-900 text-xs line-clamp-2 leading-snug">
                                    {item.name}
                                  </h5>
                                </div>

                                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between w-full">
                                  <span className="font-black text-slate-900 text-xs">
                                    Rp {item.price.toLocaleString('id-ID')}
                                  </span>
                                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center font-bold text-xs transition">
                                    +
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                      </div>

                      {menuItems.filter(it => it.name.toLowerCase().includes(posSearchQuery.toLowerCase())).length === 0 && (
                        <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                          <p>Menu / produk "{posSearchQuery}" tidak ditemukan.</p>
                          <button
                            type="button"
                            onClick={() => {
                              handleAddToCart({
                                id: `item-custom-${Date.now()}`,
                                name: posSearchQuery || 'Item Kasir Manual',
                                price: 15000
                              });
                              setPosSearchQuery('');
                            }}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 hover:bg-emerald-100 transition"
                          >
                            + Tambahkan "{posSearchQuery || 'Item Manual'}" Langsung ke Kasir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kolom Kanan: Tiket Pesanan Kasir (Order Cart) */}
                  <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-slate-200 shadow-md p-5 space-y-4 sticky top-6">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tiket Kasir Aktif</span>
                        <h4 className="font-black text-slate-900 text-sm">
                          {posOrderType === 'DINE_IN' ? `Makan di Tempat (${posTableNumber || 'Meja 01'})` : 'Bungkus / Takeaway'}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </div>

                    {/* List Item dalam Keranjang Kasir */}
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {posCart.map(item => (
                        <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                          <div className="space-y-0.5 max-w-[55%]">
                            <p className="font-bold text-slate-900 truncate">{item.name}</p>
                            <span className="text-[11px] text-slate-500 font-mono">
                              @Rp {item.price.toLocaleString('id-ID')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 bg-white rounded-xl border border-slate-200 p-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateCartQty(item.id, -1)}
                                className="w-5 h-5 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-black text-slate-900">{item.qty}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateCartQty(item.id, 1)}
                                className="w-5 h-5 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-black text-slate-900 text-xs min-w-[70px] text-right">
                              Rp {(item.qty * item.price).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      ))}

                      {posCart.length === 0 && (
                        <div className="p-8 text-center space-y-2 text-slate-400">
                          <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                          <p className="font-bold text-xs">Keranjang kasir masih kosong</p>
                          <p className="text-[11px]">Pilih menu makanan atau produk di samping untuk memulai transaksi</p>
                        </div>
                      )}
                    </div>

                    {/* Diskon & Pajak PB1 */}
                    <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Diskon / Potongan (Rp):</span>
                        <input
                          type="number"
                          min="0"
                          value={posDiscount}
                          onChange={e => setPosDiscount(parseInt(e.target.value) || 0)}
                          className="w-28 px-2.5 py-1 text-right rounded-lg border border-slate-300 font-bold"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Pajak Resto PB1 (10%):</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={posTaxEnabled}
                            onChange={e => setPosTaxEnabled(e.target.checked)}
                            className="rounded accent-emerald-600 w-4 h-4"
                          />
                          <span className="font-bold text-slate-700">
                            {posTaxEnabled ? `+Rp ${cartTax.toLocaleString('id-ID')}` : 'Nonaktif'}
                          </span>
                        </label>
                      </div>

                      <div className="pt-2 border-t border-slate-200 space-y-1">
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>Subtotal Item:</span>
                          <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
                        </div>
                        {posDiscount > 0 && (
                          <div className="flex justify-between text-rose-600 text-[11px] font-bold">
                            <span>Diskon:</span>
                            <span>-Rp {posDiscount.toLocaleString('id-ID')}</span>
                          </div>
                        )}
                        {posTaxEnabled && (
                          <div className="flex justify-between text-slate-600 text-[11px]">
                            <span>Pajak (10%):</span>
                            <span>+Rp {cartTax.toLocaleString('id-ID')}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-baseline pt-1">
                          <span className="font-black text-slate-900 text-sm">TOTAL TAGIHAN:</span>
                          <span className="font-black text-emerald-700 text-xl">
                            Rp {cartTotal.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout & Clear Buttons */}
                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={handleClearCart}
                        disabled={posCart.length === 0}
                        className="py-3 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition disabled:opacity-50"
                        title="Kosongkan keranjang"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenCheckout}
                        disabled={posCart.length === 0}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>Bayar Sekarang (Rp {cartTotal.toLocaleString('id-ID')})</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUB-VIEW 2: LAPORAN KEUANGAN TERPADU ================= */}
              {posSubView === 'REPORTS' && (
                <div className="space-y-6">
                  {/* Integrated Report Header */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider block">
                          Laporan Keuangan Terpadu 1 Pintu
                        </span>
                        <h3 className="font-black text-slate-900 text-lg">
                          Rekap Penjualan Kasir Offline & Pesanan Online AZ GO
                        </h3>
                        <p className="text-xs text-slate-400">
                          Data transaksi real-time per hari ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert('🖨️ Mencetak Rekap Harian Z-Report Kasir ke printer thermal...')}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
                      >
                        <Printer className="w-4 h-4 text-emerald-400" />
                        <span>Cetak Rekap Kasir (Z-Report)</span>
                      </button>
                    </div>

                    {/* Integrated KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {/* 1. Offline POS Sales */}
                      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <Receipt className="w-4 h-4 text-emerald-600" /> Penjualan Kasir Offline (POS)
                        </span>
                        <p className="text-2xl font-black text-emerald-950">
                          Rp {posSalesHistory.reduce((sum, s) => sum + s.total, 0).toLocaleString('id-ID')}
                        </p>
                        <span className="text-[11px] text-emerald-700 font-medium block">
                          Total {posSalesHistory.length} transaksi kasir toko
                        </span>
                      </div>

                      {/* 2. Online AZGO Orders */}
                      <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-1">
                        <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                          <ChefHat className="w-4 h-4 text-indigo-600" /> Pesanan Online AZ GO Delivery
                        </span>
                        <p className="text-2xl font-black text-indigo-950">
                          Rp {orders.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + o.total, 0).toLocaleString('id-ID')}
                        </p>
                        <span className="text-[11px] text-indigo-700 font-medium block">
                          Total {orders.filter(o => o.status === 'COMPLETED').length} pesanan online selesai
                        </span>
                      </div>

                      {/* 3. Combined Total */}
                      <div className="p-4 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl border border-slate-800 space-y-1 shadow-md">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-400" /> TOTAL OMSET BERSIH TOKO
                        </span>
                        <p className="text-2xl font-black text-white">
                          Rp {(
                            posSalesHistory.reduce((sum, s) => sum + s.total, 0) +
                            orders.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + o.total, 0)
                          ).toLocaleString('id-ID')}
                        </p>
                        <span className="text-[11px] text-slate-300 font-medium block">
                          Gabungan offline kasir + online delivery
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Riwayat Struk POS Hari Ini */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <History className="w-4 h-4 text-emerald-600" />
                      Riwayat Transaksi Kasir Toko Hari Ini ({posSalesHistory.length})
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-400 uppercase font-black text-[10px] tracking-wider border-y border-slate-100">
                          <tr>
                            <th className="py-3 px-3">Jam & No. Struk</th>
                            <th className="py-3 px-3">Tipe / Meja</th>
                            <th className="py-3 px-3">Pelanggan</th>
                            <th className="py-3 px-3">Item Pembelian</th>
                            <th className="py-3 px-3">Metode Bayar</th>
                            <th className="py-3 px-3 text-right">Total Bayar</th>
                            <th className="py-3 px-3 text-center">Aksi Struk</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {posSalesHistory.map(sale => (
                            <tr key={sale.id} className="hover:bg-slate-50 transition">
                              <td className="py-3.5 px-3">
                                <span className="font-bold text-slate-900 block font-mono">{sale.receiptNumber}</span>
                                <span className="text-[10px] text-slate-400">{sale.time} WIB</span>
                              </td>
                              <td className="py-3.5 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  sale.orderType === 'DINE_IN' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                                }`}>
                                  {sale.orderType === 'DINE_IN' ? `Makan (${sale.tableNumber})` : 'Bungkus'}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 font-medium text-slate-700">
                                {sale.customerName || 'Walk-In'}
                              </td>
                              <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate">
                                {sale.items.map((it: any) => `${it.qty}x ${it.name}`).join(', ')}
                              </td>
                              <td className="py-3.5 px-3">
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                                  {sale.payMethod}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-right font-black text-slate-900">
                                Rp {sale.total.toLocaleString('id-ID')}
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => setCompletedPosSale(sale)}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition"
                                >
                                  <Receipt className="w-3 h-3 text-slate-500" />
                                  <span>Buka Struk</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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

      {/* ================= MODAL PEMBAYARAN KASIR POS ================= */}
      {showPosPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  Pembayaran Kasir
                </h3>
                <p className="text-[11px] text-slate-400">
                  {posOrderType === 'DINE_IN' ? `Makan di Tempat (${posTableNumber || 'Meja 01'})` : 'Bungkus / Takeaway'}
                </p>
              </div>
              <button 
                onClick={() => setShowPosPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Display */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl text-center space-y-1">
              <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">Total Tagihan Pembeli</span>
              <p className="text-3xl font-black text-emerald-400">
                Rp {cartTotal.toLocaleString('id-ID')}
              </p>
            </div>

            {/* Pilihan Metode Bayar */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPosPayMethod('CASH')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                  posPayMethod === 'CASH'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Tunai (Cash)</span>
              </button>
              <button
                type="button"
                onClick={() => setPosPayMethod('QRIS')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                  posPayMethod === 'QRIS'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>QRIS</span>
              </button>
              <button
                type="button"
                onClick={() => setPosPayMethod('DEBIT')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                  posPayMethod === 'DEBIT'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Debit / EDC</span>
              </button>
            </div>

            {/* Form Input Sesuai Metode */}
            {posPayMethod === 'CASH' && (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Uang Tunai Diterima (Rp)
                  </label>
                  <input
                    type="number"
                    value={posCashTendered}
                    onChange={e => setPosCashTendered(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-base font-black text-slate-900"
                  />
                </div>

                {/* Quick Cash Buttons */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setPosCashTendered(cartTotal)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold"
                  >
                    Uang Pas
                  </button>
                  {[20000, 50000, 100000, 200000].filter(n => n >= cartTotal).map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPosCashTendered(amt)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold"
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>

                {/* Kembalian Display */}
                <div className={`p-3 rounded-2xl border text-xs flex justify-between items-center ${
                  cashChange >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <span className="font-bold">Kembalian:</span>
                  <span className="font-black text-sm">
                    {cashChange >= 0 
                      ? `Rp ${cashChange.toLocaleString('id-ID')}` 
                      : `Kurang Rp ${Math.abs(posCashTendered - cartTotal).toLocaleString('id-ID')}`}
                  </span>
                </div>
              </div>
            )}

            {posPayMethod === 'QRIS' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2 text-xs">
                <QrCode className="w-24 h-24 text-slate-800 mx-auto" />
                <p className="font-bold text-slate-800 text-xs">Arahkan Pelanggan untuk Scan Barcode QRIS</p>
                <p className="text-[11px] text-slate-500">
                  Pembayaran akan masuk langsung ke saldo kasir toko secara otomatis.
                </p>
              </div>
            )}

            {posPayMethod === 'DEBIT' && (
              <div className="space-y-2 pt-2 text-xs">
                <label className="block font-bold text-slate-700">Nomor Referensi Mesin EDC / Approval Code</label>
                <input
                  type="text"
                  placeholder="Contoh: REF-BCA-88992"
                  value={posDebitRef}
                  onChange={e => setPosDebitRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            )}

            <div className="pt-3 space-y-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirmPosPayment(true)}
                  className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs shadow-lg transition flex items-center justify-center gap-2 group ring-2 ring-slate-900/10 active:scale-[0.98]"
                >
                  <Printer className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                  <div className="text-left">
                    <span className="block leading-tight font-black">Print Nota & Selesai</span>
                    <span className="text-[10px] text-slate-300 font-normal">Cetak struk fisik</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmPosPayment(false)}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-lg transition flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                  <Check className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
                  <div className="text-left">
                    <span className="block leading-tight font-black">Selesai (Tanpa Print)</span>
                    <span className="text-[10px] text-emerald-100 font-normal">Simpan transaksi</span>
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowPosPaymentModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition"
              >
                Batal / Kembali ke Kasir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL STRUK DIGITAL & SHARE WHATSAPP ================= */}
      {completedPosSale && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Thermal Struk */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-[11px] space-y-2.5 text-slate-800">
              <div className="text-center space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                <h4 className="font-black text-sm uppercase text-slate-900">
                  {selectedStoreType === 'FOOD' ? 'Ayam Geprek Juara' : 'Az Mart Sudirman'}
                </h4>
                <p className="text-[10px] text-slate-500">Jl. Merdeka Barat No. 12</p>
                <p className="text-[10px] text-slate-500">No: {completedPosSale.receiptNumber}</p>
                <p className="text-[10px] text-slate-400">{completedPosSale.date} {completedPosSale.time} WIB</p>
                <p className="text-[10px] font-bold text-slate-600">
                  {completedPosSale.orderType === 'DINE_IN' ? `Dine-In (${completedPosSale.tableNumber})` : 'Takeaway'} • Kasir: {completedPosSale.cashierName}
                </p>
              </div>

              {/* Items Struk */}
              <div className="space-y-1 py-1 border-b border-dashed border-slate-300">
                {completedPosSale.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start">
                    <span>{it.qty}x {it.name}</span>
                    <span className="font-bold shrink-0">Rp {(it.qty * it.price).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              {/* Calculation */}
              <div className="space-y-0.5 pt-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>Rp {completedPosSale.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {completedPosSale.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Diskon:</span>
                    <span>-Rp {completedPosSale.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {completedPosSale.tax > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Pajak (10%):</span>
                    <span>+Rp {completedPosSale.tax.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-xs text-slate-900 pt-1 border-t border-slate-300">
                  <span>TOTAL:</span>
                  <span>Rp {completedPosSale.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[10px] pt-0.5">
                  <span>Bayar ({completedPosSale.payMethod}):</span>
                  <span>Rp {completedPosSale.cashTendered.toLocaleString('id-ID')}</span>
                </div>
                {completedPosSale.payMethod === 'CASH' && (
                  <div className="flex justify-between text-slate-700 text-[10px] font-bold">
                    <span>Kembalian:</span>
                    <span>Rp {completedPosSale.cashChange.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              <div className="text-center pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-400">
                <p>Terima kasih atas kunjungan Anda!</p>
                <p>Powered by AZGO POS SuperApp</p>
              </div>
            </div>

            {/* Action Buttons: Cetak & Share WhatsApp */}
            <div className="space-y-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => handlePrintReceipt(completedPosSale)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Cetak Ulang Struk Thermal (Bluetooth)</span>
              </button>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-[11px]">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Kirim Struk Digital via WhatsApp
                </span>
                <div className="flex gap-1.5">
                  <input
                    type="tel"
                    placeholder="No. WhatsApp (0812xxxx)"
                    value={buyerWaPhone}
                    onChange={e => setBuyerWaPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleShareWhatsAppReceipt(completedPosSale, buyerWaPhone)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shrink-0 transition"
                  >
                    Kirim
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCompletedPosSale(null);
                  setBuyerWaPhone('');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-center"
              >
                Transaksi Baru (Selesai)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL PERPANJANG / UPGRADE PAKET POS ================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Perpanjang / Upgrade Paket POS
                </h3>
                <p className="text-xs text-slate-500">Pilih perpanjangan bulanan atau tahunan</p>
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label
                onClick={() => setSelectedPosPkg('MONTHLY')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex justify-between items-center transition ${
                  selectedPosPkg === 'MONTHLY' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                }`}
              >
                <div>
                  <h5 className="font-extrabold text-slate-900">Paket Bulanan (30 Hari)</h5>
                  <p className="text-[11px] text-slate-500">Fleksibel bayar bulanan</p>
                </div>
                <span className="font-black text-slate-900 text-sm">Rp {posPricing.monthlyPrice.toLocaleString('id-ID')}</span>
              </label>

              <label
                onClick={() => setSelectedPosPkg('ANNUAL')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex justify-between items-center transition ${
                  selectedPosPkg === 'ANNUAL' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-extrabold text-slate-900">Paket Tahunan (365 Hari)</h5>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-200 text-amber-900">
                      HEMAT Rp {(posPricing.monthlyPrice * 12 - posPricing.annualPrice).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Setara Rp {Math.round(posPricing.annualPrice / 12).toLocaleString('id-ID')} / bulan</p>
                </div>
                <span className="font-black text-slate-900 text-sm">Rp {posPricing.annualPrice.toLocaleString('id-ID')}</span>
              </label>
            </div>

            {/* Upload bukti transfer */}
            <div className="space-y-2 text-xs pt-1">
              <label className="block font-bold text-slate-700">Unggah Bukti Transfer Bank / QRIS</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPosProof}
                className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800"
              />
              {posPaymentProofName && (
                <p className="text-[11px] text-emerald-700 font-semibold">✓ {posPaymentProofName}</p>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={posSubmitLoading || !posPaymentProofUrl}
                onClick={() => handleRequestPosSubscription(selectedPosPkg)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
              >
                {posSubmitLoading ? 'Mengirim...' : 'Kirim Pengajuan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
