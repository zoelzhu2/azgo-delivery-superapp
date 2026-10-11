import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  Bike, 
  UtensilsCrossed, 
  Store, 
  ChevronRight,
  ShieldCheck,
  Receipt,
  Eye,
  FileCheck
} from 'lucide-react';
import { GoogleMapsDriverNav } from '../../components/GoogleMapsDriverNav';

export interface CustomerOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CustomerOrder {
  orderNumber: string;
  serviceType: 'FOOD' | 'MART' | 'LOCAL_GOODS' | 'COURIER' | 'CARGO' | 'PICKUP' | 'EXPEDITION';
  serviceName: string;
  merchantName?: string;
  pickupAddress: string;
  dropoffAddress: string;
  items?: CustomerOrderItem[];
  totalAmount: number;
  paymentMethod?: string;
  paymentProofUrl?: string;
  distanceKm: number;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  status: 'ACCEPTED' | 'PREPARING' | 'PICKING_UP' | 'IN_TRANSIT' | 'COMPLETED' | 'DRIVER_ASSIGNED' | 'ON_THE_WAY';
  driver?: {
    name: string;
    phone: string;
    rating: number;
    vehicleModel: string;
    vehiclePlate: string;
    photoUrl?: string;
  };
  driverInfo?: any;
}

interface CustomerOrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CustomerOrder | null;
  onUpdateOrderStatus?: (orderNumber: string, nextStatus: CustomerOrder['status']) => void;
}

