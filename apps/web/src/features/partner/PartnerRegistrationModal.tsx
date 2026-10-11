import React, { useState } from 'react';
import { api } from '../../services/apiClient';
import { PartnerType, DriverVehicleCategory, MerchantCategoryType } from '@delivery/shared';
import { 
  X, 
  Bike, 
  Store, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { getRegenciesByProvince } from '../../utils/indonesiaGeo';

interface PartnerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: PartnerType;
}

export const PartnerRegistrationModal: React.FC<PartnerRegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'DRIVER'
}) => {
  const [partnerType, setPartnerType] = useState<PartnerType>(defaultType);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Surabaya');
  const [address, setAddress] = useState('');

  // Driver Specific
  const [vehicleCategory, setVehicleCategory] = useState<DriverVehicleCategory>('MOTORBIKE');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [ktpNumber, setKtpNumber] = useState('');
  const [simNumber, setSimNumber] = useState('');

  // Merchant Specific
  const [storeName, setStoreName] = useState('');
  const [merchantType, setMerchantType] = useState<MerchantCategoryType>('FOOD');
  const [storeCategory, setStoreCategory] = useState('');
  const [storeDescription, setStoreDescription] = useState('');

  // Merchant Kurir Mandiri (Driver Sendiri)
  const [hasSelfCourier, setHasSelfCourier] = useState(false);
  const [selfCourierName, setSelfCourierName] = useState('');
  const [selfCourierPhone, setSelfCourierPhone] = useState('');
  const [selfCourierVehicle, setSelfCourierVehicle] = useState('Sepeda Motor Honda Beat');
  const [selfCourierPlate, setSelfCourierPlate] = useState('');

  // Bank Account Details for Payout
  const [bankName, setBankName] = useState('BCA');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const payload: any = {
        type: partnerType,
        fullName,
        phone,
        email,
        city,
        address,
        bankName,
        accountNumber,
        accountHolder: accountHolder || fullName,
        documents: {
          ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
          simUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
          stnkUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600',
          vehiclePhotoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600',
          storePhotoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
        }
      };

      if (partnerType === 'DRIVER') {
        payload.vehicleCategory = vehicleCategory;
        payload.vehicleModel = vehicleModel || (vehicleCategory === 'MOTORBIKE' ? 'Honda Vario 160' : 'Daihatsu Gran Max');
        payload.vehiclePlate = vehiclePlate || 'B 1234 XYZ';
        payload.ktpNumber = ktpNumber || '3174092801940002';
        payload.simNumber = simNumber || '940128001928';
      } else {
        payload.storeName = storeName;
        payload.merchantType = merchantType;
        payload.storeCategory = storeCategory || (merchantType === 'FOOD' ? 'Kuliner Nusantara' : 'Minimarket & Sembako');
        payload.storeDescription = storeDescription || 'Mitra resmi penyedia produk berkualitas AZ GO';
        payload.hasSelfCourier = hasSelfCourier;
        if (hasSelfCourier) {
          payload.selfCourierName = selfCourierName || 'Kurir Toko';
          payload.selfCourierPhone = selfCourierPhone || phone;
          payload.selfCourierVehicle = selfCourierVehicle || 'Sepeda Motor';
          payload.selfCourierPlate = selfCourierPlate || 'L 1234 AB';
        }
      }

      const res = await api.submitPartnerApplication(payload);
      if (res.success) {
        setSuccessData(res.data);
      } else {
        setErrorMessage(res.message || 'Gagal mengajukan pendaftaran');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleReset}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SUKSES SCREEN */}
        {successData ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Pendaftaran Berhasil Dikirim
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                Terima Kasih, {successData.fullName}!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Pengajuan Anda sebagai <strong>{successData.type === 'DRIVER' ? 'Mitra Pengemudi' : 'Mitra Toko/Resto'}</strong> telah masuk ke antrean verifikasi tim Admin AZ GO.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Pengajuan:</span>
                <span className="font-mono font-bold text-slate-900">{successData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Saat Ini:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Menunggu Tinjauan Berkas
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kota Operasional:</span>
                <span className="font-bold text-slate-800">{successData.city}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-900 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Pendaftaran Kemitraan Resmi AZ GO
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Gabung Jadi Mitra AZ GO
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Dapatkan penghasilan harian dan perluas jangkauan bisnis Anda bersama ekosistem logistik & on-demand AZ GO.
              </p>
            </div>

            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setPartnerType('DRIVER')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 ${
                  partnerType === 'DRIVER'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bike className="w-4 h-4 text-amber-600" />
                Mitra Driver (Kurir & Armada)
              </button>
              <button
                type="button"
                onClick={() => setPartnerType('MERCHANT')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 ${
                  partnerType === 'MERCHANT'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-600" />
                Mitra Toko (Resto & Mart)
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Data Pribadi / Pemilik */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block border-b border-slate-200 pb-1">
                  1. Informasi Pemohon
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Asep Sunandar"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif <span className="text-rose-500">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="email@anda.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kota Domisili / Operasional <span className="text-rose-500">*</span></label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-rose-500"
                    >
                      <optgroup label="Jawa Timur (Lengkap 38 Kota & Kabupaten)">
                        {getRegenciesByProvince('p-jatim').map(r => (
                          <option key={r.id} value={r.name.replace(/^(Kota|Kabupaten)\s+/i, '')}>
                            {r.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Provinsi Lainnya">
                        <option value="Jakarta">DKI Jakarta</option>
                        <option value="Bandung">Kota Bandung</option>
                        <option value="Semarang">Kota Semarang</option>
                        <option value="Yogyakarta">Kota Yogyakarta</option>
                        <option value="Tangerang">Kota Tangerang</option>
                        <option value="Denpasar">Kota Denpasar</option>
                        <option value="Medan">Kota Medan</option>
                        <option value="Makassar">Kota Makassar</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap Tempat Tinggal / Usaha <span className="text-rose-500">*</span></label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Nama jalan, nomor rumah/ruko, RT/RW, kelurahan, kecamatan..."
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-rose-500"
                  />
                </div>
              </div>

              {/* SPESIFIK DRIVER */}
              {partnerType === 'DRIVER' && (
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider block border-b border-amber-200 pb-1">
                    2. Data Kendaraan & Lisensi Mengemudi
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Armada Kendaraan</label>
                      <select
                        value={vehicleCategory}
                        onChange={e => setVehicleCategory(e.target.value as DriverVehicleCategory)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-amber-500"
                      >
                        <option value="MOTORBIKE">🛵 Sepeda Motor (Az Delivery & Az Courier)</option>
                        <option value="CAR">🚗 Mobil Penumpang</option>
                        <option value="CARGO_PICKUP">🛻 Mobil Pickup Bak / Box (Az Cargo)</option>
                        <option value="CARGO_TRUCK">🚚 Truk Engkel CDE/CDD (Az Cargo)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Model / Tipe Kendaraan</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Honda Beat CBS 2022"
                        value={vehicleModel}
                        onChange={e => setVehicleModel(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Plat Polisi</label>
                      <input
                        type="text"
                        required
                        placeholder="B 1234 XYZ"
                        value={vehiclePlate}
                        onChange={e => setVehiclePlate(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono uppercase focus:outline-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor NIK KTP</label>
                      <input
                        type="text"
                        required
                        placeholder="16 Digit NIK KTP"
                        value={ktpNumber}
                        onChange={e => setKtpNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono focus:outline-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor SIM C / A / B1</label>
                      <input
                        type="text"
                        required
                        placeholder="Nomor SIM Aktif"
                        value={simNumber}
                        onChange={e => setSimNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono focus:outline-amber-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-600" />
                      Foto KTP, SIM, STNK & Kendaraan
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Siap Ditinjau Admin
                    </span>
                  </div>
                </div>
              )}

              {/* SPESIFIK MERCHANT */}
              {partnerType === 'MERCHANT' && (
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wider block border-b border-emerald-200 pb-1">
                    2. Informasi Toko / Resto & Mart
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Usaha / Toko <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Warung Nasi Bebek Maknyus"
                        value={storeName}
                        onChange={e => setStoreName(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Layanan</label>
                      <select
                        value={merchantType}
                        onChange={e => setMerchantType(e.target.value as MerchantCategoryType)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-emerald-500"
                      >
                        <option value="FOOD">🍔 Az Delivery (Resto Makanan & Minuman)</option>
                        <option value="MART">🛒 Az Mart (Minimarket, Sayur, Buah & Sembako)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Kuliner / Produk</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Ayam Goreng, Bebek, Minuman Es"
                        value={storeCategory}
                        onChange={e => setStoreCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat Usaha</label>
                      <input
                        type="text"
                        placeholder="Sajian lezat resep keluarga sejak 2018..."
                        value={storeDescription}
                        onChange={e => setStoreDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-emerald-500"
                      />
                    </div>
                  </div>

                  {/* OPSI DAFTAR KURIR MANDIRI / DRIVER TOKO SEKALIAN */}
                  <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-amber-200">
                      <span className="text-xs font-black text-amber-950 uppercase tracking-wider block">
                        Opsi Pengantaran Pesanan (Armada Kurir)
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Fleksibel
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Apakah toko/resto Anda ingin mendaftarkan <strong>Kurir Mandiri (Driver Sendiri)</strong> sekalian, atau hanya mengandalkan Driver AZ GO?
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Opsi 1: Driver AZ GO */}
                      <button
                        type="button"
                        onClick={() => setHasSelfCourier(false)}
                        className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                          !hasSelfCourier 
                            ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Bike className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-extrabold text-slate-900 text-xs">Driver AZ GO Saja</h5>
                            {!hasSelfCourier && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                            Pesanan otomatis dijemput oleh driver aplikasi AZ GO terdekat.
                          </p>
                        </div>
                      </button>

                      {/* Opsi 2: Kurir Mandiri Toko */}
                      <button
                        type="button"
                        onClick={() => setHasSelfCourier(true)}
                        className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                          hasSelfCourier 
                            ? 'border-amber-600 bg-amber-50/90 ring-2 ring-amber-500 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-extrabold text-slate-900 text-xs">Daftar Kurir Mandiri</h5>
                            {hasSelfCourier && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                            Toko punya karyawan/kurir sendiri. Tetap bisa panggil driver AZ GO jika sibuk.
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Form Input Kurir Mandiri jika dicentang/dipilih */}
                    {hasSelfCourier && (
                      <div className="pt-2 mt-2 border-t border-amber-200 space-y-3 animate-in fade-in duration-200">
                        <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wide block">
                          Data Kurir Mandiri Pertama Toko:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Nama Kurir Toko <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required={hasSelfCourier}
                              placeholder="Contoh: Budi Santoso / Kurir Toko"
                              value={selfCourierName}
                              onChange={e => setSelfCourierName(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              No. WhatsApp Kurir <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="tel"
                              required={hasSelfCourier}
                              placeholder="Contoh: 081234567890"
                              value={selfCourierPhone}
                              onChange={e => setSelfCourierPhone(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-amber-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Model Kendaraan
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Honda Beat / Vario Hitam"
                              value={selfCourierVehicle}
                              onChange={e => setSelfCourierVehicle(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Nomor Plat Polisi <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required={hasSelfCourier}
                              placeholder="Contoh: L 1234 AB"
                              value={selfCourierPlate}
                              onChange={e => setSelfCourierPlate(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono uppercase focus:outline-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      Foto KTP Pemilik & Tampak Depan Toko
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Siap Ditinjau Admin
                    </span>
                  </div>
                </div>
              )}

              {/* DATA REKENING BANK UNTUK PENCAIRAN SALDO */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3">
                <span className="text-xs font-black text-blue-950 uppercase tracking-wider block border-b border-blue-200 pb-1">
                  3. Rekening Bank untuk Pencairan Saldo (Withdrawal)
                </span>
                <p className="text-[11px] text-slate-500">
                  Data rekening ini digunakan untuk mentransfer hasil pendapatan narik / penjualan Anda ke rekening bank resmi Anda.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Bank <span className="text-rose-500">*</span></label>
                    <select
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-blue-500 font-bold"
                    >
                      <option value="BCA">BCA (Bank Central Asia)</option>
                      <option value="Mandiri">Bank Mandiri</option>
                      <option value="BNI">BNI (Bank Negara Indonesia)</option>
                      <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                      <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                      <option value="CIMB Niaga">CIMB Niaga</option>
                      <option value="Permata">Bank Permata</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Rekening <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 8820192831"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono focus:outline-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pemilik Rekening <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Sesuai buku tabungan"
                      value={accountHolder}
                      onChange={e => setAccountHolder(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                {loading ? 'Mengirim Berkas Pendaftaran...' : 'Kirim Pengajuan Pendaftaran Mitra'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
