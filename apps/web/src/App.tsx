import React, { useState, useEffect, useMemo } from 'react';
import { User, PartnerType } from '@delivery/shared';
import { api } from './services/apiClient';
import { Navbar } from './components/Navbar';
import { ServiceGrid } from './components/ServiceGrid';
import { FoodOrdering } from './features/food/FoodOrdering';
import { ExpeditionHub } from './features/expedition/ExpeditionHub';
import { CargoBooking } from './features/cargo/CargoBooking';
import { MartShopping } from './features/mart/MartShopping';
import { PickupRequest } from './features/pickup/PickupRequest';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { DriverPortal } from './features/driver/DriverPortal';
import { MerchantPortal } from './features/merchant/MerchantPortal';
import { LoginModal } from './features/auth/LoginModal';
import { ChangePasswordModal } from './features/auth/ChangePasswordModal';
import { PartnerRegistrationModal } from './features/partner/PartnerRegistrationModal';
import { CustomerOrderTrackingModal, CustomerOrder } from './features/customer/CustomerOrderTrackingModal';
import { DemoBanner } from './components/DemoBanner';

const DEFAULT_DEMO_ORDERS: CustomerOrder[] = [
  {
    orderNumber: 'AZD-894215',
    serviceType: 'FOOD',
    serviceName: 'Az Food — Ayam Geprek Juara Surabaya',
    merchantName: 'Ayam Geprek Juara Surabaya',
    pickupAddress: 'Jl. Pemuda No. 45, Genteng, Surabaya',
    dropoffAddress: 'Jl. Basuki Rahmat No. 12, Surabaya',
    items: [
      { name: 'Paket Geprek Sambal Korek Super Pedas Level 5', quantity: 2, price: 24000 },
      { name: 'Es Teh Manis Jumbo Segar', quantity: 2, price: 6000 }
    ],
    totalAmount: 70000,
    paymentMethod: 'Tunai saat pesanan tiba (COD)',
    distanceKm: 2.4,
    customerName: 'Siti Rahma',
    customerPhone: '081299887766',
    createdAt: new Date().toISOString(),
    status: 'ON_THE_WAY',
    driverInfo: {
      name: 'Rudi Hartono',
      phone: '081234567890',
      vehicleType: 'MOTOR',
      vehiclePlate: 'L 4921 AZG (Honda Vario 160)',
      rating: 4.9,
      currentLocation: { lat: -7.2655, lng: 112.7485 },
      etaMinutes: 7
    }
  }
];

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('azgo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [trackedAwb, setTrackedAwb] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [loginTargetMessage, setLoginTargetMessage] = useState('');
  const [pendingActionAfterLogin, setPendingActionAfterLogin] = useState<(() => void) | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerModalType, setPartnerModalType] = useState<PartnerType>('DRIVER');
  const [servicesConfig, setServicesConfig] = useState<any[]>([]);

  // Hak Akses Pelacakan: Hanya Admin Utama, Pelanggan pemesan, dan Mitra Toko/Resto pengirim
  const canTrack = Boolean(
    currentUser && (
      currentUser.role === 'ADMIN' ||
      currentUser.role === 'CUSTOMER' ||
      currentUser.role === 'MERCHANT'
    )
  );

  // Mode Aplikasi: Demo vs Real (Live)
  // Jika VITE_APP_MODE='production', fitur demo dinonaktifkan total untuk link live operasional
  const isProductionDeployment = (import.meta as any).env?.VITE_APP_MODE === 'production';
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    if (isProductionDeployment) return false;
    const saved = localStorage.getItem('azgo_demo_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const handleToggleDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    localStorage.setItem('azgo_demo_mode', String(enabled));
  };

  // Customer Order Tracking State
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('azgo_customer_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DEMO_ORDERS;
  });

  const handleResetDemoData = () => {
    setCustomerOrders(DEFAULT_DEMO_ORDERS);
    localStorage.setItem('azgo_customer_orders', JSON.stringify(DEFAULT_DEMO_ORDERS));
  };

  const handleQuickLogin = async (email: string, pass: string) => {
    try {
      const res = await api.login(email, pass);
      if (res.success && res.data?.user) {
        handleLoginSuccess(res.data.user);
      } else {
        alert(res.message || 'Login demo gagal.');
      }
    } catch (err: any) {
      alert('Gagal menghubungi server untuk login demo: ' + (err.message || 'Network error'));
    }
  };

  // Filter pesanan yang berhak dilacak oleh user yang sedang login
  const userTrackableOrders = useMemo(() => {
    if (!currentUser || !canTrack) return [];
    if (currentUser.role === 'ADMIN') return customerOrders;
    if (currentUser.role === 'CUSTOMER') {
      return customerOrders.filter(o => 
        !o.customerPhone || 
        o.customerPhone === currentUser.phone || 
        o.customerName?.toLowerCase() === currentUser.fullName?.toLowerCase() ||
        currentUser.email?.includes('cust')
      );
    }
    if (currentUser.role === 'MERCHANT') {
      return customerOrders.filter(o => 
        o.serviceType === 'FOOD' || 
        o.serviceType === 'MART' ||
        currentUser.email?.includes('resto') ||
        currentUser.email?.includes('mart')
      );
    }
    return [];
  }, [currentUser, canTrack, customerOrders]);

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<CustomerOrder | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('azgo_customer_orders', JSON.stringify(customerOrders));
    } catch {}
  }, [customerOrders]);

  const handleOrderCreated = (order: CustomerOrder) => {
    setCustomerOrders(prev => [order, ...prev.filter(o => o.orderNumber !== order.orderNumber)]);
  };

  const handleTrackOrder = (order: CustomerOrder) => {
    setActiveTrackingOrder(order);
    setShowTrackingModal(true);
  };

  const handleRequestLogin = (msg: string, callback?: () => void) => {
    setLoginTargetMessage(msg);
    if (callback) {
      setPendingActionAfterLogin(() => callback);
    } else {
      setPendingActionAfterLogin(null);
    }
    setShowLoginModal(true);
  };

  const fetchServices = async () => {
    try {
      const res = await api.getAdminServices();
      if (res?.success && Array.isArray(res.data)) {
        setServicesConfig(res.data);
      }
    } catch (err) {
      console.error('Error fetching services config:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const isServiceActive = (serviceKey: string) => {
    if (!servicesConfig || servicesConfig.length === 0) return true;
    const s = servicesConfig.find(
      c => c.id.toLowerCase() === serviceKey.toLowerCase() ||
           c.id.toLowerCase() === `az_${serviceKey}`.toLowerCase() ||
           c.id.toLowerCase().replace('az_', '') === serviceKey.toLowerCase()
    );
    return !s || (s.isActive !== false && s.isEnabled !== false);
  };

  const handleQuickTrack = (awb: string) => {
    if (!canTrack) {
      setLoginTargetMessage('Silakan masuk terlebih dahulu. Fitur pelacakan resi hanya dapat diakses oleh Admin, Pelanggan pemesan, dan Mitra Toko pengirim.');
      setShowLoginModal(true);
      return;
    }
    setTrackedAwb(awb);
    setActiveTab('tracking');
  };

  // RBAC Navigation Guard & Service Availability Check
  const handleSelectTab = (targetTab: string) => {
    const serviceKeys = ['delivery', 'courier', 'express', 'cargo', 'mart', 'pickup', 'tracking'];
    if (serviceKeys.includes(targetTab)) {
      if (!isServiceActive(targetTab)) {
        alert('Mohon maaf, layanan ini sedang dinonaktifkan sementara oleh Administrator AZ GO untuk pemeliharaan sistem.');
        return;
      }
    }

    if (targetTab === 'tracking') {
      if (!canTrack) {
        setLoginTargetMessage('Silakan masuk terlebih dahulu. Fitur pelacakan hanya dapat diakses oleh Admin, Pelanggan pemesan, dan Mitra Toko pengirim.');
        setShowLoginModal(true);
        return;
      }
    }

    if (targetTab === 'driver-portal') {
      if (!currentUser) {
        setLoginTargetMessage('Silakan masuk dengan akun Mitra Driver untuk mengakses portal pengemudi.');
        setShowLoginModal(true);
        return;
      }
      if (currentUser.role !== 'DRIVER' && currentUser.role !== 'ADMIN') {
        setLoginTargetMessage(`Akun Anda (${currentUser.fullName} - ${currentUser.role}) bukan Driver. Harap masuk dengan akun Mitra Driver.`);
        setShowLoginModal(true);
        return;
      }
    } else if (targetTab === 'merchant-portal') {
      if (!currentUser) {
        setLoginTargetMessage('Silakan masuk dengan akun Mitra Toko / Resto untuk mengelola pesanan & menu.');
        setShowLoginModal(true);
        return;
      }
      if (currentUser.role !== 'MERCHANT' && currentUser.role !== 'ADMIN') {
        setLoginTargetMessage(`Akun Anda (${currentUser.fullName} - ${currentUser.role}) bukan Toko. Harap masuk dengan akun Mitra Toko.`);
        setShowLoginModal(true);
        return;
      }
    } else if (targetTab === 'hub-portal') {
      if (!currentUser) {
        setLoginTargetMessage('Silakan masuk dengan akun Staff Operator Hub / Gudang untuk memproses barcode scan paket.');
        setShowLoginModal(true);
        return;
      }
      if (currentUser.role !== 'HUB_STAFF' && currentUser.role !== 'ADMIN') {
        setLoginTargetMessage(`Akun Anda (${currentUser.fullName} - ${currentUser.role}) bukan Staff Hub. Harap masuk dengan akun Staff Hub.`);
        setShowLoginModal(true);
        return;
      }
    } else if (targetTab === 'admin') {
      if (!currentUser) {
        setLoginTargetMessage('Portal Administrator hanya dapat diakses oleh Super Administrator AZ GO.');
        setShowLoginModal(true);
        return;
      }
      if (currentUser.role !== 'ADMIN') {
        setLoginTargetMessage(`Akses Ditolak: Akun Anda (${currentUser.fullName} - ${currentUser.role}) bukan Administrator.`);
        setShowLoginModal(true);
        return;
      }
    }

    setActiveTab(targetTab);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('azgo_user', JSON.stringify(user));
    setShowLoginModal(false);
    if (pendingActionAfterLogin) {
      const cb = pendingActionAfterLogin;
      setPendingActionAfterLogin(null);
      setTimeout(() => cb(), 100);
      return;
    }
    if (user.role === 'ADMIN') setActiveTab('admin');
    else if (user.role === 'DRIVER') setActiveTab('driver-portal');
    else if (user.role === 'MERCHANT') setActiveTab('merchant-portal');
    else if (user.role === 'HUB_STAFF') setActiveTab('hub-portal');
    else setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('azgo_user');
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {!isProductionDeployment && (
        <DemoBanner
          isDemoMode={isDemoMode}
          onToggleDemoMode={handleToggleDemoMode}
          onQuickLogin={handleQuickLogin}
          onResetDemoData={handleResetDemoData}
          currentUser={currentUser}
        />
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        onQuickTrack={handleQuickTrack}
        currentUser={currentUser}
        canTrack={canTrack}
        isDemoMode={!isProductionDeployment && isDemoMode}
        onLoginClick={() => {
          setLoginTargetMessage('');
          setShowLoginModal(true);
        }}
        onLogoutClick={handleLogout}
        onChangePasswordClick={() => setShowChangePasswordModal(true)}
        activeOrderCount={userTrackableOrders.length}
        onOpenTracking={() => {
          if (userTrackableOrders.length > 0) {
            handleTrackOrder(userTrackableOrders[0]);
          }
        }}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
        {/* ================= 1. SISI PELANGGAN (CUSTOMER SUPERAPP) ================= */}
        {activeTab === 'home' && (
          <ServiceGrid 
            onSelectService={handleSelectTab} 
            servicesConfig={servicesConfig}
            canTrack={canTrack}
            onOpenPartnerModal={(type) => {
              setPartnerModalType(type);
              setShowPartnerModal(true);
            }}
          />
        )}

        {/* 🛵 Az Delivery */}
        {activeTab === 'delivery' && (
          <FoodOrdering 
            onBack={() => setActiveTab('home')} 
            currentUser={currentUser}
            onRequestLogin={handleRequestLogin}
            onOrderCreated={handleOrderCreated}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {/* 📦 Az Courier */}
        {activeTab === 'courier' && (
          <ExpeditionHub
            isExpress={false}
            initialSubTab="rate"
            onBack={() => setActiveTab('home')}
            currentUser={currentUser}
            onLogout={handleLogout}
            onChangePassword={() => setShowChangePasswordModal(true)}
            onRequestLogin={handleRequestLogin}
            onOrderCreated={handleOrderCreated}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {/* 🚚 Az Express */}
        {activeTab === 'express' && (
          <ExpeditionHub
            isExpress={true}
            initialSubTab="rate"
            onBack={() => setActiveTab('home')}
            currentUser={currentUser}
            onLogout={handleLogout}
            onChangePassword={() => setShowChangePasswordModal(true)}
            onRequestLogin={handleRequestLogin}
            onOrderCreated={handleOrderCreated}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {/* 🚛 Az Cargo */}
        {activeTab === 'cargo' && (
          <CargoBooking 
            onBack={() => setActiveTab('home')} 
            currentUser={currentUser}
            onRequestLogin={handleRequestLogin}
            onOrderCreated={handleOrderCreated}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {/* 🛒 Az Mart */}
        {activeTab === 'mart' && (
          <MartShopping 
            onBack={() => setActiveTab('home')} 
            currentUser={currentUser}
            onRequestLogin={handleRequestLogin}
            onOrderCreated={handleOrderCreated}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {/* 📍 Az Pickup */}
        {activeTab === 'pickup' && (
          <PickupRequest
            onBack={() => setActiveTab('home')}
            onGoToCourier={() => setActiveTab('courier')}
            currentUser={currentUser}
            onRequestLogin={handleRequestLogin}
            onOrderCreated={handleOrderCreated}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {/* 🔎 Universal Tracking */}
        {activeTab === 'tracking' && (
          canTrack ? (
            <ExpeditionHub
              initialSubTab="track"
              initialAwb={trackedAwb}
              onBack={() => setActiveTab('home')}
              currentUser={currentUser}
              onLogout={handleLogout}
              onChangePassword={() => setShowChangePasswordModal(true)}
              onRequestLogin={handleRequestLogin}
              onOrderCreated={handleOrderCreated}
              onTrackOrder={handleTrackOrder}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-lg mx-auto shadow-sm my-12">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🔒
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Akses Pelacakan Terbatas</h2>
              <p className="text-sm text-slate-600 mb-6">
                Fitur pelacakan hanya dapat diakses oleh Administrator, Pelanggan yang telah memesan, atau Mitra Toko pengirim.
              </p>
              <button
                onClick={() => {
                  setLoginTargetMessage('Silakan masuk untuk melacak pesanan Anda.');
                  setShowLoginModal(true);
                }}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition shadow-md"
              >
                Masuk / Login Sekarang
              </button>
            </div>
          )
        )}

        {/* ================= 2. SISI MITRA DRIVER ================= */}
        {activeTab === 'driver-portal' && (
          <DriverPortal 
            onBack={() => setActiveTab('home')}
            currentUser={currentUser}
            onLogout={handleLogout}
            onChangePassword={() => setShowChangePasswordModal(true)}
          />
        )}

        {/* ================= 3. SISI MITRA TOKO / RESTO & MART ================= */}
        {activeTab === 'merchant-portal' && (
          <MerchantPortal 
            onBack={() => setActiveTab('home')}
            currentUser={currentUser}
            onLogout={handleLogout}
            onChangePassword={() => setShowChangePasswordModal(true)}
          />
        )}

        {/* ================= 4. SISI STAFF HUB / GUDANG ================= */}
        {activeTab === 'hub-portal' && (
          <ExpeditionHub
            initialSubTab="send"
            isHubPortal={true}
            onBack={() => setActiveTab('home')}
            currentUser={currentUser}
            onLogout={handleLogout}
            onChangePassword={() => setShowChangePasswordModal(true)}
            onRequestLogin={handleRequestLogin}
            onOrderCreated={handleOrderCreated}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {/* ================= 5. SISI ADMINISTRATOR (BACKOFFICE) ================= */}
        {activeTab === 'admin' && (
          <AdminDashboard 
            onBack={() => setActiveTab('home')}
            currentUser={currentUser}
            onLogout={handleLogout}
            onChangePassword={() => setShowChangePasswordModal(true)}
            onServicesUpdated={fetchServices}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">AZ GO SuperApp — Solusi Dari A Sampai Z</p>
        <p className="mt-1 text-slate-400">
          Pelanggan • Mitra Driver • Mitra Toko Resto & Mart • Staff Drop Point/Hub • Admin Control Tower
        </p>
      </footer>

      {/* Floating Active Order Tracker Badge for Customers (Hanya tampil untuk yang berhak melacak) */}
      {canTrack && userTrackableOrders.length > 0 && ['home', 'delivery', 'courier', 'express', 'cargo', 'mart', 'pickup', 'tracking'].includes(activeTab) && (
        <aside
          aria-label="Status Pesanan Berlangsung"
          onClick={() => handleTrackOrder(userTrackableOrders[0])}
          className="fixed bottom-6 right-6 z-40 bg-slate-900/95 hover:bg-slate-900 text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-slate-700/80 backdrop-blur flex items-center gap-3.5 cursor-pointer hover:scale-105 transition group"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              🛵
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div className="text-left pr-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Live Tracking GPS • {userTrackableOrders[0].orderNumber}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-100 max-w-[210px] truncate">
              {userTrackableOrders[0].serviceName}
            </p>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              Klik untuk pantau posisi kurir & rute
            </span>
          </div>

          <div className="pl-1">
            <span className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md transition flex items-center gap-1">
              Lacak ↗
            </span>
          </div>
        </aside>
      )}

      {/* Global Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        targetRoleMessage={loginTargetMessage}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        currentUser={currentUser}
      />

      <PartnerRegistrationModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        defaultType={partnerModalType}
      />

      {/* Customer Live Order Tracking Modal */}
      <CustomerOrderTrackingModal
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
        order={activeTrackingOrder}
        onUpdateOrderStatus={(orderNum, nextSt) => {
          setCustomerOrders(prev => prev.map(o => o.orderNumber === orderNum ? { ...o, status: nextSt } : o));
          if (activeTrackingOrder && activeTrackingOrder.orderNumber === orderNum) {
            setActiveTrackingOrder(prev => prev ? { ...prev, status: nextSt } : null);
          }
        }}
      />
    </div>
  );
};

export default App;

