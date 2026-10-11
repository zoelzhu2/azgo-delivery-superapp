import React, { useState } from 'react';
import { api } from '../../services/apiClient';
import { User } from '@delivery/shared';
import { CustomerOrder } from '../customer/CustomerOrderTrackingModal';
import { OrderPaymentModal, PaymentMethodType } from '../../components/OrderPaymentModal';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  Truck,
  QrCode,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';

interface CargoBookingProps {
  onBack: () => void;
  currentUser?: User | null;
  onRequestLogin?: (message: string, callback?: () => void) => void;
  onOrderCreated?: (order: CustomerOrder) => void;
  onTrackOrder?: (order: CustomerOrder) => void;
}

export const CargoBooking: React.FC<CargoBookingProps> = ({ 
  onBack,
  currentUser,
  onRequestLogin,
  onOrderCreated,
  onTrackOrder
}) => {
  const [vehicleType, setVehicleType] = useState('PICKUP_BAK');
  const [distanceKm, setDistanceKm] = useState(12);
  const [helperCount, setHelperCount] = useState(1);
  const [pickupAddress, setPickupAddress] = useState('Jl. Gatot Subroto No. 45, Jakarta Selatan');
  const [dropoffAddress, setDropoffAddress] = useState('Kawasan Industri GIIC, Cikarang');
  const [cargoDetails, setCargoDetails] = useState('Lemari Kayu Jati & 4 Kardus Barang Pindahan');
  const [fareResult, setFareResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<CustomerOrder | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const vehicles = [
    {
      type: 'PICKUP_BAK',
      name: 'Pickup Bak Terbuka',
      capacity: 'Maks. 800 Kg',
      dimensions: '200 × 150 × 120 cm',
      icon: '🛻'
    },
    {
      type: 'BLIND_VAN',
      name: 'Blind Van',
      capacity: 'Maks. 600 Kg',
      dimensions: '210 × 140 × 110 cm',
      icon: '🚐'
    },
    {
      type: 'PICKUP_BOX',
      name: 'Pickup Box Tertutup',
      capacity: 'Maks. 1.000 Kg',
      dimensions: '240 × 160 × 160 cm',
      icon: '🚚'
    },
    {
      type: 'TRUCK_ENGKEL',
      name: 'Truk Engkel (CDE)',
      capacity: 'Maks. 2.500 Kg',
      dimensions: '310 × 170 × 170 cm',
      icon: '🚛'
    }
  ];

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await api.checkCargoRate({
        vehicleType,
        distanceKm,
        helperCount
      });
      if (res.success) {
        setFareResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedCargoOrder = (
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
    const orderNum = `AZK-${Math.floor(100000 + Math.random() * 900000)}`;
    const payLabel = details?.methodLabel || (paymentMethod === 'QRIS' ? 'QRIS (Pembayaran Digital Lunas)' : 'Tunai ke Driver Armada (COD)');
    const newOrder: CustomerOrder = {
      orderNumber: orderNum,
      serviceType: 'CARGO',
      serviceName: `Az Cargo — ${fareResult?.vehicleName || 'Armada Logistik'}`,
      pickupAddress,
      dropoffAddress,
      items: [
        { name: cargoDetails || 'Muatan Barang / Pindahan', quantity: 1, price: fareResult?.totalFare || 0 }
      ],
      totalAmount: fareResult?.totalFare || 0,
      paymentMethod: payLabel,
      paymentProofUrl: details?.paymentProofUrl,
      distanceKm: distanceKm,
      customerName: userToUse?.fullName || 'Siti Rahma',
      customerPhone: userToUse?.phone || '081299887766',
      createdAt: new Date().toISOString(),
      status: 'DRIVER_ASSIGNED',
      driverInfo: {
        name: 'Herman Sutanto',
        phone: '081377889900',
        vehicleType: 'TRUCK',
        vehiclePlate: 'L 8931 AB (Truk Engkel CDE)',
        rating: 4.95,
        currentLocation: { lat: -7.265, lng: 112.748 },
        etaMinutes: 18
      }
    };

    setLastPlacedOrder(newOrder);
    setOrderSuccess({
      orderNumber: orderNum,
      total: fareResult.totalFare
    });
    setShowPaymentModal(false);
    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }
  };

  const handleOrder = () => {
    if (!currentUser) {
      if (onRequestLogin) {
        onRequestLogin(
          'Silakan masuk atau daftar akun pelanggan terlebih dahulu untuk memilih opsi pembayaran (QRIS/Tunai) dan memesan armada Az Cargo.',
          () => setShowPaymentModal(true)
        );
      }
      return;
    }
    setShowPaymentModal(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Layanan
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 rounded-3xl p-6 text-white shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
          🚛 Az Cargo — Muatan Besar & Pindahan
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">Sewa Armada Angkutan Barang Besar</h2>
        <p className="text-indigo-100 text-xs mt-1">
          Pilihan armada pickup hingga truk engkel dengan bantuan tenaga angkut (*Helper*).
        </p>
      </div>

      {orderSuccess ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-indigo-600 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">Armada Az Cargo Sedang Ditugaskan!</h3>
          <p className="text-xs text-slate-600">Nomor Pesanan: <strong>{orderSuccess.orderNumber}</strong></p>
          <div className="p-4 bg-indigo-50 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-1 border border-indigo-100">
            <p>📍 <strong>Muat:</strong> {pickupAddress}</p>
            <p>🏁 <strong>Bongkar:</strong> {dropoffAddress}</p>
            <p>📦 <strong>Muatan:</strong> {cargoDetails}</p>
            <p>💵 <strong>Total Tarif:</strong> Rp {orderSuccess.total.toLocaleString('id-ID')}</p>
          </div>

          <div className="flex flex-col gap-2 max-w-sm mx-auto pt-2">
            {lastPlacedOrder && onTrackOrder && (
              <button
                onClick={() => onTrackOrder(lastPlacedOrder)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" /> Lacak Armada Az Cargo Saya (Live GPS)
              </button>
            )}
            <button
              onClick={() => {
                setOrderSuccess(null);
                setFareResult(null);
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Pesan Armada Lain
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          {/* Pilihan Jenis Armada */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              1. Pilih Jenis Kendaraan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicles.map(v => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => {
                    setVehicleType(v.type);
                    setFareResult(null);
                  }}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                    vehicleType === v.type
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl">{v.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{v.name}</h4>
                    <span className="text-[11px] font-semibold text-indigo-700 block">{v.capacity}</span>
                    <span className="text-[10px] text-slate-400 block">{v.dimensions}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rute & Muatan */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Rute & Detail Muatan
            </label>
            
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-600 font-semibold block mb-1">Titik Muat (Alamat Asal)</span>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={e => setPickupAddress(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-indigo-500"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600 font-semibold block mb-1">Titik Bongkar (Alamat Tujuan)</span>
                <input
                  type="text"
                  value={dropoffAddress}
                  onChange={e => setDropoffAddress(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-indigo-500"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600 font-semibold block mb-1">Deskripsi Barang yang Diangkut</span>
                <input
                  type="text"
                  value={cargoDetails}
                  onChange={e => setCargoDetails(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-600 font-semibold block mb-1">Estimasi Jarak (KM)</span>
                  <input
                    type="number"
                    min="1"
                    value={distanceKm}
                    onChange={e => {
                      setDistanceKm(parseFloat(e.target.value) || 1);
                      setFareResult(null);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-600 font-semibold block mb-1">Tenaga Angkut (Helper)</span>
                  <select
                    value={helperCount}
                    onChange={e => {
                      setHelperCount(parseInt(e.target.value) || 0);
                      setFareResult(null);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:outline-indigo-500"
                  >
                    <option value={0}>Tanpa Helper (Angkut Sendiri)</option>
                    <option value={1}>1 Helper (+Rp 50.000)</option>
                    <option value={2}>2 Helper (+Rp 100.000)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Tarif */}
          {fareResult ? (
            <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Total Tarif Az Cargo:</span>
                <span className="text-2xl font-black text-indigo-700">
                  Rp {fareResult.totalFare.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-indigo-200/60">
                <div className="flex justify-between">
                  <span>Armada ({fareResult.vehicleName}):</span>
                  <span>Rp {(fareResult.baseFare + fareResult.distanceFare).toLocaleString('id-ID')}</span>
                </div>
                {fareResult.helperFee > 0 && (
                  <div className="flex justify-between">
                    <span>Bantuan Tenaga Angkut ({helperCount} orang):</span>
                    <span>Rp {fareResult.helperFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Biaya Layanan Platform:</span>
                  <span>Rp {fareResult.appFee.toLocaleString('id-ID')}</span>
                </div>
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
                    Silakan masuk atau daftar akun pelanggan baru agar pesanan kargo Anda tercatat dan dapat dilacak real-time via GPS.
                  </p>
                  <button
                    type="button"
                    onClick={() => onRequestLogin && onRequestLogin('Silakan login sebagai pelanggan untuk memilih metode pembayaran & memesan armada Az Cargo.')}
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <UserIcon className="w-3.5 h-3.5" /> Masuk / Daftar Akun Pelanggan Sekarang
                  </button>
                </div>
              )}

              {/* Payment Preview Notice */}
              <div className="p-3 bg-white rounded-2xl border border-indigo-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-indigo-700" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Pilihan Pembayaran:</span>
                    <span className="text-[11px] text-slate-500">QRIS (Scan Bank/E-Wallet) atau Tunai ke Driver</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-md">
                  Pilih Opsi
                </span>
              </div>

              <button
                onClick={handleOrder}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {!currentUser ? (
                  <>
                    <Lock className="w-4 h-4 text-indigo-200" />
                    <span>Masuk & Pesan (Pilih Pembayaran)</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Pesan Az Cargo (Pilih QRIS / Tunai)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {loading ? 'Menghitung Tarif...' : 'Hitung Estimasi Biaya Cargo'}
            </button>
          )}
        </div>
      )}

      {/* Modal Pilihan Pembayaran Cargo (QRIS / Tunai) */}
      <OrderPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderTitle={`Az Cargo — ${fareResult?.vehicleName || 'Armada Logistik'}`}
        merchantName="Az Cargo Logistik"
        totalAmount={fareResult?.totalFare || 0}
        currentUser={currentUser}
        onRequestLogin={() => {
          if (onRequestLogin) {
            onRequestLogin('Silakan login sebagai pelanggan untuk melanjutkan pembayaran kargo.');
          }
        }}
        onConfirmPayment={(method, details) => {
          handleProceedCargoOrder(method, details);
        }}
      />
    </div>
  );
};
