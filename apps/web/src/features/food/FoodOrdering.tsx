import React, { useEffect, useState } from 'react';
import { api } from '../../services/apiClient';
import { User } from '@delivery/shared';
import { CustomerOrder } from '../customer/CustomerOrderTrackingModal';
import { OrderPaymentModal, PaymentMethodType } from '../../components/OrderPaymentModal';
import { GoogleMapPickerModal, LocationPoint } from '../../components/GoogleMapPickerModal';
import { calculateDistanceKm } from '../../utils/indonesiaGeo';
import { 
  Bike, 
  UtensilsCrossed, 
  Star, 
  Plus, 
  Minus,
  ShoppingBag, 
  CheckCircle2, 
  ArrowLeft, 
  Package, 
  MapPin, 
  X,
  Lock,
  QrCode,
  ExternalLink,
  User as UserIcon,
  ShieldCheck,
  Navigation,
  Route
} from 'lucide-react';

interface FoodOrderingProps {
  onBack?: () => void;
  currentUser?: User | null;
  onRequestLogin?: (message: string, callback?: () => void) => void;
  onOrderCreated?: (order: CustomerOrder) => void;
  onTrackOrder?: (order: CustomerOrder) => void;
  isDemoMode?: boolean;
}

export const FoodOrdering: React.FC<FoodOrderingProps> = ({ 
  onBack,
  currentUser,
  onRequestLogin,
  onOrderCreated,
  onTrackOrder,
  isDemoMode = false
}) => {
  const [deliveryType, setDeliveryType] = useState<'FOOD' | 'LOCAL_GOODS'>('FOOD');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [menuId: string]: number }>({});
  const [cartResto, setCartResto] = useState<{ id: string; name: string } | null>(null);
  const [switchRestoPrompt, setSwitchRestoPrompt] = useState<{
    pendingResto: any;
    pendingMenuId: string;
  } | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('Jl. Pemuda No. 45, Genteng, Surabaya');
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<CustomerOrder | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentTargetType, setPaymentTargetType] = useState<'FOOD' | 'GOODS'>('FOOD');

  // State Barang Lokal & Koordinat Google Maps
  const [goodsPickup, setGoodsPickup] = useState('Jl. Raya Darmo No. 12, Wonokromo, Surabaya');
  const [goodsDropoff, setGoodsDropoff] = useState('Pakuwon Mall, Wiyung, Surabaya');
  const [goodsItem, setGoodsItem] = useState('Kunci Rumah & Dokumen Map');
  const [goodsKm, setGoodsKm] = useState(8.5);
  const [goodsEstimate, setGoodsEstimate] = useState<any>(null);
  const [goodsSuccess, setGoodsSuccess] = useState<any>(null);

  // Koordinat Titik Google Maps untuk Kalibrasi Presisi
  const [goodsPickupCoord, setGoodsPickupCoord] = useState<LocationPoint>({
    address: 'Jl. Raya Darmo No. 12, Wonokromo, Surabaya',
    lat: -7.2912,
    lng: 112.7381
  });
  const [goodsDropoffCoord, setGoodsDropoffCoord] = useState<LocationPoint>({
    address: 'Pakuwon Mall, Wiyung, Surabaya',
    lat: -7.2965,
    lng: 112.6780
  });
  const [showMapPickerModal, setShowMapPickerModal] = useState<boolean>(false);
  const [mapPickerTarget, setMapPickerTarget] = useState<'PICKUP' | 'DROPOFF'>('PICKUP');

  const handleOpenMapPicker = (target: 'PICKUP' | 'DROPOFF') => {
    setMapPickerTarget(target);
    if (target === 'PICKUP') {
      setGoodsPickupCoord(prev => ({ ...prev, address: goodsPickup || prev.address }));
    } else {
      setGoodsDropoffCoord(prev => ({ ...prev, address: goodsDropoff || prev.address }));
    }
    setShowMapPickerModal(true);
  };

  const handleSelectMapLocation = (point: LocationPoint) => {
    if (mapPickerTarget === 'PICKUP') {
      setGoodsPickupCoord(point);
      setGoodsPickup(point.address);
      const newKm = calculateDistanceKm(
        point.lat,
        point.lng,
        goodsDropoffCoord.lat,
        goodsDropoffCoord.lng
      );
      setGoodsKm(newKm);
      setGoodsEstimate(null);
    } else {
      setGoodsDropoffCoord(point);
      setGoodsDropoff(point.address);
      const newKm = calculateDistanceKm(
        goodsPickupCoord.lat,
        goodsPickupCoord.lng,
        point.lat,
        point.lng
      );
      setGoodsKm(newKm);
      setGoodsEstimate(null);
    }
  };

  useEffect(() => {
    api.getRestaurants().then(res => {
      if (res.success && Array.isArray(res.data)) {
        setRestaurants(res.data.filter((r: any) => r.isActive !== false));
      } else {
        setRestaurants([]);
      }
    });
  }, [isDemoMode]);

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleAddItem = (resto: any, menuId: string) => {
    // Cek apakah keranjang sudah berisi menu dari resto lain
    if (cartResto && cartResto.id !== resto.id && totalCartCount > 0) {
      setSwitchRestoPrompt({
        pendingResto: resto,
        pendingMenuId: menuId
      });
      return;
    }
    setCartResto({ id: resto.id, name: resto.name });
    setCart(prev => ({ ...prev, [menuId]: (prev[menuId] || 0) + 1 }));
  };

  const handleRemoveItem = (menuId: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[menuId] > 1) {
        updated[menuId] -= 1;
      } else {
        delete updated[menuId];
      }
      const remaining = Object.values(updated).reduce((a, b) => a + b, 0);
      if (remaining === 0) {
        setCartResto(null);
      }
      return updated;
    });
  };

  const handleConfirmSwitchResto = () => {
    if (!switchRestoPrompt) return;
    const { pendingResto, pendingMenuId } = switchRestoPrompt;
    setCart({ [pendingMenuId]: 1 });
    setCartResto({ id: pendingResto.id, name: pendingResto.name });
    setSwitchRestoPrompt(null);
    setOrderSummary(null);
  };

  const handleCheckout = async () => {
    const items = Object.entries(cart).map(([productId, quantity]) => ({
      productId,
      quantity
    }));
    const res = await api.calculateOrder(items, false);
    if (res.success) {
      setOrderSummary(res.data);
    }
  };

  const handleEstimateGoods = async () => {
    const res = await api.estimateRide({ distanceKm: goodsKm, vehicleType: 'MOTORBIKE' });
    if (res.success) {
      setGoodsEstimate(res.data);
    }
  };

  const handleProceedFoodOrder = (
    paymentMethod: PaymentMethodType = 'QRIS',
    details?: { 
      methodLabel: string; 
      cashChangeNote?: string; 
      isPaid: boolean; 
      paymentProofUrl?: string;
      paymentProofName?: string;
      senderAccountName?: string;
    },
    userToUse = currentUser
  ) => {
    const orderNum = `AZD-${Math.floor(100000 + Math.random() * 900000)}`;
    const payLabel = details?.methodLabel || (paymentMethod === 'QRIS' ? 'QRIS (Pembayaran Digital Lunas)' : 'Tunai saat pesanan tiba (COD)');
    const newOrder: CustomerOrder = {
      orderNumber: orderNum,
      serviceType: 'FOOD',
      serviceName: `Az Delivery — ${cartResto?.name || 'Makanan'}`,
      merchantName: cartResto?.name,
      pickupAddress: cartResto?.name ? `${cartResto.name}, Surabaya` : 'Restoran Mitra Surabaya',
      dropoffAddress: deliveryAddress,
      items: orderSummary?.orderedItems?.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })) || [],
      totalAmount: orderSummary?.totalAmount || 0,
      paymentMethod: payLabel,
      paymentProofUrl: details?.paymentProofUrl,
      distanceKm: 3.2,
      customerName: userToUse?.fullName || 'Siti Rahma',
      customerPhone: userToUse?.phone || '081299887766',
      createdAt: new Date().toISOString(),
      status: 'PREPARING'
    };

    setLastPlacedOrder(newOrder);
    setOrderSuccess(true);
    setShowPaymentModal(false);
    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }
  };

  const handleOrderClick = () => {
    if (!currentUser) {
      if (onRequestLogin) {
        onRequestLogin(
          'Silakan masuk atau daftar akun pelanggan terlebih dahulu untuk memilih metode pembayaran (QRIS/Tunai) dan memesan makanan.',
          () => {
            setPaymentTargetType('FOOD');
            setShowPaymentModal(true);
          }
        );
      }
      return;
    }
    setPaymentTargetType('FOOD');
    setShowPaymentModal(true);
  };

  const handleProceedGoodsOrder = (
    paymentMethod: PaymentMethodType = 'QRIS',
    details?: { 
      methodLabel: string; 
      cashChangeNote?: string; 
      isPaid: boolean; 
      paymentProofUrl?: string;
      paymentProofName?: string;
      senderAccountName?: string;
    },
    userToUse = currentUser
  ) => {
    const orderNum = `AZD-${Math.floor(100000 + Math.random() * 900000)}`;
    const payLabel = details?.methodLabel || (paymentMethod === 'QRIS' ? 'QRIS (Pembayaran Digital Lunas)' : 'Tunai saat kurir tiba (COD)');
    const newOrder: CustomerOrder = {
      orderNumber: orderNum,
      serviceType: 'LOCAL_GOODS',
      serviceName: 'Az Delivery — Kirim Barang Lokal',
      merchantName: 'Pengiriman: ' + goodsItem,
      pickupAddress: goodsPickup,
      dropoffAddress: goodsDropoff,
      items: [{ name: goodsItem, quantity: 1, price: goodsEstimate?.totalFare || 15000 }],
      totalAmount: goodsEstimate?.totalFare || 15000,
      paymentMethod: payLabel,
      paymentProofUrl: details?.paymentProofUrl,
      distanceKm: goodsKm,
      customerName: userToUse?.fullName || 'Siti Rahma',
      customerPhone: userToUse?.phone || '081299887766',
      createdAt: new Date().toISOString(),
      status: 'PICKING_UP'
    };

    setLastPlacedOrder(newOrder);
    setGoodsSuccess({ orderNumber: orderNum });
    setShowPaymentModal(false);
    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }
  };

  const handleGoodsOrderClick = () => {
    if (!currentUser) {
      if (onRequestLogin) {
        onRequestLogin(
          'Silakan masuk atau daftar akun pelanggan terlebih dahulu untuk memilih opsi pembayaran & memesan kurir barang lokal.',
          () => {
            setPaymentTargetType('GOODS');
            setShowPaymentModal(true);
          }
        );
      }
      return;
    }
    setPaymentTargetType('GOODS');
    setShowPaymentModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Layanan
        </button>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
              <Bike className="w-3.5 h-3.5" /> 🛵 Az Delivery — Layanan Instan Lokal
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Pesan Makanan & Antar Barang Kilat</h2>
            <p className="text-white/80 text-xs mt-1">
              Kurir motor menjemput dan mengantar langsung dalam 1-2 jam.
            </p>
          </div>

          <div className="flex bg-white/20 p-1 rounded-2xl backdrop-blur-md">
            <button
              onClick={() => setDeliveryType('FOOD')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                deliveryType === 'FOOD' ? 'bg-white text-amber-900 shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              Makanan & Minuman
            </button>
            <button
              onClick={() => setDeliveryType('LOCAL_GOODS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                deliveryType === 'LOCAL_GOODS' ? 'bg-white text-amber-900 shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              Kirim Barang Lokal
            </button>
          </div>
        </div>
      </div>

      {deliveryType === 'FOOD' ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                Pilihan Restoran Mitra
              </h3>
            </div>

            {totalCartCount > 0 && !orderSuccess && (
              <button
                onClick={handleCheckout}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <ShoppingBag className="w-4 h-4" />
                Keranjang ({totalCartCount})
              </button>
            )}
          </div>

          {orderSuccess ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <div>
                <h3 className="font-extrabold text-emerald-950 text-xl">Pesanan Makanan Diteruskan ke Resto!</h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Pesanan dari <strong>{cartResto?.name}</strong> sedang disiapkan oleh pihak restoran. Kurir Az Delivery segera menjemput ke alamat Anda.
                </p>
              </div>

              <div className="bg-white/80 rounded-2xl p-4 border border-emerald-200/60 text-xs text-left space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Restoran:</span>
                  <span className="font-bold text-slate-900">{cartResto?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alamat Antar:</span>
                  <span className="font-semibold text-slate-800">{deliveryAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Pembayaran:</span>
                  <span className="font-black text-amber-700">Rp {orderSummary?.totalAmount?.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {lastPlacedOrder && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onTrackOrder && lastPlacedOrder) {
                        onTrackOrder(lastPlacedOrder);
                      }
                    }}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    <Bike className="w-4 h-4 text-amber-400" />
                    <span>Lacak Pesanan Saya Sekarang (Live Tracking GPS)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setOrderSuccess(false);
                    setCart({});
                    setCartResto(null);
                    setOrderSummary(null);
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Pesan Menu Lain
                </button>
              </div>
            </div>
          ) : orderSummary ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Konfirmasi Pesanan Az Delivery</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  🛵 Instan 1-2 Jam
                </span>
              </div>

              {/* Resto Info */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Restoran Mitra</span>
                  <h4 className="font-extrabold text-amber-950 text-sm">{cartResto?.name}</h4>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-600 text-white rounded-lg">Az Delivery</span>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" /> Alamat Pengantaran Pelanggan
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-amber-500 font-medium"
                />
              </div>

              {/* Customer Account Status Card */}
              {currentUser ? (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider block">Akun Pelanggan Pemesan</span>
                      <p className="font-extrabold text-slate-900">{currentUser.fullName}</p>
                      <span className="text-slate-500 text-[11px]">{currentUser.phone || currentUser.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-emerald-200 text-emerald-800 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Akun Aktif
                  </span>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-700" />
                      <span className="text-xs font-black text-amber-950">Akun Pelanggan Diperlukan untuk Memesan</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                      Wajib Login
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Silakan masuk atau daftar akun pelanggan baru agar pesanan makanan Anda tercatat dan dapat dilacak real-time via GPS.
                  </p>
                  <button
                    type="button"
                    onClick={() => onRequestLogin && onRequestLogin('Silakan login sebagai pelanggan untuk memilih metode pembayaran & menyelesaikan pesanan.')}
                    className="w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <UserIcon className="w-3.5 h-3.5" /> Masuk / Daftar Akun Pelanggan Sekarang
                  </button>
                </div>
              )}

              <div className="divide-y divide-slate-100 text-xs">
                {orderSummary.orderedItems.map((item: any) => (
                  <div key={item.product.id} className="py-2.5 flex justify-between">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span className="font-semibold">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              {/* Rincian Tarif & Pilihan Pembayaran */}
              <div className="pt-3 border-t border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal Menu:</span>
                  <span>Rp {orderSummary.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim Driver:</span>
                  <span>Rp {orderSummary.deliveryFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Layanan Aplikasi:</span>
                  <span>Rp {orderSummary.appFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-base font-black text-amber-700 pt-2 border-t">
                  <span>Total Bayar:</span>
                  <span>Rp {orderSummary.totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Payment Preview Notice */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Pilihan Pembayaran:</span>
                    <span className="text-[11px] text-slate-500">QRIS (Scan Bank/E-Wallet) atau Tunai (COD)</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  Pilih Opsi
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setOrderSummary(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Ubah Menu
                </button>
                <button
                  onClick={handleOrderClick}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {!currentUser ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-200" />
                      <span>Masuk & Pesan (Pilih Bayar)</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Pesan Sekarang (Pilih QRIS / Tunai)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center shadow-sm max-w-xl mx-auto my-6">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
                🍽️
              </div>
              <h3 className="font-extrabold text-slate-800 text-base mb-1">Belum Ada Restoran Terdaftar</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Di Mode Real, data restoran masih kosong. Administrator dapat menambahkan mitra restoran baru melalui Dashboard Admin atau mitra dapat mendaftar di halaman depan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants.map(resto => {
                const isSelectedResto = cartResto?.id === resto.id;
                return (
                  <div 
                    key={resto.id} 
                    className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition ${
                      isSelectedResto ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="relative">
                        <img src={resto.bannerUrl} alt={resto.name} className="w-full h-36 object-cover" />
                        {isSelectedResto && (
                          <div className="absolute top-3 right-3 bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" /> Restoran Terpilih
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">{resto.category}</span>
                          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" /> {resto.rating}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base">{resto.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{resto.address}</p>

                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                          {resto.items.map((m: any) => {
                            const qty = cart[m.id] || 0;
                            return (
                              <div key={m.id} className="flex items-center justify-between text-xs py-1.5">
                                <div className="pr-2">
                                  <p className="font-bold text-slate-800">{m.name}</p>
                                  <span className="text-slate-500">Rp {m.price.toLocaleString('id-ID')}</span>
                                </div>
                                {qty > 0 ? (
                                  <div className="flex items-center gap-1.5 bg-amber-100/80 p-1 rounded-xl shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveItem(m.id)}
                                      className="w-6 h-6 rounded-lg bg-white text-amber-900 font-black flex items-center justify-center shadow-xs hover:bg-amber-200 transition"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-xs font-black text-amber-950 px-1">{qty}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleAddItem(resto, m.id)}
                                      className="w-6 h-6 rounded-lg bg-amber-600 text-white font-black flex items-center justify-center shadow-xs hover:bg-amber-700 transition"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleAddItem(resto, m.id)}
                                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold flex items-center gap-1 transition shrink-0"
                                  >
                                    <Plus className="w-3 h-3" /> Tambah
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Kirim Barang Lokal Instan */
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" /> Kirim Barang Instan Dalam Kota
          </h3>

          {goodsSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-base">Driver Sedang Menuju Lokasi Penjemputan!</h4>
              <p className="text-xs text-emerald-700">Kode Pesanan: <strong>{goodsSuccess.orderNumber}</strong></p>
              
              <div className="flex flex-col gap-2 pt-2">
                {lastPlacedOrder && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onTrackOrder && lastPlacedOrder) {
                        onTrackOrder(lastPlacedOrder);
                      }
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition"
                  >
                    <Bike className="w-4 h-4 text-amber-400" />
                    <span>Lacak Kurir Live di Google Maps (Tracking)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setGoodsSuccess(null);
                    setGoodsEstimate(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Kirim Barang Lain
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Titik Ambil Barang */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Titik Ambil Barang (Penjemputan)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenMapPicker('PICKUP')}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-xl border border-emerald-300 flex items-center gap-1 transition shadow-xs cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tag di Google Maps</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={goodsPickup}
                  onChange={e => {
                    setGoodsPickup(e.target.value);
                    setGoodsPickupCoord(prev => ({ ...prev, address: e.target.value }));
                  }}
                  placeholder="Ketik alamat atau pilih tag Google Maps di atas..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-amber-500 font-medium"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 pt-0.5">
                  <span className="flex items-center gap-1 font-mono text-emerald-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    GPS: {goodsPickupCoord.lat.toFixed(4)}, {goodsPickupCoord.lng.toFixed(4)} (Terkalibrasi)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenMapPicker('PICKUP')}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Ubah Titik Maps
                  </button>
                </div>
              </div>

              {/* Titik Antar Barang */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    Titik Antar Barang (Tujuan)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenMapPicker('DROPOFF')}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold rounded-xl border border-rose-300 flex items-center gap-1 transition shadow-xs cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Tag di Google Maps</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={goodsDropoff}
                  onChange={e => {
                    setGoodsDropoff(e.target.value);
                    setGoodsDropoffCoord(prev => ({ ...prev, address: e.target.value }));
                  }}
                  placeholder="Ketik alamat atau pilih tag Google Maps di atas..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-amber-500 font-medium"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 pt-0.5">
                  <span className="flex items-center gap-1 font-mono text-rose-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
                    GPS: {goodsDropoffCoord.lat.toFixed(4)}, {goodsDropoffCoord.lng.toFixed(4)} (Terkalibrasi)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenMapPicker('DROPOFF')}
                    className="text-rose-700 font-bold hover:underline cursor-pointer"
                  >
                    Ubah Titik Maps
                  </button>
                </div>
              </div>

              {/* Route & Jarak Google Maps Akurat */}
              <div className="p-3.5 bg-gradient-to-br from-slate-50 via-white to-amber-50/40 rounded-2xl border border-amber-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-amber-600" />
                    Rute Terkalibrasi Google Maps
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Akurat Presisi
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                  <div className="truncate flex-1">
                    <span className="text-[9px] font-bold text-emerald-700 uppercase block">Ambil</span>
                    <p className="font-bold text-slate-800 truncate text-[11px]">{goodsPickup.split(',')[0]}</p>
                  </div>

                  <div className="flex flex-col items-center shrink-0 px-2">
                    <div className="px-2.5 py-0.5 bg-amber-500 text-white rounded-full font-black text-[11px] flex items-center gap-1 shadow-xs">
                      <Route className="w-3 h-3" /> {goodsKm} KM
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5">Jalur Jalan</span>
                  </div>

                  <div className="truncate flex-1 text-right">
                    <span className="text-[9px] font-bold text-rose-700 uppercase block">Tujuan</span>
                    <p className="font-bold text-slate-800 truncate text-[11px]">{goodsDropoff.split(',')[0]}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Estimasi Perjalanan: <strong>~{Math.max(5, Math.round(goodsKm * 2.5))} Menit</strong></span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${goodsPickupCoord.lat},${goodsPickupCoord.lng}&destination=${goodsDropoffCoord.lat},${goodsDropoffCoord.lng}&travelmode=driving`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    Rute Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Keterangan Barang yang Dikirim</label>
                <input
                  type="text"
                  value={goodsItem}
                  onChange={e => setGoodsItem(e.target.value)}
                  placeholder="Contoh: Kunci Rumah, Dokumen Map, Baju..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-600">Perkiraan Jarak Tempuh (KM)</label>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-bold">
                    Otomatis dari Titik Maps
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={goodsKm}
                  onChange={e => {
                    setGoodsKm(parseFloat(e.target.value) || 1);
                    setGoodsEstimate(null);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-black text-amber-900 focus:outline-amber-500 bg-amber-50/30"
                />
              </div>

              {goodsEstimate ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Total Tarif Antar Instan:</span>
                    <span className="text-xl font-black text-amber-700">
                      Rp {goodsEstimate.totalFare.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    onClick={handleGoodsOrderClick}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition"
                  >
                    {!currentUser && <Lock className="w-3.5 h-3.5" />}
                    <span>Pesan Kurir Instan Sekarang</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEstimateGoods}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs"
                >
                  Hitung Ongkos Antar Barang
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal Konfirmasi Ganti Restoran */}
      {switchRestoPrompt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100 relative text-center">
            <button
              onClick={() => setSwitchRestoPrompt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Ganti Restoran Pilihan?</h3>
              <p className="text-xs text-slate-500 mt-1">Satu pesanan hanya dapat berasal dari 1 restoran</p>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-2 text-slate-700 text-left">
              <p>
                Keranjang Anda saat ini berisi menu dari <strong className="text-amber-950 font-bold">{cartResto?.name}</strong>.
              </p>
              <p className="text-slate-600">
                Apakah Anda ingin mengosongkan keranjang dan mulai memesan dari <strong className="text-amber-950 font-bold">{switchRestoPrompt.pendingResto.name}</strong>?
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSwitchRestoPrompt(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmSwitchResto}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Hapus & Ganti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pilihan Pembayaran (QRIS / Tunai) */}
      <OrderPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderTitle={
          paymentTargetType === 'FOOD'
            ? `Az Delivery — ${cartResto?.name || 'Makanan'}`
            : `Az Delivery — Kirim Barang (${goodsItem})`
        }
        merchantName={cartResto?.name}
        totalAmount={
          paymentTargetType === 'FOOD'
            ? (orderSummary?.totalAmount || 0)
            : (goodsEstimate?.totalFare || 15000)
        }
        currentUser={currentUser}
        onRequestLogin={() => {
          if (onRequestLogin) {
            onRequestLogin('Silakan login sebagai pelanggan untuk melanjutkan pembayaran.');
          }
        }}
        onConfirmPayment={(method, details) => {
          if (paymentTargetType === 'FOOD') {
            handleProceedFoodOrder(method, details);
          } else {
            handleProceedGoodsOrder(method, details);
          }
        }}
      />

      {/* Modal Tag Lokasi Google Maps */}
      <GoogleMapPickerModal
        isOpen={showMapPickerModal}
        onClose={() => setShowMapPickerModal(false)}
        targetTitle={
          mapPickerTarget === 'PICKUP'
            ? 'Tag Titik Ambil Barang (Penjemputan)'
            : 'Tag Titik Antar Barang (Pengantaran)'
        }
        targetType={mapPickerTarget}
        currentPoint={mapPickerTarget === 'PICKUP' ? goodsPickupCoord : goodsDropoffCoord}
        onSelectLocation={handleSelectMapLocation}
      />
    </div>
  );
};
