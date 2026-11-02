import React, { useState, useMemo } from 'react';
import { 
  Bike, 
  Car, 
  Navigation, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowUpDown, 
  Phone, 
  MessageSquare, 
  Star, 
  Compass, 
  Radio
} from 'lucide-react';
import { User } from '@delivery/shared';
import { GoogleMapPickerModal, LocationPoint } from '../../components/GoogleMapPickerModal';
import { OrderPaymentModal, PaymentMethodType } from '../../components/OrderPaymentModal';
import { CustomerOrder } from '../customer/CustomerOrderTrackingModal';

export type RideVehicleCategory = 'MOTORBIKE' | 'CAR' | 'CAR_XL';

interface RideBookingProps {
  onBack: () => void;
  currentUser?: User | null;
  initialVehicleType?: 'MOTORBIKE' | 'CAR';
  onRequestLogin?: (message: string, callbackAfterLogin?: () => void) => void;
  onOrderCreated?: (order: CustomerOrder) => void;
  onTrackOrder?: (order: CustomerOrder) => void;
}

export const RideBooking: React.FC<RideBookingProps> = ({
  onBack,
  currentUser,
  initialVehicleType = 'MOTORBIKE',
  onRequestLogin,
  onOrderCreated,
  onTrackOrder
}) => {
  // 1. Titik Jemput & Tujuan
  const [pickup, setPickup] = useState<LocationPoint>({
    address: 'Stasiun Gubeng Baru, Surabaya',
    lat: -7.2655,
    lng: 112.7521,
    notes: ''
  });

  const [dropoff, setDropoff] = useState<LocationPoint>({
    address: 'Tunjungan Plaza (TP 6), Tegalsari, Surabaya',
    lat: -7.2617,
    lng: 112.7388,
    notes: ''
  });

  // Modal Peta Interaktif
  const [mapPickerTarget, setMapPickerTarget] = useState<'PICKUP' | 'DROPOFF' | null>(null);

  // Kategori Kendaraan yang Dipilih
  const [selectedVehicle, setSelectedVehicle] = useState<RideVehicleCategory>(
    initialVehicleType === 'CAR' ? 'CAR' : 'MOTORBIKE'
  );

  // Filter Tampilan (Semua, Hanya Motor, Hanya Mobil)
  const [filterFleet, setFilterFleet] = useState<'ALL' | 'MOTORBIKE' | 'CAR'>(
    initialVehicleType === 'CAR' ? 'CAR' : 'ALL'
  );

  // Catatan & Preferensi untuk Driver
  const [passengerNotes, setPassengerNotes] = useState<string>('');
  const [selectedQuickTags, setSelectedQuickTags] = useState<string[]>([]);

  // State Pemesanan & Pembayaran
  const [bookingState, setBookingState] = useState<'IDLE' | 'SEARCHING' | 'FOUND'>('IDLE');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [assignedDriver, setAssignedDriver] = useState<any>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<CustomerOrder | null>(null);

  // Hitung jarak otomatis berdasarkan koordinat (Haversine + street factor 1.35)
  const calculatedDistanceKm = useMemo(() => {
    if (!pickup.lat || !pickup.lng || !dropoff.lat || !dropoff.lng) return 4.5;
    const R = 6371; // Radius bumi KM
    const dLat = ((dropoff.lat - pickup.lat) * Math.PI) / 180;
    const dLng = ((dropoff.lng - pickup.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickup.lat * Math.PI) / 180) *
        Math.cos((dropoff.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightKm = R * c;
    // Kalikan faktor rute jalan raya perkotaan
    const streetKm = Math.round(straightKm * 1.35 * 10) / 10;
    return Math.max(1.0, streetKm);
  }, [pickup.lat, pickup.lng, dropoff.lat, dropoff.lng]);

  // Data Spesifikasi Armada Penumpang
  const fleetOptions = useMemo(() => [
    {
      type: 'MOTORBIKE' as RideVehicleCategory,
      name: 'Az Ride (Motor)',
      tagline: 'Ojek motor cepat & lincah',
      badge: 'Paling Hemat',
      capacity: '1 Penumpang',
      etaText: '3–5 Menit Jemput',
      icon: Bike,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-300',
      activeRing: 'ring-rose-500 border-rose-600 bg-rose-50/70',
      models: 'Honda Vario, Beat, Scoopy, PCX',
      features: ['Disediakan helm SNI bersih', 'Cepat menembus kemacetan', 'Jas hujan darurat'],
      baseFare: 10000, // 0 - 3 km
      baseKm: 3,
      perKm: 2500,
      appFee: 2000
    },
    {
      type: 'CAR' as RideVehicleCategory,
      name: 'Az Car (Mobil 4 Kursi)',
      tagline: 'City car / MPV ber-AC nyaman',
      badge: 'Nyaman & Aman Cuaca',
      capacity: '1–4 Penumpang',
      etaText: '5–8 Menit Jemput',
      icon: Car,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      activeRing: 'ring-blue-500 border-blue-600 bg-blue-50/70',
      models: 'Avanza, Brio, Calya, Xenia, Sigra',
      features: ['Mobil ber-AC sejuk', 'Bebas panas & terhindar hujan', 'Bagasi muat barang belanjaan'],
      baseFare: 18000, // 0 - 3 km
      baseKm: 3,
      perKm: 4500,
      appFee: 2000
    },
    {
      type: 'CAR_XL' as RideVehicleCategory,
      name: 'Az Car XL (Mobil Besar 6 Kursi)',
      tagline: 'MPV 3-baris luas & lega',
      badge: 'Rombongan & Koper',
      capacity: '1–6 Penumpang',
      etaText: '7–12 Menit Jemput',
      icon: Car,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300',
      activeRing: 'ring-indigo-500 border-indigo-600 bg-indigo-50/70',
      models: 'Innova Reborn, Ertiga, XL7, Rush',
      features: ['Ruang kabin 3-baris lega', 'Kapasitas bagasi ekstra koper', 'Cocok perjalanan keluarga'],
      baseFare: 24000, // 0 - 3 km
      baseKm: 3,
      perKm: 6000,
      appFee: 2000
    }
  ], []);

  // Hitung Tarif Tiap Armada
  const calculatedFares = useMemo(() => {
    return fleetOptions.map(fleet => {
      let distanceFare = 0;
      if (calculatedDistanceKm > fleet.baseKm) {
        distanceFare = Math.round((calculatedDistanceKm - fleet.baseKm) * fleet.perKm);
      }
      const total = fleet.baseFare + distanceFare + fleet.appFee;
      return {
        ...fleet,
        distanceFare,
        totalFare: total
      };
    });
  }, [fleetOptions, calculatedDistanceKm]);

  // Armada yang sedang dipilih
  const currentSelectedFleet = useMemo(() => {
    return calculatedFares.find(f => f.type === selectedVehicle) || calculatedFares[0];
  }, [calculatedFares, selectedVehicle]);

  // Tukar Posisi Jemput & Tujuan
  const handleSwapLocations = () => {
    const temp = { ...pickup };
    setPickup({ ...dropoff });
    setDropoff(temp);
  };

  // Quick Tags Catatan Driver
  const quickTags = [
    '🪖 Bawa helm cadangan',
    '📍 Tunggu di lobi utama / drop-off',
    '🎒 Ada tas ransel / barang belanjaan',
    '❄️ Mohon AC mobil dinyalakan sejuk',
    '🤫 Sedang telepon / perjalanan hening'
  ];

  const handleToggleTag = (tag: string) => {
    if (selectedQuickTags.includes(tag)) {
      setSelectedQuickTags(selectedQuickTags.filter(t => t !== tag));
    } else {
      setSelectedQuickTags([...selectedQuickTags, tag]);
    }
  };

  // Eksekusi Pemesanan
  const handleStartBooking = () => {
    if (!currentUser) {
      if (onRequestLogin) {
        onRequestLogin(
          'Silakan masuk atau daftar akun pelanggan untuk memesan armada Az Ride / Az Car.',
          () => setShowPaymentModal(true)
        );
      }
      return;
    }
    setShowPaymentModal(true);
  };

  // Konfirmasi Pembayaran dan Pencarian Driver
  const handleConfirmPayment = (
    paymentMethod: PaymentMethodType = 'CASH',
    details?: {
      methodLabel: string;
      cashChangeNote?: string;
      isPaid: boolean;
      paymentProofUrl?: string;
      paymentProofName?: string;
      senderAccountName?: string;
    }
  ) => {
    setShowPaymentModal(false);
    setBookingState('SEARCHING');

    const orderNum = `AZR-${Math.floor(100000 + Math.random() * 900000)}`;
    const payLabel = details?.methodLabel || (paymentMethod === 'QRIS' ? 'QRIS Standar BI (Lunas)' : 'Tunai ke Driver saat tiba');
    
    // Gabungkan catatan
    const combinedNotes = [
      ...selectedQuickTags,
      passengerNotes.trim() ? `Catatan: ${passengerNotes.trim()}` : ''
    ].filter(Boolean).join(' • ');

    const newOrder: CustomerOrder = {
      orderNumber: orderNum,
      serviceType: 'RIDE',
      serviceName: currentSelectedFleet.name,
      pickupAddress: pickup.address,
      dropoffAddress: dropoff.address,
      items: [
        {
          name: `Perjalanan Penumpang (${currentSelectedFleet.capacity})${combinedNotes ? ' — ' + combinedNotes : ''}`,
          quantity: 1,
          price: currentSelectedFleet.totalFare
        }
      ],
      totalAmount: currentSelectedFleet.totalFare,
      paymentMethod: payLabel,
      paymentProofUrl: details?.paymentProofUrl,
      distanceKm: calculatedDistanceKm,
      customerName: currentUser?.fullName || 'Siti Rahma',
      customerPhone: currentUser?.phone || '081299887766',
      createdAt: new Date().toISOString(),
      status: 'DRIVER_ASSIGNED',
      driverInfo: {
        name: selectedVehicle === 'MOTORBIKE' ? 'Rudi Hartono' : 'Bambang Pamungkas',
        phone: selectedVehicle === 'MOTORBIKE' ? '081233445566' : '081288990011',
        rating: 4.96,
        vehicleType: selectedVehicle === 'MOTORBIKE' ? 'MOTOR' : 'CAR',
        vehicleModel: selectedVehicle === 'MOTORBIKE' ? 'Honda Vario 160 Hitam' : 'Toyota Avanza 1.5 G Silver',
        vehiclePlate: selectedVehicle === 'MOTORBIKE' ? 'L 4921 AZG' : 'L 1892 AB',
        etaMinutes: selectedVehicle === 'MOTORBIKE' ? 3 : 5
      }
    };

    // Simulasi radar pencarian driver terdekat (3 detik)
    setTimeout(() => {
      setAssignedDriver(newOrder.driverInfo);
      setLastPlacedOrder(newOrder);
      setBookingState('FOUND');

      if (onOrderCreated) {
        onOrderCreated(newOrder);
      }
    }, 2800);
  };

  const filteredFleetList = useMemo(() => {
    if (filterFleet === 'MOTORBIKE') return calculatedFares.filter(f => f.type === 'MOTORBIKE');
    if (filterFleet === 'CAR') return calculatedFares.filter(f => f.type === 'CAR' || f.type === 'CAR_XL');
    return calculatedFares;
  }, [calculatedFares, filterFleet]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
            title="Kembali ke Menu Utama"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Az Ride & Car
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                <Navigation className="w-3 h-3" /> Penumpang Online
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Antar jemput penumpang motor & mobil ber-AC cepat, aman, dan nyaman.
            </p>
          </div>
        </div>

        {/* Filter Cepat Armada */}
        <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilterFleet('ALL')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filterFleet === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterFleet('MOTORBIKE');
              setSelectedVehicle('MOTORBIKE');
            }}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
              filterFleet === 'MOTORBIKE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bike className="w-3.5 h-3.5" /> Motor
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterFleet('CAR');
              if (selectedVehicle === 'MOTORBIKE') setSelectedVehicle('CAR');
            }}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
              filterFleet === 'CAR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-3.5 h-3.5" /> Mobil
          </button>
        </div>
      </div>

      {/* 2. FORM PEMESANAN (JIKA BELUM DISPATCH / IDLE) */}
      {bookingState === 'IDLE' && (
        <div className="space-y-6">
          
          {/* A. CARD LOKASI JEMPUT & TUJUAN */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-rose-600" /> Tentukan Rute Perjalanan
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Estimasi Jarak: {calculatedDistanceKm} KM
              </span>
            </div>

            <div className="relative space-y-3">
              {/* Titik Jemput */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-400 transition flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                        Lokasi Penjemputan Anda
                      </span>
                    </div>
                    <input
                      type="text"
                      value={pickup.address}
                      onChange={e => setPickup({ ...pickup, address: e.target.value })}
                      placeholder="Masukkan alamat atau nama tempat penjemputan..."
                      className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder-slate-400 mt-0.5"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMapPickerTarget('PICKUP')}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
                  title="Pilih Titik di Peta"
                >
                  <MapPin className="w-3.5 h-3.5" /> Peta
                </button>
              </div>

              {/* Tombol Swap Titik */}
              <div className="absolute left-7 top-[48px] z-10 -translate-x-1/2">
                <button
                  type="button"
                  onClick={handleSwapLocations}
                  className="w-8 h-8 rounded-full bg-slate-900 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
                  title="Tukar Posisi Jemput & Tujuan"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>

              {/* Titik Tujuan */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-rose-400 transition flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
                        Alamat Tujuan Perjalanan
                      </span>
                    </div>
                    <input
                      type="text"
                      value={dropoff.address}
                      onChange={e => setDropoff({ ...dropoff, address: e.target.value })}
                      placeholder="Masukkan alamat atau tempat tujuan..."
                      className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder-slate-400 mt-0.5"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMapPickerTarget('DROPOFF')}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
                  title="Pilih Titik di Peta"
                >
                  <Navigation className="w-3.5 h-3.5" /> Peta
                </button>
              </div>
            </div>

            {/* Quick Landmarks Shortcuts */}
            <div className="pt-2 flex items-center gap-2 flex-wrap text-[11px]">
              <span className="text-slate-400 font-medium">Tujuan Populer:</span>
              {[
                { name: 'Tunjungan Plaza (TP)', lat: -7.2617, lng: 112.7388 },
                { name: 'Stasiun Gubeng Baru', lat: -7.2655, lng: 112.7521 },
                { name: 'Bandara Juanda (T1)', lat: -7.3798, lng: 112.7876 },
                { name: 'Pakuwon Mall', lat: -7.2965, lng: 112.6780 }
              ].map((lm) => (
                <button
                  key={lm.name}
                  type="button"
                  onClick={() => setDropoff({ address: `${lm.name}, Surabaya`, lat: lm.lat, lng: lm.lng })}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-medium cursor-pointer"
                >
                  {lm.name}
                </button>
              ))}
            </div>
          </div>

          {/* B. PILIHAN ARMADA KENDARAAN (ALA GOJEK / GRAB) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-blue-600" /> Pilih Tipe Kendaraan & Bandingkan Tarif
              </span>
              <span className="text-xs text-slate-500">
                Pilih sesuai kebutuhan & jumlah orang
              </span>
            </div>

            <div className="space-y-3">
              {filteredFleetList.map((fleet) => {
                const isSelected = selectedVehicle === fleet.type;
                const FleetIcon = fleet.icon;
                return (
                  <div
                    key={fleet.type}
                    onClick={() => setSelectedVehicle(fleet.type)}
                    className={`p-4 rounded-3xl border-2 transition cursor-pointer relative bg-white ${
                      isSelected
                        ? `${fleet.activeRing} shadow-md`
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Left: Icon & Fleet Details */}
                      <div className="flex items-start gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl ${fleet.bgColor} ${fleet.iconColor} flex items-center justify-center shrink-0 shadow-xs border ${fleet.borderColor}`}>
                          <FleetIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 text-base">
                              {fleet.name}
                            </h4>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              {fleet.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{fleet.tagline}</p>

                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1 font-bold text-slate-800">
                              <Users className="w-3.5 h-3.5 text-slate-500" /> {fleet.capacity}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                              <Clock className="w-3.5 h-3.5" /> {fleet.etaText}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Total Fare & Radio Indicator */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="text-right">
                          <span className="text-[11px] text-slate-500 block">Tarif Perjalanan:</span>
                          <span className="text-xl sm:text-2xl font-black text-slate-900">
                            Rp {fleet.totalFare.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">
                          Termasuk Jasa Aplikasi Rp {fleet.appFee.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Fitur & Model Kendaraan */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2 flex-wrap text-[11px]">
                          {fleet.features.map((feat, idx) => (
                            <span key={idx} className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {feat}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium italic">
                          Model: {fleet.models}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. CATATAN & PREFERENSI PENUMPANG */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-500" /> Catatan Tambahan untuk Driver (Opsional)
            </span>

            {/* Quick Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {quickTags.map((tag) => {
                const isSelected = selectedQuickTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Note Input */}
            <input
              type="text"
              value={passengerNotes}
              onChange={e => setPassengerNotes(e.target.value)}
              placeholder="Contoh: Saya tunggu di samping lobi lobby utara dekat pos satpam..."
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-rose-500"
            />
          </div>

          {/* D. RINCIAN BIAYA & TOMBOL PESAN SEKARANG */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs text-slate-400 block">Total yang Harus Dibayar:</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">
                  Rp {currentSelectedFleet.totalFare.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="font-extrabold text-white block">{currentSelectedFleet.name}</span>
                <span className="text-slate-400">Jarak {calculatedDistanceKm} KM • ~{Math.round(calculatedDistanceKm * 2.5)} Mnt</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Tarif Pasti & Termasuk Perlindungan Asuransi
              </span>
              <span className="text-[11px] text-amber-300">
                Pilihan Bayar: Tunai (COD) / QRIS
              </span>
            </div>

            <button
              type="button"
              onClick={handleStartBooking}
              className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-rose-900/40 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-5 h-5" />
              <span>Pesan {currentSelectedFleet.name} Sekarang</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. SIMULASI RADAR PENCARIAN DRIVER (SEARCHING STATE) */}
      {bookingState === 'SEARCHING' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
          
          {/* Radar Animation */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping"></div>
            <div className="absolute -inset-4 rounded-full bg-rose-500/10 animate-pulse"></div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-xl z-10">
              {selectedVehicle === 'MOTORBIKE' ? (
                <Bike className="w-10 h-10 animate-bounce" />
              ) : (
                <Car className="w-10 h-10 animate-bounce" />
              )}
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-black text-slate-900">
              Menghubungi Pengemudi Terdekat...
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sistem AZ GO sedang mencocokkan perjalanan Anda dengan mitra driver {selectedVehicle === 'MOTORBIKE' ? 'motor' : 'mobil'} di sekitar {pickup.address}.
            </p>
          </div>

          {/* Rute Preview Ringkas */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
            <p className="flex items-center gap-2 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <strong>Jemput:</strong> {pickup.address}
            </p>
            <p className="flex items-center gap-2 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <strong>Tujuan:</strong> {dropoff.address}
            </p>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-slate-600 font-bold">
              <span>Total Tarif: Rp {currentSelectedFleet.totalFare.toLocaleString('id-ID')}</span>
              <span>Jarak: {calculatedDistanceKm} KM</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold">
            <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
            Alokasi otomatis armada resmi AZ GO dalam beberapa detik...
          </div>
        </div>
      )}

      {/* 4. DRIVER DITEMUKAN & PERJALANAN AKTIF (FOUND STATE) */}
      {bookingState === 'FOUND' && assignedDriver && lastPlacedOrder && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl shadow-xs">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Pengemudi Dikonfirmasi
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  Driver Sedang Menuju Lokasi Anda!
                </h3>
                <p className="text-xs text-slate-500">
                  No. Pesanan: <strong className="font-mono text-slate-900">{lastPlacedOrder.orderNumber}</strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Estimasi Sampai:</span>
              <span className="text-xl font-black text-rose-600">~{assignedDriver.etaMinutes} Menit</span>
            </div>
          </div>

          {/* Kartu Profil Driver Lengkap */}
          <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-amber-400">
                {assignedDriver.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-base text-slate-900">{assignedDriver.name}</h4>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-black border border-amber-300">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {assignedDriver.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-bold mt-0.5">
                  {assignedDriver.vehicleModel}
                </p>
                <div className="mt-1.5 inline-block px-3 py-1 bg-white rounded-lg border border-slate-300 font-mono font-black text-sm text-slate-900 tracking-wider shadow-xs">
                  {assignedDriver.vehiclePlate}
                </div>
              </div>
            </div>

            {/* Tombol Kontak Cepat Driver */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://wa.me/62${assignedDriver.phone.replace(/^0/, '')}?text=${encodeURIComponent(`Halo Mas ${assignedDriver.name}, saya penumpang AZ GO pesanan ${lastPlacedOrder.orderNumber}. Saya tunggu di ${pickup.address} ya.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat WA</span>
              </a>

              <a
                href={`tel:${assignedDriver.phone}`}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Telepon</span>
              </a>
            </div>
          </div>

          {/* Rute & Rincian Pembayaran */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0"></span>
              <p className="text-slate-700"><strong>Penjemputan:</strong> {pickup.address}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 mt-1 shrink-0"></span>
              <p className="text-slate-700"><strong>Tujuan:</strong> {dropoff.address}</p>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-800">
              <span>Metode: {lastPlacedOrder.paymentMethod}</span>
              <span className="text-sm font-black text-rose-600">Total: Rp {lastPlacedOrder.totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {onTrackOrder && (
              <button
                type="button"
                onClick={() => onTrackOrder(lastPlacedOrder)}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black shadow-md shadow-rose-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Buka Live Tracking Peta</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setBookingState('IDLE');
                setAssignedDriver(null);
                setLastPlacedOrder(null);
              }}
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pesan Perjalanan Lain</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL PEMILIH PETA GOOGLE / LEAFLET */}
      {mapPickerTarget && (
        <GoogleMapPickerModal
          isOpen={Boolean(mapPickerTarget)}
          onClose={() => setMapPickerTarget(null)}
          targetTitle={mapPickerTarget === 'PICKUP' ? 'Pilih Titik Penjemputan Penumpang' : 'Pilih Titik Tujuan Perjalanan'}
          targetType={mapPickerTarget}
          currentPoint={mapPickerTarget === 'PICKUP' ? pickup : dropoff}
          onSelectLocation={(point) => {
            if (mapPickerTarget === 'PICKUP') {
              setPickup(point);
            } else {
              setDropoff(point);
            }
            setMapPickerTarget(null);
          }}
        />
      )}

      {/* MODAL PEMBAYARAN RESMI AZ GO (CASH / QRIS) */}
      <OrderPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderTitle={`Perjalanan Penumpang — ${currentSelectedFleet.name} (${calculatedDistanceKm} KM)`}
        totalAmount={currentSelectedFleet.totalFare}
        currentUser={currentUser}
        onRequestLogin={() => {
          if (onRequestLogin) {
            onRequestLogin('Silakan masuk untuk melanjutkan pembayaran pesanan perjalanan Anda.');
          }
        }}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
};