export const CustomerOrderTrackingModal: React.FC<CustomerOrderTrackingModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateOrderStatus
}) => {
  const [currentStatus, setCurrentStatus] = useState<CustomerOrder['status']>(order?.status || 'PREPARING');
  const [showProofZoom, setShowProofZoom] = useState(false);

  useEffect(() => {
    if (order?.status) {
      setCurrentStatus(order.status);
    }
  }, [order?.status, order?.orderNumber]);

  if (!isOpen || !order) return null;

  const defaultDriver = order.driver || (order.driverInfo ? {
    name: order.driverInfo.name || 'Rudi Hartono',
    phone: order.driverInfo.phone || '081233445566',
    rating: order.driverInfo.rating || 4.9,
    vehicleModel: order.driverInfo.vehiclePlate || 'Honda Vario 160 Hitam',
    vehiclePlate: order.driverInfo.vehiclePlate || 'L 4921 AZG'
  } : {
    name: 'Rudi Hartono',
    phone: '081233445566',
    rating: 4.9,
    vehicleModel: 'Honda Vario 160 Hitam',
    vehiclePlate: 'L 4921 AZG'
  });

  // Convert status to stepper stages
  const isFoodOrMart = order.serviceType === 'FOOD' || order.serviceType === 'MART';

  const steps = isFoodOrMart ? [
    { key: 'ACCEPTED', label: 'Pesanan Diterima', desc: 'Resto/Toko telah menerima pesanan' },
    { key: 'PREPARING', label: 'Sedang Disiapkan', desc: 'Makanan/barang sedang dikemas rapi' },
    { key: 'PICKING_UP', label: 'Kurir Menjemput', desc: 'Driver menuju toko mengambil pesanan' },
    { key: 'IN_TRANSIT', label: 'Sedang Diantar', desc: 'Driver dalam perjalanan ke alamat Anda' },
    { key: 'COMPLETED', label: 'Tiba di Tujuan', desc: 'Pesanan telah diterima pelanggan' }
  ] : [
    { key: 'ACCEPTED', label: 'Permintaan Diterima', desc: 'Sistem mengalokasikan armada terdekat' },
    { key: 'PICKING_UP', label: 'Kurir Menjemput', desc: 'Kurir motor/truk menuju lokasi jemput' },
    { key: 'IN_TRANSIT', label: 'Dalam Pengiriman', desc: 'Paket melaju menuju alamat penerima' },
    { key: 'COMPLETED', label: 'Berhasil Terkirim', desc: 'Paket telah sampai di tangan penerima' }
  ];

  const getStepIndex = (st: string) => {
    if (st === 'DRIVER_ASSIGNED') {
      const idx = steps.findIndex(s => s.key === 'PICKING_UP');
      return idx >= 0 ? idx : 1;
    }
    if (st === 'ON_THE_WAY') {
      const idx = steps.findIndex(s => s.key === 'IN_TRANSIT');
      return idx >= 0 ? idx : 2;
    }
    const idx = steps.findIndex(s => s.key === st);
    return idx >= 0 ? idx : 1;
  };
  const activeStepIdx = Math.max(0, getStepIndex(currentStatus));

  // Map tracking status to GoogleMapsDriverNav tripPhase
  const getMapPhase = (): 'OFFER' | 'PICKING_UP' | 'ARRIVED_PICKUP' | 'IN_TRANSIT' | 'COMPLETED' => {
    if (currentStatus === 'ACCEPTED' || currentStatus === 'PREPARING') return 'PICKING_UP';
    if (currentStatus === 'PICKING_UP' || currentStatus === 'DRIVER_ASSIGNED') return 'PICKING_UP';
    if (currentStatus === 'IN_TRANSIT' || currentStatus === 'ON_THE_WAY') return 'IN_TRANSIT';
    if (currentStatus === 'COMPLETED') return 'COMPLETED';
    return 'IN_TRANSIT';
  };

  // Advance simulation step
  const handleAdvanceStep = () => {
    const nextIdx = Math.min(steps.length - 1, activeStepIdx + 1);
    const nextStatus = steps[nextIdx].key as CustomerOrder['status'];
    setCurrentStatus(nextStatus);
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(order.orderNumber, nextStatus);
    }
  };

  const estimatedMinutes = currentStatus === 'COMPLETED' 
    ? 0 
    : currentStatus === 'IN_TRANSIT' 
      ? Math.max(4, Math.round(order.distanceKm * 1.8)) 
      : Math.max(8, Math.round(order.distanceKm * 2.5));

  const waUrl = `https://wa.me/62${defaultDriver.phone.replace(/^0/, '')}?text=${encodeURIComponent(`Halo ${defaultDriver.name}, saya pelanggan pesanan AZ GO (${order.orderNumber}). Mohon info posisi dan kondisi pesanan ya.`)}`;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER BAR */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              {order.serviceType === 'FOOD' ? <UtensilsCrossed className="w-5 h-5" /> : 
               order.serviceType === 'MART' ? <Store className="w-5 h-5" /> : 
               <Bike className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Live Tracking Pesanan</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 animate-pulse">
                  ● Real-time GPS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {order.serviceName} • <span className="font-mono text-amber-400 font-bold">{order.orderNumber}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Tutup Halaman Tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* 1. ETA COUNTDOWN & STATUS BANNER */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            currentStatus === 'COMPLETED' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                currentStatus === 'COMPLETED' ? 'bg-emerald-600 text-white shadow-md' : 'bg-amber-500 text-slate-950 shadow-md'
              }`}>
                {currentStatus === 'COMPLETED' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6 animate-spin" />}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-amber-700">
                  {currentStatus === 'COMPLETED' ? 'Pesanan Selesai' : 'Estimasi Waktu Tiba (ETA)'}
                </span>
                <p className="text-xl font-black">
                  {currentStatus === 'COMPLETED' ? 'Pesanan Telah Tiba!' : `~${estimatedMinutes} Menit Menuju Alamat Anda`}
                </p>
                <span className="text-xs text-slate-600">
                  {steps[activeStepIdx]?.desc}
                </span>
              </div>
            </div>

            {/* Demo Step Forward Button */}
            {currentStatus !== 'COMPLETED' && (
              <button
                type="button"
                onClick={handleAdvanceStep}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1 shrink-0 self-end sm:self-auto"
                title="Simulasikan langkah perjalanan kurir selanjutnya"
              >
                <span>Simulasikan Progres</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. REAL-TIME GOOGLE MAPS ANIMATED NAVIGATION VIEW */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                Peta Pergerakan Kurir Google Maps (Live Tracking):
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Jarak: {order.distanceKm} KM
              </span>
            </div>

            {/* Embedded Realistic Google Maps Navigation */}
            <GoogleMapsDriverNav
              pickupAddress={order.pickupAddress}
              dropoffAddress={order.dropoffAddress}
              distanceKm={order.distanceKm}
              serviceName={order.serviceName}
              orderNumber={order.orderNumber}
              tripPhase={getMapPhase()}
              heightClass="h-60 sm:h-72"
            />
          </div>

          {/* 3. STEPPER TAHAPAN PESANAN */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Tahapan Pengantaran:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {steps.map((st, i) => {
                const isPassed = i <= activeStepIdx;
                const isCurrent = i === activeStepIdx;
                return (
                  <div 
                    key={st.key}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col justify-between ${
                      isCurrent 
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30 shadow-xs'
                        : isPassed 
                          ? 'bg-white border-emerald-300 text-emerald-900'
                          : 'bg-white/60 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full bg-amber-500 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
                          {i + 1}
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 font-bold text-[9px] flex items-center justify-center">
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <span className={`text-[11px] font-black block leading-tight ${isCurrent ? 'text-amber-900' : isPassed ? 'text-emerald-950' : 'text-slate-500'}`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. DRIVER PROFILE & HUBUNGI KURIR */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-13 h-13 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black shadow-md border-2 border-amber-400">
                  🛵
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{defaultDriver.name}</h4>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500 stroke-none" /> {defaultDriver.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {defaultDriver.vehicleModel} • <strong className="text-slate-800 font-mono">{defaultDriver.vehiclePlate}</strong>
                </p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> Mitra Terverifikasi AZ GO
                </span>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>

              <a
                href={`tel:${defaultDriver.phone}`}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Phone className="w-3.5 h-3.5" /> Telepon
              </a>
            </div>
          </div>

          {/* 5. RINCIAN PESANAN & ALAMAT PENGANTARAN */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-amber-600" /> Rincian Transaksi
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </span>
            </div>

            {/* Address points */}
            <div className="space-y-1.5 text-slate-600">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Titik Jemput:</strong> {order.pickupAddress}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Alamat Anda:</strong> {order.dropoffAddress}</span>
              </p>
            </div>

            {/* Items bought */}
            {order.items && order.items.length > 0 && (
              <div className="pt-2 border-t border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block">Daftar Menu / Produk:</span>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700 py-0.5">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-semibold">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total Paid */}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Total Pembayaran:</span>
              <span className="text-amber-700 text-base">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <p className="text-[10px] text-slate-400 text-right">
              Metode: {order.paymentMethod || 'Tunai / COD saat pesanan tiba'}
            </p>

            {/* Bukti Pembayaran QRIS Terlampir */}
            {order.paymentProofUrl && (
              <div className="pt-2.5 border-t border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Bukti Pembayaran QRIS:
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Terverifikasi
                  </span>
                </div>
                <div 
                  onClick={() => setShowProofZoom(true)}
                  className="p-2 bg-white rounded-xl border border-emerald-300 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 transition group shadow-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img 
                      src={order.paymentProofUrl} 
                      alt="Struk Bukti Bayar QRIS" 
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="truncate text-xs">
                      <p className="font-extrabold text-slate-900 group-hover:text-emerald-700 truncate">
                        Struk Transfer QRIS (Klik untuk Zoom)
                      </p>
                      <p className="text-[10px] text-slate-400">Bukti resmi terlampir pada pesanan ini</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 mr-1" />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center gap-3">
          <p className="text-xs text-slate-500 hidden sm:block">
            Tracking otomatis tetap berjalan meskipun jendela ini diminimalkan.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition ml-auto"
          >
            Tutup (Minimalkan Tracking)
          </button>
        </div>

      </div>

      {/* Modal Zoom Foto Bukti Pembayaran */}
      {showProofZoom && order.paymentProofUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Bukti Pembayaran QRIS ({order.orderNumber})
              </h4>
              <button
                type="button"
                onClick={() => setShowProofZoom(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="max-h-[65vh] overflow-y-auto rounded-2xl bg-slate-50 flex items-center justify-center p-2 border border-slate-200">
              <img
                src={order.paymentProofUrl}
                alt="Bukti Transfer QRIS Penuh"
                className="max-h-[60vh] w-auto object-contain rounded-xl shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-500">
                <span className="font-bold text-slate-800 block">Status: Terlampir & Terverifikasi</span>
                <span>Driver & Merchant dapat memverifikasi bukti ini</span>
              </div>
              <button
                type="button"
                onClick={() => setShowProofZoom(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
