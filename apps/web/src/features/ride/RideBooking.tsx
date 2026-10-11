import React, { useState } from 'react';
import { api } from '../../services/apiClient';
import { Bike, Car, MapPin, Navigation, CheckCircle2 } from 'lucide-react';

export const RideBooking: React.FC = () => {
  const [pickup, setPickup] = useState('Stasiun Gubeng, Surabaya');
  const [dropoff, setDropoff] = useState('Tunjungan Plaza 6, Genteng, Surabaya');
  const [vehicleType, setVehicleType] = useState<'MOTORBIKE' | 'CAR'>('MOTORBIKE');
  const [distanceKm, setDistanceKm] = useState(4.5);
  const [fareEstimate, setFareEstimate] = useState<any>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const handleEstimate = async () => {
    setLoadingEstimate(true);
    try {
      const res = await api.estimateRide({ distanceKm, vehicleType });
      if (res.success) {
        setFareEstimate(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEstimate(false);
    }
  };

  const handleOrder = async () => {
    try {
      const res = await api.orderRide({
        customerId: 'user-demo',
        pickupAddress: pickup,
        dropoffAddress: dropoff,
        distanceKm,
        vehicleType
      });
      if (res.success) {
        setCreatedOrder(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-rose-600" />
          Pesan Ojek & Taksi Online (Ride Hailing)
        </h3>

        {createdOrder ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 text-lg">Driver Sedang Dicari!</h4>
            <p className="text-xs text-emerald-700">Nomor Pesanan: <strong>{createdOrder.orderNumber}</strong></p>
            <div className="text-xs text-slate-600 py-2 border-y border-emerald-200/60 max-w-sm mx-auto text-left space-y-1">
              <p>📍 <strong>Jemput:</strong> {createdOrder.pickup.address}</p>
              <p>🏁 <strong>Tujuan:</strong> {createdOrder.dropoff.address}</p>
              <p>💵 <strong>Total Tarif:</strong> Rp {createdOrder.totalAmount.toLocaleString('id-ID')}</p>
            </div>
            <button
              onClick={() => setCreatedOrder(null)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
            >
              Pesan Rute Lain
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Titik Penjemputan
                </label>
                <input
                  type="text"
                  value={pickup}
                  onChange={e => setPickup(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" /> Titik Tujuan
                </label>
                <input
                  type="text"
                  value={dropoff}
                  onChange={e => setDropoff(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Simulasi Jarak (KM)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={distanceKm}
                  onChange={e => {
                    setDistanceKm(parseFloat(e.target.value) || 0);
                    setFareEstimate(null);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                />
              </div>
            </div>

            {/* Pilihan Kendaraan */}
            <div>
              <span className="block text-xs font-semibold text-slate-600 mb-2">Pilih Jenis Kendaraan:</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setVehicleType('MOTORBIKE');
                    setFareEstimate(null);
                  }}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition ${
                    vehicleType === 'MOTORBIKE'
                      ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2.5 bg-rose-100 text-rose-700 rounded-lg">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">Motor (Ride)</h5>
                    <p className="text-[11px] text-slate-500">Cepat & bebas macet</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVehicleType('CAR');
                    setFareEstimate(null);
                  }}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition ${
                    vehicleType === 'CAR'
                      ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2.5 bg-rose-100 text-rose-700 rounded-lg">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">Mobil (Car)</h5>
                    <p className="text-[11px] text-slate-500">Nyaman & ber-AC</p>
                  </div>
                </button>
              </div>
            </div>

            {fareEstimate ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-semibold">Estimasi Total Tarif:</span>
                  <span className="text-xl font-extrabold text-rose-600">
                    Rp {fareEstimate.totalFare.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-200/60 pt-2">
                  <span>Dasar: Rp {fareEstimate.baseFare.toLocaleString('id-ID')}</span>
                  <span>Jarak ({distanceKm} km): Rp {fareEstimate.distanceFare.toLocaleString('id-ID')}</span>
                  <span>Aplikasi: Rp {fareEstimate.appFee.toLocaleString('id-ID')}</span>
                </div>
                <button
                  onClick={handleOrder}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-md transition"
                >
                  Pesan Sekarang (Cari Pengemudi)
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEstimate}
                disabled={loadingEstimate}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition"
              >
                {loadingEstimate ? 'Menghitung...' : 'Hitung Estimasi Biaya Perjalanan'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
