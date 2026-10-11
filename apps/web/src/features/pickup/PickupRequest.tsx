import React, { useState } from 'react';
import { api } from '../../services/apiClient';
import { User } from '@delivery/shared';
import { CustomerOrder } from '../customer/CustomerOrderTrackingModal';
import { MapPin, Clock, CheckCircle2, ArrowLeft, Lock, Bike } from 'lucide-react';

interface PickupRequestProps {
  onBack: () => void;
  onGoToCourier: () => void;
  currentUser?: User | null;
  onRequestLogin?: (message: string, callback?: () => void) => void;
  onOrderCreated?: (order: CustomerOrder) => void;
  onTrackOrder?: (order: CustomerOrder) => void;
}

export const PickupRequest: React.FC<PickupRequestProps> = ({ 
  onBack, 
  onGoToCourier,
  currentUser,
  onRequestLogin,
  onOrderCreated,
  onTrackOrder
}) => {
  const [senderName, setSenderName] = useState(currentUser?.fullName || '');
  const [senderPhone, setSenderPhone] = useState(currentUser?.phone || '');
  const [pickupAddress, setPickupAddress] = useState('');
  const [scheduledTime, setScheduledTime] = useState('Sekarang (Instant Pickup)');
  const [estimatedPackages, setEstimatedPackages] = useState(2);
  const [notes, setNotes] = useState('Paket sudah dibungkus rapi kardus, siap ditimbang kurir');
  const [loading, setLoading] = useState(false);
  const [pickupConfirmed, setPickupConfirmed] = useState<any>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<CustomerOrder | null>(null);

  const handleProceedPickup = async (userToUse = currentUser) => {
    if (!senderName || !senderPhone || !pickupAddress) return;
    setLoading(true);
    try {
      const res = await api.requestPickup({
        senderName: senderName || userToUse?.fullName || 'Pengirim',
        senderPhone: senderPhone || userToUse?.phone || '08123456789',
        pickupAddress,
        scheduledTime,
        estimatedPackages,
        notes
      });
      if (res.success) {
        setPickupConfirmed(res.data);
        const orderNum = res.data.orderNumber || `AZP-${Math.floor(100000 + Math.random() * 900000)}`;
        const newOrder: CustomerOrder = {
          orderNumber: orderNum,
          serviceType: 'PICKUP',
          serviceName: 'Az Pickup — Penjemputan Paket di Rumah',
          pickupAddress: pickupAddress,
          dropoffAddress: 'Drop Point Hub AZ GO Terdekat',
          items: [
            { name: `Penjemputan ${estimatedPackages} Paket (${scheduledTime})`, quantity: estimatedPackages, price: 0 }
          ],
          totalAmount: 0,
          paymentMethod: 'Gratis Jemput (Bayar Ongkir saat Ditimbang)',
          distanceKm: 1.5,
          customerName: userToUse?.fullName || senderName,
          customerPhone: userToUse?.phone || senderPhone,
          createdAt: new Date().toISOString(),
          status: 'DRIVER_ASSIGNED',
          driverInfo: {
            name: 'Budi Santoso',
            phone: '081234567890',
            vehicleType: 'MOTOR',
            vehiclePlate: 'L 2841 BC (Honda Beat)',
            rating: 4.88,
            currentLocation: { lat: -7.260, lng: 112.740 },
            etaMinutes: 12
          }
        };
        setLastPlacedOrder(newOrder);
        if (onOrderCreated) {
          onOrderCreated(newOrder);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderPhone || !pickupAddress) return;
    if (!currentUser) {
      if (onRequestLogin) {
        onRequestLogin(
          'Silakan masuk atau daftar akun pelanggan terlebih dahulu untuk mengajukan penjemputan paket.',
          () => handleProceedPickup()
        );
      }
      return;
    }
    handleProceedPickup();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Layanan
      </button>

      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl p-6 text-white shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
          📍 Az Pickup — Layanan Jemput Paket di Rumah
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">Tidak Perlu Keluar Rumah!</h2>
        <p className="text-purple-100 text-xs mt-1">
          Kurir AZ GO akan mendatangi alamat Anda untuk menimbang, mencetak resi, dan membawa paket ke Drop Point terdekat.
        </p>
      </div>

      {pickupConfirmed ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-purple-600 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">Kurir Penjemputan Telah Ditugaskan!</h3>
          <p className="text-xs text-slate-600">Kode Booking Penjemputan: <strong>{pickupConfirmed.orderNumber}</strong></p>
          <div className="p-4 bg-purple-50 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-1 border border-purple-100">
            <p>👤 <strong>Pengirim:</strong> {pickupConfirmed.senderName} ({pickupConfirmed.senderPhone})</p>
            <p>📍 <strong>Alamat Jemput:</strong> {pickupConfirmed.pickupAddress}</p>
            <p>⏰ <strong>Waktu Jemput:</strong> {pickupConfirmed.scheduledTime}</p>
            <p>📦 <strong>Estimasi:</strong> {pickupConfirmed.estimatedPackages} Paket</p>
          </div>

          <div className="flex flex-col gap-2 max-w-sm mx-auto pt-2">
            {lastPlacedOrder && onTrackOrder && (
              <button
                onClick={() => onTrackOrder(lastPlacedOrder)}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <Bike className="w-4 h-4" /> Lacak Posisi Kurir Jemput (Live GPS)
              </button>
            )}
            <div className="flex gap-2">
              <button
                onClick={onGoToCourier}
                className="flex-1 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-xs font-bold transition"
              >
                Label Resi
              </button>
              <button
                onClick={() => setPickupConfirmed(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Order Lain
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pengirim / Toko</label>
            <input
              type="text"
              required
              placeholder="Contoh: Rina - Butik Hijab"
              value={senderName}
              onChange={e => setSenderName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Pengirim</label>
            <input
              type="tel"
              required
              placeholder="Contoh: 081298765432"
              value={senderPhone}
              onChange={e => setSenderPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-600" /> Alamat Lengkap Penjemputan
            </label>
            <textarea
              required
              rows={2}
              placeholder="Sebutkan nama jalan, nomor rumah, RT/RW, dan patokan..."
              value={pickupAddress}
              onChange={e => setPickupAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" /> Waktu Penjemputan
              </label>
              <select
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:outline-purple-500"
              >
                <option value="Sekarang (Instant Pickup)">Sekarang (1 - 2 Jam)</option>
                <option value="Siang Ini (13.00 - 15.00)">Siang Ini (13.00 - 15.00)</option>
                <option value="Sore Ini (16.00 - 18.00)">Sore Ini (16.00 - 18.00)</option>
                <option value="Besok Pagi (09.00 - 12.00)">Besok Pagi (09.00 - 12.00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Perkiraan Jumlah Paket</label>
              <input
                type="number"
                min="1"
                value={estimatedPackages}
                onChange={e => setEstimatedPackages(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan untuk Kurir</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {!currentUser && <Lock className="w-4 h-4 text-purple-200" />}
            {loading 
              ? 'Menghubungi Kurir...' 
              : currentUser 
                ? 'Minta Kurir Jemput Paket Sekarang (Gratis Jemput)' 
                : 'Masuk & Minta Jemput Paket'}
          </button>
        </form>
      )}
    </div>
  );
};
