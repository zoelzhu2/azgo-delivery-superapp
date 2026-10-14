import React, { useEffect, useState } from 'react';
import { api } from '../../services/apiClient';
import { User } from '@delivery/shared';
import { CustomerOrder } from '../customer/CustomerOrderTrackingModal';
import { OrderPaymentModal, PaymentMethodType } from '../../components/OrderPaymentModal';
import { 
  Star, 
  Plus, 
  Minus, 
  CheckCircle2, 
  ArrowLeft, 
  ShoppingBag, 
  Store, 
  MapPin, 
  X,
  Bike,
  Lock,
  QrCode,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

interface MartShoppingProps {
  onBack: () => void;
  currentUser?: User | null;
  onRequestLogin?: (message: string, callback?: () => void) => void;
  onOrderCreated?: (order: CustomerOrder) => void;
  onTrackOrder?: (order: CustomerOrder) => void;
  isDemoMode?: boolean;
}

export const MartShopping: React.FC<MartShoppingProps> = ({ 
  onBack,
  currentUser,
  onRequestLogin,
  onOrderCreated,
  onTrackOrder,
  isDemoMode = false
}) => {
  const [stores, setStores] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [cartStore, setCartStore] = useState<{ id: string; name: string } | null>(null);
  const [switchStorePrompt, setSwitchStorePrompt] = useState<{
    pendingStore: any;
    pendingProductId: string;
  } | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('Jl. Basuki Rahmat No. 8, Tegalsari, Surabaya');
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<CustomerOrder | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  useEffect(() => {
    api.getMartStores().then(res => {
      if (res.success && Array.isArray(res.data)) {
        setStores(res.data.filter((s: any) => s.isActive !== false));
      }
    });
  }, [isDemoMode]);

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleAddItem = (store: any, productId: string) => {
    // Cek apakah keranjang sudah berisi produk dari toko mart lain
    if (cartStore && cartStore.id !== store.id && totalCartCount > 0) {
      setSwitchStorePrompt({
        pendingStore: store,
        pendingProductId: productId
      });
      return;
    }
    setCartStore({ id: store.id, name: store.name });
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[productId] > 1) {
        updated[productId] -= 1;
      } else {
        delete updated[productId];
      }
      const remaining = Object.values(updated).reduce((a, b) => a + b, 0);
      if (remaining === 0) {
        setCartStore(null);
      }
      return updated;
    });
  };

  const handleConfirmSwitchStore = () => {
    if (!switchStorePrompt) return;
    const { pendingStore, pendingProductId } = switchStorePrompt;
    setCart({ [pendingProductId]: 1 });
    setCartStore({ id: pendingStore.id, name: pendingStore.name });
    setSwitchStorePrompt(null);
    setOrderSummary(null);
  };

  const handleCheckout = async () => {
    const items = Object.entries(cart).map(([productId, quantity]) => ({
      productId,
      quantity
    }));
    const res = await api.calculateOrder(items, true);
    if (res.success) {
      setOrderSummary(res.data);
    }
  };

  const handleProceedMartOrder = (
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
    const orderNum = `AZM-${Math.floor(100000 + Math.random() * 900000)}`;
    const payLabel = details?.methodLabel || (paymentMethod === 'QRIS' ? 'QRIS (Pembayaran Digital Lunas)' : 'Tunai saat pesanan tiba (COD)');
    const newOrder: CustomerOrder = {
      orderNumber: orderNum,
      serviceType: 'MART',
      serviceName: `Az Mart — ${cartStore?.name || 'Minimarket'}`,
      merchantName: cartStore?.name,
      pickupAddress: cartStore?.name ? `${cartStore.name}, Surabaya` : 'Toko Mitra Mart Surabaya',
      dropoffAddress: deliveryAddress,
      items: orderSummary?.orderedItems?.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })) || [],
      totalAmount: orderSummary?.totalAmount || 0,
      paymentMethod: payLabel,
      paymentProofUrl: details?.paymentProofUrl,
      distanceKm: 2.8,
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

  const handleMartOrderClick = () => {
    if (!currentUser) {
      if (onRequestLogin) {
        onRequestLogin(
          'Silakan masuk atau daftar akun pelanggan terlebih dahulu untuk memilih pembayaran (QRIS/Tunai) dan belanja di Az Mart.',
          () => setShowPaymentModal(true)
        );
      }
      return;
    }
    setShowPaymentModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Layanan
        </button>

        {totalCartCount > 0 && !orderSuccess && (
          <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <ShoppingBag className="w-4 h-4" />
            Keranjang Belanja ({totalCartCount})
          </button>
        )}
      </div>

      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-3xl p-6 text-white shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
          🛒 Az Mart — Belanja Sembako & Minimarket
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">Driver Belanjakan Kebutuhan Anda</h2>
        <p className="text-emerald-100 text-xs mt-1">
          Pilih sembako, minyak, telur, sayur, atau buah. Driver membelanjakan langsung di toko dan mengantar ke rumah.
        </p>
      </div>

      {orderSuccess ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4 max-w-lg mx-auto">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
          <div>
            <h3 className="font-extrabold text-emerald-950 text-xl">Pesanan Az Mart Berhasil Dibuat!</h3>
            <p className="text-xs text-slate-600 mt-1">
              Driver *personal shopper* sedang menuju <strong>{cartStore?.name}</strong> untuk membelanjakan barang kebutuhan Anda.
            </p>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/70 text-xs text-left space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Toko Mart:</span>
              <span className="font-bold text-slate-900">{cartStore?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Alamat Antar:</span>
              <span className="font-semibold text-slate-800">{deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Estimasi:</span>
              <span className="font-black text-emerald-700">Rp {orderSummary?.totalAmount?.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {lastPlacedOrder && onTrackOrder && (
            <button
              onClick={() => onTrackOrder(lastPlacedOrder)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Bike className="w-4 h-4" /> Lacak Pesanan Mart Saya Sekarang (Live GPS)
            </button>
          )}

          <button
            onClick={() => {
              setOrderSuccess(false);
              setCart({});
              setCartStore(null);
              setOrderSummary(null);
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Belanja Barang Lain
          </button>
        </div>
      ) : orderSummary ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Rincian Belanjaan Az Mart</h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              🛒 Concierge Shopping
            </span>
          </div>

          {/* Store Info Banner */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Toko / Minimarket Mitra</span>
              <h4 className="font-extrabold text-emerald-950 text-sm">{cartStore?.name}</h4>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-600 text-white rounded-lg">Az Mart</span>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Alamat Pengantaran Belanjaan
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={e => setDeliveryAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-emerald-500 font-medium"
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
                Silakan masuk atau daftar akun pelanggan baru agar belanjaan Anda tercatat dan dapat dilacak real-time via GPS.
              </p>
              <button
                type="button"
                onClick={() => onRequestLogin && onRequestLogin('Silakan login sebagai pelanggan untuk memilih metode pembayaran & memproses pesanan belanjaan.')}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
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

          <div className="pt-3 border-t border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal Belanjaan:</span>
              <span>Rp {orderSummary.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Jasa Belanja Concierge:</span>
              <span>Rp {orderSummary.shoppingServiceFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim Driver:</span>
              <span>Rp {orderSummary.deliveryFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan Aplikasi:</span>
              <span>Rp {orderSummary.appFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-base font-black text-emerald-700 pt-2 border-t">
              <span>Total Estimasi Bayar:</span>
              <span>Rp {orderSummary.totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Payment Preview Notice */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <QrCode className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <span className="font-bold text-slate-800 block text-xs">Pilihan Pembayaran:</span>
                <span className="text-[11px] text-slate-500">QRIS (Scan Bank/E-Wallet) atau Tunai (COD)</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Pilih Opsi
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setOrderSummary(null)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Ubah Daftar
            </button>
            <button
              onClick={handleMartOrderClick}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {!currentUser ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Masuk & Belanjakan</span>
                </>
              ) : (
                <>
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Belanjakan (Pilih QRIS / Tunai)</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : stores.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center shadow-sm max-w-xl mx-auto my-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
            🛒
          </div>
          <h3 className="font-extrabold text-slate-800 text-base mb-1">Belum Ada Toko Mart Terdaftar</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Di Mode Real, data toko minimarket & sembako masih kosong. Administrator dapat menambahkan mitra toko mart baru melalui Dashboard Admin atau mitra dapat mendaftar langsung.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map(store => {
            const isSelectedStore = cartStore?.id === store.id;
            return (
              <div 
                key={store.id} 
                className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition ${
                  isSelectedStore ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="relative">
                    <img src={store.bannerUrl} alt={store.name} className="w-full h-36 object-cover" />
                    {isSelectedStore && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> Toko Belanja Terpilih
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">{store.category}</span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" /> {store.rating}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base">{store.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{store.address}</p>

                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                      {store.items.map((item: any) => {
                        const qty = cart[item.id] || 0;
                        return (
                          <div key={item.id} className="flex items-center justify-between text-xs py-1.5">
                            <div className="pr-2">
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <span className="text-emerald-700 font-semibold">Rp {item.price.toLocaleString('id-ID')}</span>
                            </div>
                            {qty > 0 ? (
                              <div className="flex items-center gap-1.5 bg-emerald-100/80 p-1 rounded-xl shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="w-6 h-6 rounded-lg bg-white text-emerald-900 font-black flex items-center justify-center shadow-xs hover:bg-emerald-200 transition"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-black text-emerald-950 px-1">{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => handleAddItem(store, item.id)}
                                  className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center shadow-xs hover:bg-emerald-700 transition"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddItem(store, item.id)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold flex items-center gap-1 transition shrink-0"
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

      {/* Modal Konfirmasi Ganti Toko Mart */}
      {switchStorePrompt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100 relative text-center">
            <button
              onClick={() => setSwitchStorePrompt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Ganti Toko Mart Pilihan?</h3>
              <p className="text-xs text-slate-500 mt-1">Driver shopper hanya membelanjakan dari 1 toko per pesanan</p>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-2 text-slate-700 text-left">
              <p>
                Keranjang Anda saat ini berisi belanjaan dari <strong className="text-emerald-950 font-bold">{cartStore?.name}</strong>.
              </p>
              <p className="text-slate-600">
                Apakah Anda ingin mengosongkan keranjang dan belanja dari <strong className="text-emerald-950 font-bold">{switchStorePrompt.pendingStore.name}</strong>?
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSwitchStorePrompt(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmSwitchStore}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Hapus & Ganti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pilihan Pembayaran Mart (QRIS / Tunai) */}
      <OrderPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderTitle={`Az Mart — ${cartStore?.name || 'Minimarket'}`}
        merchantName={cartStore?.name}
        totalAmount={orderSummary?.totalAmount || 0}
        currentUser={currentUser}
        onRequestLogin={() => {
          if (onRequestLogin) {
            onRequestLogin('Silakan login sebagai pelanggan untuk melanjutkan pembayaran belanjaan.');
          }
        }}
        onConfirmPayment={(method, details) => {
          handleProceedMartOrder(method, details);
        }}
      />
    </div>
  );
};
