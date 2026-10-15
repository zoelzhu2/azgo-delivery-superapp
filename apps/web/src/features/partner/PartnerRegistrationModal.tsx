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
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';
import { getRegenciesByProvince } from '../../utils/indonesiaGeo';

interface PartnerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: PartnerType;
}

export const FOOD_CATEGORIES = [
  'Ayam, Bebek & Aneka Unggas',
  'Aneka Nasi & Masakan Rumahan (Padang / Sunda / Jawa)',
  'Mie, Bakso, Soto & Aneka Sup',
  'Minuman, Kopi, Teh & Boba',
  'Snack, Jajanan Pasar & Gorengan',
  'Fast Food, Burger, Kebab & Pizza',
  'Seafood & Olahan Ikan Laut',
  'Martabak Manis & Martabak Telur',
  'Sate, Gule & Olahan Daging Sapi/Kambing',
  'Roti, Kue Basah/Kering & Bakery',
  'Makanan Sehat, Diet, Salad & Jus Buah',
  'Lainnya (Ketik Sendiri)'
];

export const MART_CATEGORIES = [
  'Sembako Pokok (Beras, Minyak Goreng, Gula, Telur)',
  'Sayur, Buah & Daging / Ayam Segar',
  'Minuman Kemasan, Air Mineral, Kopi & Susu',
  'Makanan Ringan, Biskuit, Cokelat & Snack',
  'Kebutuhan Rumah Tangga, Sabun & Deterjen',
  'Makanan Beku & Olahan (Frozen Food & Sosis)',
  'Bumbu Dapur, Rempah-rempah & Bahan Masak',
  'Perawatan Diri, Sabun Mandi & Obat Ringan',
  'Alat Tulis Kantor & Keperluan Sekolah',
  'Pakan & Aksesoris Hewan (Pet Shop)',
  'Lainnya (Ketik Sendiri)'
];

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
  const [storeCategoryPreset, setStoreCategoryPreset] = useState<string>(FOOD_CATEGORIES[0]);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [storeDescription, setStoreDescription] = useState('');

  // Opsi Pengantaran (Driver AzGo, Kurir Mandiri, atau Keduanya)
  const [deliveryOption, setDeliveryOption] = useState<'AZGO_ONLY' | 'SELF_ONLY' | 'BOTH'>('BOTH');
  const [selfCourierName, setSelfCourierName] = useState('');
  const [selfCourierPhone, setSelfCourierPhone] = useState('');
  const [selfCourierVehicle, setSelfCourierVehicle] = useState('Sepeda Motor Honda Beat');
  const [selfCourierPlate, setSelfCourierPlate] = useState('');

  // Bank Account Details for Payout
  const [bankName, setBankName] = useState('BCA');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  if (!isOpen) return null;

  const handleMerchantTypeChange = (type: MerchantCategoryType) => {
    setMerchantType(type);
    if (type === 'FOOD') {
      setStoreCategoryPreset(FOOD_CATEGORIES[0]);
    } else {
      setStoreCategoryPreset(MART_CATEGORIES[0]);
    }
    setCustomCategoryInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const finalCategory = storeCategoryPreset === 'Lainnya (Ketik Sendiri)'
        ? (customCategoryInput.trim() || 'Kategori Khusus')
        : storeCategoryPreset;

      if (partnerType === 'MERCHANT' && storeCategoryPreset === 'Lainnya (Ketik Sendiri)' && !customCategoryInput.trim()) {
        setErrorMessage('Silakan ketik nama kategori kuliner / produk usaha Anda.');
        setLoading(false);
        return;
      }

      const hasSelfCourier = deliveryOption === 'SELF_ONLY' || deliveryOption === 'BOTH';

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
        payload.storeCategory = finalCategory;
        payload.storeDescription = storeDescription || `Mitra resmi penyedia produk ${finalCategory} di AZ GO`;
        payload.deliveryOption = deliveryOption;
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
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[94vh] relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200/80">
        
        {/* ================= 1. HEADER (PINNED / STICKY AT TOP - ALWAYS VISIBLE) ================= */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 bg-white shrink-0 relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-amber-900 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Pendaftaran Kemitraan Resmi AZ GO
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Gabung Jadi Mitra AZ GO
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                Dapatkan penghasilan harian dan perluas jangkauan bisnis Anda bersama ekosistem AZ GO.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Switcher Tipe Mitra: Driver vs Toko */}
          {!successData && (
            <div className="grid grid-cols-2 gap-2 mt-3 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setPartnerType('DRIVER')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 sm:gap-2 ${
                  partnerType === 'DRIVER'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bike className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Mitra Driver (Armada)</span>
              </button>
              <button
                type="button"
                onClick={() => setPartnerType('MERCHANT')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 sm:gap-2 ${
                  partnerType === 'MERCHANT'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mitra Toko (Resto & Mart)</span>
              </button>
            </div>
          )}
        </div>

        {/* ================= 2. BODY (SCROLLABLE DENGAN OVERSCROLL CONTAINMENT) ================= */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          
          {/* SUKSES SCREEN */}
          {successData ? (
            <div className="text-center py-6 sm:py-8 space-y-4">
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
                  Pengajuan Anda sebagai <strong>{successData.type === 'DRIVER' ? 'Mitra Pengemudi' : 'Mitra Toko / Resto'}</strong> telah masuk ke antrean verifikasi tim Admin AZ GO.
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

              <div className="pt-3 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          ) : (
            <form id="partner-registration-form" onSubmit={handleSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. DATA PRIBADI / PEMOHON */}
              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
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
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-slate-900"
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
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-slate-900"
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
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kota Domisili / Operasional <span className="text-rose-500">*</span></label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-slate-900"
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
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-slate-900"
                  />
                </div>
              </div>

              {/* 2A. SPESIFIK DRIVER */}
              {partnerType === 'DRIVER' && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Model / Tipe Kendaraan <span className="text-rose-500">*</span></label>
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Plat Polisi <span className="text-rose-500">*</span></label>
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor NIK KTP <span className="text-rose-500">*</span></label>
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor SIM C / A / B1 <span className="text-rose-500">*</span></label>
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
                      <Upload className="w-4 h-4 text-amber-600 shrink-0" />
                      Foto KTP, SIM, STNK & Kendaraan
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Siap Ditinjau Admin
                    </span>
                  </div>
                </div>
              )}

              {/* 2B. SPESIFIK MERCHANT (TOKO / RESTO & MART) */}
              {partnerType === 'MERCHANT' && (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3.5">
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
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Layanan</label>
                      <select
                        value={merchantType}
                        onChange={e => handleMerchantTypeChange(e.target.value as MerchantCategoryType)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:outline-emerald-500"
                      >
                        <option value="FOOD">🍔 Az Delivery (Resto Makanan & Minuman)</option>
                        <option value="MART">🛒 Az Mart (Minimarket, Sayur, Buah & Sembako)</option>
                      </select>
                    </div>
                  </div>

                  {/* KATEGORI KULINER / PRODUK DENGAN PILIHAN & KETIK SENDIRI */}
                  <div className="bg-white p-3 rounded-2xl border border-emerald-200/80 space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-800">
                          Kategori {merchantType === 'FOOD' ? 'Kuliner Resto' : 'Produk Toko / Mart'} <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Pilih Kategori Standar
                        </span>
                      </div>
                      
                      <select
                        value={storeCategoryPreset}
                        onChange={e => setStoreCategoryPreset(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-emerald-500"
                      >
                        {(merchantType === 'FOOD' ? FOOD_CATEGORIES : MART_CATEGORIES).map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Jika memilih 'Lainnya (Ketik Sendiri)' */}
                    {storeCategoryPreset === 'Lainnya (Ketik Sendiri)' && (
                      <div className="pt-2 border-t border-slate-100 animate-in fade-in duration-200">
                        <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                          Tuliskan Kategori Usaha Anda Sendiri: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          autoFocus
                          placeholder={merchantType === 'FOOD' ? 'Contoh: Masakan Khas Manado, Dimsum Organik, Dessert Box' : 'Contoh: Toko Sayur Organik, Alat Tulis Murah, Frozen Food'}
                          value={customCategoryInput}
                          onChange={e => setCustomCategoryInput(e.target.value)}
                          className="w-full px-3 py-2 bg-emerald-50/50 rounded-xl border border-emerald-300 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-emerald-600"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Kategori ini akan ditampilkan kepada pelanggan di aplikasi.
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat Usaha</label>
                    <input
                      type="text"
                      placeholder="Sajian lezat resep keluarga sejak 2018..."
                      value={storeDescription}
                      onChange={e => setStoreDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:outline-emerald-500"
                    />
                  </div>

                  {/* ================= OPSI PENGANTARAN PESANAN (ARMADA KURIR) ================= */}
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
                      Pilih bagaimana pesanan dari toko Anda akan diantarkan kepada pelanggan:
                    </p>

                    {/* 3 OPSI: DRIVER AZ GO, KURIR MANDIRI, ATAU PILIH KEDUANYA */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      
                      {/* Opsi 1: Driver AZ GO Saja */}
                      <button
                        type="button"
                        onClick={() => setDeliveryOption('AZGO_ONLY')}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                          deliveryOption === 'AZGO_ONLY'
                            ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                              <Bike className="w-3.5 h-3.5" />
                            </div>
                            {deliveryOption === 'AZGO_ONLY' && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            )}
                          </div>
                          <h5 className="font-extrabold text-slate-900 text-xs">Driver AZ GO Saja</h5>
                          <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                            Pesanan otomatis dijemput driver aplikasi AZ GO terdekat. Toko tidak repot cari kurir.
                          </p>
                        </div>
                      </button>

                      {/* Opsi 2: Kurir Mandiri Toko Saja */}
                      <button
                        type="button"
                        onClick={() => setDeliveryOption('SELF_ONLY')}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                          deliveryOption === 'SELF_ONLY'
                            ? 'border-amber-600 bg-amber-50/90 ring-2 ring-amber-500 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                              <Store className="w-3.5 h-3.5" />
                            </div>
                            {deliveryOption === 'SELF_ONLY' && (
                              <CheckCircle2 className="w-4 h-4 text-amber-600" />
                            )}
                          </div>
                          <h5 className="font-extrabold text-slate-900 text-xs">Kurir Mandiri Saja</h5>
                          <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                            Pesanan khusus diantar kurir/karyawan toko sendiri tanpa memanggil driver online AZ GO.
                          </p>
                        </div>
                      </button>

                      {/* Opsi 3: Pilih Keduanya (Kurir Toko + Driver AZ GO) */}
                      <button
                        type="button"
                        onClick={() => setDeliveryOption('BOTH')}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                          deliveryOption === 'BOTH'
                            ? 'border-indigo-600 bg-indigo-50/90 ring-2 ring-indigo-500 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg">
                          ⭐ Rekomendasi
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                              <Layers className="w-3.5 h-3.5" />
                            </div>
                            {deliveryOption === 'BOTH' && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                            )}
                          </div>
                          <h5 className="font-extrabold text-slate-900 text-xs">Pilih Keduanya</h5>
                          <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                            Prioritas kurir toko sendiri. Namun toko tetap bebas panggil Driver AZ GO kapan pun saat ramai.
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Form Kurir Mandiri Pertama jika opsi Mandiri atau Keduanya dipilih */}
                    {(deliveryOption === 'SELF_ONLY' || deliveryOption === 'BOTH') && (
                      <div className="pt-2 mt-2 border-t border-amber-200 space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wide block">
                            Data Kurir Mandiri Pertama Toko:
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Nama Kurir Toko <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required={deliveryOption === 'SELF_ONLY' || deliveryOption === 'BOTH'}
                              placeholder="Contoh: Budi Santoso / Kurir Toko"
                              value={selfCourierName}
                              onChange={e => setSelfCourierName(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:outline-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              No. WhatsApp Kurir <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="tel"
                              required={deliveryOption === 'SELF_ONLY' || deliveryOption === 'BOTH'}
                              placeholder="Contoh: 081234567890"
                              value={selfCourierPhone}
                              onChange={e => setSelfCourierPhone(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:outline-amber-500"
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
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:outline-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Nomor Plat Polisi <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required={deliveryOption === 'SELF_ONLY' || deliveryOption === 'BOTH'}
                              placeholder="Contoh: L 1234 AB"
                              value={selfCourierPlate}
                              onChange={e => setSelfCourierPlate(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono uppercase focus:ring-2 focus:ring-amber-500/20 focus:outline-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-600 shrink-0" />
                      Foto KTP Pemilik & Tampak Depan Toko
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Siap Ditinjau Admin
                    </span>
                  </div>
                </div>
              )}

              {/* 3. DATA REKENING BANK UNTUK PENCAIRAN SALDO */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
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
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-blue-500 font-bold"
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
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-blue-500"
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
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-blue-500"
                    />
                  </div>
                </div>
              </div>

            </form>
          )}
        </div>

        {/* ================= 3. FOOTER (PINNED / STICKY AT BOTTOM) ================= */}
        {!successData && (
          <div className="p-3.5 sm:p-4 px-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
            >
              Batal
            </button>
            <button
              type="submit"
              form="partner-registration-form"
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Mengirim Berkas...' : 'Kirim Pengajuan Pendaftaran Mitra'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
