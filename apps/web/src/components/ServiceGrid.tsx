import React, { useState } from 'react';
import { 
  Bike, 
  Package, 
  Zap, 
  Truck, 
  ShoppingCart, 
  MapPin, 
  Search,
  ArrowRight,
  Ban,
  X
} from 'lucide-react';

import { PartnerType } from '@delivery/shared';

interface ServiceGridProps {
  onSelectService: (serviceKey: string) => void;
  onOpenPartnerModal?: (type: PartnerType) => void;
  servicesConfig?: Array<{
    id: string;
    name: string;
    description?: string;
    isEnabled?: boolean;
    isActive?: boolean;
  }>;
  canTrack?: boolean;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ 
  onSelectService, 
  onOpenPartnerModal,
  servicesConfig,
  canTrack = false
}) => {
  const [disabledModalService, setDisabledModalService] = useState<any | null>(null);

  const isServiceActive = (serviceId: string) => {
    if (!servicesConfig || servicesConfig.length === 0) return true;
    const found = servicesConfig.find(
      c => c.id.toLowerCase() === serviceId.toLowerCase() ||
           c.id.toLowerCase() === `az_${serviceId}`.toLowerCase() ||
           c.id.toLowerCase().replace('az_', '') === serviceId.toLowerCase()
    );
    if (!found) return true;
    return found.isActive !== false && found.isEnabled !== false;
  };
  const allServices = [
    {
      id: 'delivery',
      name: 'Az Delivery',
      subtitle: 'Makanan, minuman, & barang',
      desc: 'Pesan makanan resto favorit atau kirim barang lokal instan.',
      icon: Bike,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      badge: 'Lokal Cepat'
    },
    {
      id: 'courier',
      name: 'Az Courier',
      subtitle: 'Kirim paket & dokumen',
      desc: 'Pengiriman reguler antar-kota/kecamatan hemat dengan nomor resi AWB.',
      icon: Package,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badge: 'Reguler'
    },
    {
      id: 'express',
      name: 'Az Express',
      subtitle: 'Pengiriman cepat prioritas',
      desc: 'Layanan kilat prioritas bergaransi sampai hari yang sama (Sameday).',
      icon: Zap,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      badge: 'Sameday'
    },
    {
      id: 'cargo',
      name: 'Az Cargo',
      subtitle: 'Barang besar & pindahan',
      desc: 'Muatan berat/banyak dengan armada Pickup Bak, Box, & Truk Engkel + Helper.',
      icon: Truck,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      badge: 'Tonase'
    },
    {
      id: 'mart',
      name: 'Az Mart',
      subtitle: 'Belanja harian & sembako',
      desc: 'Driver belanjakan kebutuhan minimarket, sayur, buah, & sembako ke rumah.',
      icon: ShoppingCart,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      badge: 'Concierge'
    },
    {
      id: 'pickup',
      name: 'Az Pickup',
      subtitle: 'Jemput barang ke lokasi',
      desc: 'Kurir datang langsung timbang & ambil paket di rumah/kantor Anda.',
      icon: MapPin,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      badge: 'First-Mile'
    },
    {
      id: 'tracking',
      name: 'Tracking',
      subtitle: 'Lacak pengiriman publik',
      desc: 'Cek posisi dan riwayat perjalanan resi AWB seluruh layanan AZ GO.',
      icon: Search,
      iconColor: 'text-slate-800',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-300',
      badge: 'Universal'
    }
  ];

  // Fitur lacak di tampilan awal hanya muncul untuk Admin, Pelanggan, atau Toko yang sudah login
  const services = allServices.filter(s => {
    if (s.id === 'tracking') return canTrack;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner AZ GO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3">
            ✨ SuperApp Ekspedisi & On-Demand Terpadu
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Antar Cepat, Kirim Mudah.
          </h2>
          <p className="text-blue-100 text-sm mt-2 leading-relaxed">
            Solusi kirim paket kilat, pesan makanan resto, sewa armada kargo pindahan, hingga belanja sembako. Cepat, aman, dan transparan dari A sampai Z bersama <strong>AZ GO</strong>.
          </p>
        </div>

        <div className="relative z-10 shrink-0 bg-white p-3 rounded-2xl shadow-xl border border-white/20 max-w-[280px] sm:max-w-[320px]">
          <img
            src="/logo-brand-card.png"
            alt="AZ GO — Antar Cepat, Kirim Mudah"
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>

        {/* Decorative Circles */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-44 h-44 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />
      </div>

      {/* Grid 7 Layanan */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Pilih Layanan AZ GO</h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {services.filter(s => isServiceActive(s.id)).length} dari {services.length} Layanan Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map(srv => {
            const Icon = srv.icon;
            const active = isServiceActive(srv.id);
            return (
              <button
                key={srv.id}
                onClick={() => {
                  if (active) {
                    onSelectService(srv.id);
                  } else {
                    setDisabledModalService(srv);
                  }
                }}
                className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between group relative overflow-hidden ${
                  active 
                    ? `bg-white ${srv.borderColor} shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer` 
                    : 'bg-slate-50/80 border-slate-200 opacity-70 grayscale-[35%] hover:border-rose-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-2xl ${active ? `${srv.bgColor} ${srv.iconColor} group-hover:scale-110` : 'bg-slate-200 text-slate-500'} transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {active ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {srv.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <Ban className="w-2.5 h-2.5" /> Nonaktif
                      </span>
                    )}
                  </div>

                  <h4 className={`font-extrabold text-base transition-colors ${active ? 'text-slate-900 group-hover:text-rose-600' : 'text-slate-600'}`}>
                    {srv.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{srv.subtitle}</p>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">{srv.desc}</p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                  active ? 'border-slate-100 text-rose-600' : 'border-slate-200 text-slate-400'
                }`}>
                  <span>{active ? 'Buka Layanan' : 'Ditutup Sementara'}</span>
                  {active ? (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <Ban className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner Ajukan Pendaftaran Mitra (Driver & Toko) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/50 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            🤝 Peluang Kemitraan AZ GO
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">
            Ingin Tambah Penghasilan atau Perluas Jangkauan Usaha Anda?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Bergabunglah bersama ribuan mitra sukses kami! Dapatkan penghasilan harian fleksibel sebagai pengemudi, atau tingkatkan omset restoran & toko sembako Anda di aplikasi AZ GO.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={() => onOpenPartnerModal?.('DRIVER')}
            className="px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition"
          >
            <Bike className="w-4 h-4 text-slate-950" />
            <span>Daftar Mitra Driver</span>
          </button>

          <button
            onClick={() => onOpenPartnerModal?.('MERCHANT')}
            className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-200" />
            <span>Daftar Toko / Resto / Mart</span>
          </button>
        </div>
      </div>

      {/* Modal Notifikasi Layanan Nonaktif */}
      {disabledModalService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100 text-center relative">
            <button
              onClick={() => setDisabledModalService(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Ban className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Layanan {disabledModalService.name} Ditutup Sementara</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Layanan ini sedang dinonaktifkan sementara oleh Administrator AZ GO dalam rangka pemeliharaan atau penyesuaian operasional.
              </p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-900 font-medium">
              💡 Anda dapat menggunakan layanan aktif lainnya dari menu utama.
            </div>
            <button
              onClick={() => setDisabledModalService(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

