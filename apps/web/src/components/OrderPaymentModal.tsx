import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Banknote, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  Clock, 
  Lock, 
  User as UserIcon,
  Upload,
  Camera,
  FileImage,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';
import { User } from '@delivery/shared';

export type PaymentMethodType = 'QRIS' | 'CASH';

export interface OrderPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTitle: string;
  merchantName?: string;
  orderNumber?: string;
  totalAmount: number;
  currentUser?: User | null;
  onRequestLogin?: () => void;
  onConfirmPayment: (paymentMethod: PaymentMethodType, details: {
    methodLabel: string;
    cashChangeNote?: string;
    isPaid: boolean;
    paymentProofUrl?: string;
    paymentProofName?: string;
    senderAccountName?: string;
  }) => void;
}

export const OrderPaymentModal: React.FC<OrderPaymentModalProps> = ({
  isOpen,
  onClose,
  orderTitle,
  merchantName,
  orderNumber = `AZD-${Math.floor(100000 + Math.random() * 900000)}`,
  totalAmount,
  currentUser,
  onRequestLogin,
  onConfirmPayment
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('QRIS');
  const [cashTenderedType, setCashTenderedType] = useState<'EXACT' | '50K' | '100K' | 'CUSTOM'>('EXACT');
  const [customCashAmount, setCustomCashAmount] = useState<number>(totalAmount);
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [qrisSimulating, setQrisSimulating] = useState(false);

  // Bukti Pembayaran QRIS State
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [paymentProofName, setPaymentProofName] = useState<string>('');
  const [senderAccountName, setSenderAccountName] = useState<string>(currentUser?.fullName || '');
  const [proofError, setProofError] = useState<string>('');
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyNominal = () => {
    navigator.clipboard?.writeText(totalAmount.toString());
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2000);
  };

  const getCashChange = () => {
    let tendered = totalAmount;
    if (cashTenderedType === '50K') tendered = 50000;
    else if (cashTenderedType === '100K') tendered = 100000;
    else if (cashTenderedType === 'CUSTOM') tendered = customCashAmount;

    const change = tendered - totalAmount;
    return change > 0 ? change : 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Maksimal 5MB
    if (file.size > 5 * 1024 * 1024) {
      setProofError('Ukuran file foto terlalu besar. Maksimal 5 MB.');
      return;
    }

    setProofError('');
    setPaymentProofName(file.name);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setPaymentProofPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProof = () => {
    setPaymentProofPreview(null);
    setPaymentProofName('');
    setProofError('');
  };

  const handleUseSampleProof = () => {
    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="580" viewBox="0 0 400 580">
  <rect width="400" height="580" fill="#f8fafc" rx="16"/>
  <rect x="16" y="16" width="368" height="548" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <circle cx="200" cy="72" r="30" fill="#10b981"/>
  <path d="M188 72l8 8 16-16" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="200" y="125" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="#0f172a" text-anchor="middle">PEMBAYARAN QRIS BERHASIL</text>
  <text x="200" y="148" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="middle">AZ GO PAY • ID1029384756209</text>
  <line x1="36" y1="170" x2="364" y2="170" stroke="#e2e8f0" stroke-dasharray="6 6"/>
  <text x="44" y="205" font-family="sans-serif" font-size="11" fill="#64748b">Total Pembayaran</text>
  <text x="356" y="205" font-family="sans-serif" font-size="16" font-weight="800" fill="#e11d48" text-anchor="end">Rp ${totalAmount.toLocaleString('id-ID')}</text>
  <text x="44" y="240" font-family="sans-serif" font-size="11" fill="#64748b">Penerima (Merchant)</text>
  <text x="356" y="240" font-family="sans-serif" font-size="11" font-weight="700" fill="#0f172a" text-anchor="end">${merchantName || 'Mitra Toko / Resto'}</text>
  <text x="44" y="275" font-family="sans-serif" font-size="11" fill="#64748b">ID Transaksi / Order</text>
  <text x="356" y="275" font-family="sans-serif" font-size="11" font-weight="700" fill="#0f172a" text-anchor="end">${orderNumber}</text>
  <text x="44" y="310" font-family="sans-serif" font-size="11" fill="#64748b">Metode Pembayaran</text>
  <text x="356" y="310" font-family="sans-serif" font-size="11" font-weight="700" fill="#0f172a" text-anchor="end">QRIS Domestik (NMID)</text>
  <text x="44" y="345" font-family="sans-serif" font-size="11" fill="#64748b">Pengirim (Akun)</text>
  <text x="356" y="345" font-family="sans-serif" font-size="11" font-weight="700" fill="#0f172a" text-anchor="end">${senderAccountName || currentUser?.fullName || 'Pelanggan'}</text>
  <text x="44" y="380" font-family="sans-serif" font-size="11" fill="#64748b">Waktu Transaksi</text>
  <text x="356" y="380" font-family="sans-serif" font-size="11" fill="#0f172a" text-anchor="end">${new Date().toLocaleString('id-ID')}</text>
  <rect x="36" y="415" width="328" height="54" rx="10" fill="#ecfdf5" stroke="#a7f3d0"/>
  <text x="200" y="448" font-family="sans-serif" font-size="12" font-weight="800" fill="#065f46" text-anchor="middle">✓ TRANSAKSI SUKSES DIVERIFIKASI</text>
  <text x="200" y="520" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Struk elektronik resmi tersimpan di sistem AZ GO</text>
</svg>`;
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sampleSvg)}`;
    setPaymentProofPreview(dataUrl);
    setPaymentProofName(`Struk_QRIS_${orderNumber}.png`);
    setProofError('');
  };

  const handleConfirm = () => {
    if (selectedMethod === 'QRIS') {
      if (!paymentProofPreview) {
        setProofError('Wajib mengunggah bukti pembayaran atau screenshot struk transfer QRIS sebelum melanjutkan.');
        return;
      }

      setQrisSimulating(true);
      setTimeout(() => {
        setQrisSimulating(false);
        onConfirmPayment('QRIS', {
          methodLabel: `QRIS Lunas (${senderAccountName ? 'a.n ' + senderAccountName + ' - ' : ''}Bukti Terlampir)`,
          isPaid: true,
          paymentProofUrl: paymentProofPreview,
          paymentProofName: paymentProofName,
          senderAccountName: senderAccountName
        });
      }, 700);
    } else {
      let changeNote = 'Uang pas';
      if (cashTenderedType === '50K') changeNote = `Uang Rp 50.000 (Kembalian Rp ${(50000 - totalAmount).toLocaleString('id-ID')})`;
      else if (cashTenderedType === '100K') changeNote = `Uang Rp 100.000 (Kembalian Rp ${(100000 - totalAmount).toLocaleString('id-ID')})`;
      else if (cashTenderedType === 'CUSTOM' && customCashAmount > totalAmount) {
        changeNote = `Uang Rp ${customCashAmount.toLocaleString('id-ID')} (Kembalian Rp ${(customCashAmount - totalAmount).toLocaleString('id-ID')})`;
      }

      onConfirmPayment('CASH', {
        methodLabel: `Tunai / COD saat pesanan tiba (${changeNote})`,
        cashChangeNote: changeNote,
        isPaid: false
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Always visible at top */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-0.5">
              Pilihan Pembayaran Resmi AZ GO
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">Metode Pembayaran</h3>
            <p className="text-xs text-slate-300 truncate max-w-xs">{orderTitle}</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Bayar Banner - Always visible below header */}
        <div className="bg-amber-50/90 border-b border-amber-200/80 p-3.5 sm:p-4 flex items-center justify-between shrink-0 z-10">
          <div>
            <span className="text-xs text-amber-800 font-semibold block">Total yang Harus Dibayar:</span>
            <div className="text-xl sm:text-2xl font-black text-amber-700">
              Rp {totalAmount.toLocaleString('id-ID')}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyNominal}
            className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 hover:bg-amber-100/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            {copiedNominal ? 'Tersalin!' : 'Salin Nominal'}
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Status Login Customer */}
          {currentUser ? (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Akun Pemesan</span>
                  <p className="font-extrabold text-slate-900">{currentUser.fullName} ({currentUser.phone || 'Pelanggan'})</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-full">
                Terverifikasi
              </span>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">Perhatian</span>
                  <p className="font-bold text-slate-900">Anda belum login sebagai Pelanggan</p>
                </div>
              </div>
              {onRequestLogin && (
                <button
                  type="button"
                  onClick={onRequestLogin}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Masuk Sekarang
                </button>
              )}
            </div>
          )}

          {/* Tab Pemilihan Metode: QRIS vs Tunai */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Opsi Pembayaran:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Pilihan QRIS */}
              <button
                type="button"
                onClick={() => setSelectedMethod('QRIS')}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between relative ${
                  selectedMethod === 'QRIS'
                    ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  {selectedMethod === 'QRIS' && (
                    <CheckCircle2 className="w-5 h-5 text-rose-600 fill-rose-100" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-slate-900 text-sm">QRIS</h4>
                    <span className="text-[9px] font-black px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-md">INSTAN</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Scan via BCA, GoPay, OVO, Dana, ShopeePay
                  </p>
                </div>
              </button>

              {/* Pilihan Tunai / COD */}
              <button
                type="button"
                onClick={() => setSelectedMethod('CASH')}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between relative ${
                  selectedMethod === 'CASH'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  {selectedMethod === 'CASH' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-slate-900 text-sm">Tunai / COD</h4>
                    <span className="text-[9px] font-black px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-md">DI TEMPAT</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Bayar langsung ke kurir saat pesanan tiba
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* DETAIL KONTEN SESUAI METODE YANG DIPILIH */}
          {selectedMethod === 'QRIS' ? (
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-4 text-center">
              {/* QRIS Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg"
                    alt="QRIS"
                    className="h-6 w-auto"
                    onError={(e: any) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="font-black text-xs text-slate-800 tracking-wider">QRIS STANDAR BI</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" /> Berlaku 15:00 Menit
                </span>
              </div>

              {/* QR Code Frame */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 inline-block mx-auto relative group">
                {/* Visual SVG QR Code Mockup */}
                <svg
                  className="w-48 h-48 mx-auto"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer corner squares */}
                  <rect width="100" height="100" fill="white" />
                  {/* Top-left position marker */}
                  <rect x="10" y="10" width="24" height="24" rx="4" fill="#0f172a" />
                  <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
                  <rect x="18" y="18" width="8" height="8" rx="1" fill="#0f172a" />
                  {/* Top-right position marker */}
                  <rect x="66" y="10" width="24" height="24" rx="4" fill="#0f172a" />
                  <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
                  <rect x="74" y="18" width="8" height="8" rx="1" fill="#0f172a" />
                  {/* Bottom-left position marker */}
                  <rect x="10" y="66" width="24" height="24" rx="4" fill="#0f172a" />
                  <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
                  <rect x="18" y="74" width="8" height="8" rx="1" fill="#0f172a" />
                  {/* Data patterns (simulated QR matrices) */}
                  <rect x="40" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="44" y="22" width="12" height="6" fill="#0f172a" />
                  <rect x="40" y="32" width="6" height="12" fill="#0f172a" />
                  <rect x="50" y="36" width="8" height="8" fill="#e11d48" />
                  <rect x="12" y="42" width="6" height="6" fill="#0f172a" />
                  <rect x="24" y="42" width="8" height="6" fill="#0f172a" />
                  <rect x="66" y="40" width="10" height="6" fill="#0f172a" />
                  <rect x="80" y="40" width="8" height="8" fill="#0f172a" />
                  <rect x="70" y="52" width="6" height="14" fill="#0f172a" />
                  <rect x="82" y="54" width="8" height="6" fill="#0f172a" />
                  <rect x="40" y="52" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="52" width="6" height="6" fill="#0f172a" />
                  <rect x="44" y="64" width="14" height="6" fill="#0f172a" />
                  <rect x="40" y="76" width="6" height="14" fill="#0f172a" />
                  <rect x="52" y="76" width="8" height="6" fill="#0f172a" />
                  <rect x="66" y="74" width="12" height="6" fill="#0f172a" />
                  <rect x="82" y="74" width="8" height="16" fill="#0f172a" />
                  <rect x="66" y="86" width="8" height="6" fill="#0f172a" />
                </svg>

                {/* Center Badge AZ GO */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-black shadow-md border-2 border-white">
                    AZ GO
                  </div>
                </div>
              </div>

              {/* Merchant Details */}
              <div className="text-xs space-y-1">
                <p className="font-extrabold text-slate-900">
                  AZ GO PAY — {merchantName || 'Mitra Toko & Resto'}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  NMID: ID1029384756209 • No. Pesanan: {orderNumber}
                </p>
                <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Aman & Bebas Biaya Admin
                </div>
              </div>

              {/* Supported Apps Badges */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-center gap-2 flex-wrap text-[10px] font-bold text-slate-600">
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">BCA Mobile</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">GoPay</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">OVO</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">DANA</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">ShopeePay</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">Livin Mandiri</span>
              </div>

              {/* Upload Bukti Pembayaran QRIS (Wajib) */}
              <div className="pt-3 border-t border-slate-200 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                      <Upload className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        Upload Bukti Pembayaran <span className="text-rose-600 font-bold">*Wajib</span>
                      </h5>
                      <p className="text-[10px] text-slate-500">
                        Screenshot m-banking atau foto struk transfer QRIS Anda
                      </p>
                    </div>
                  </div>
                  {paymentProofPreview && (
                    <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terunggah
                    </span>
                  )}
                </div>

                {!paymentProofPreview ? (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-rose-300 hover:border-rose-500 bg-white hover:bg-rose-50/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition group">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <div className="w-10 h-10 rounded-full bg-rose-50 group-hover:bg-rose-100 text-rose-600 flex items-center justify-center mb-1.5 shadow-xs transition">
                        <Camera className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-rose-700">
                        Pilih Screenshot / Foto Bukti Bayar
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Format PNG, JPG, JPEG (Maks. 5 MB)
                      </span>
                    </label>

                    {/* Quick Demo Helper */}
                    <div className="flex items-center justify-between bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 text-[11px]">
                      <span className="text-amber-800">Sedang mencoba atau demo sistem?</span>
                      <button
                        type="button"
                        onClick={handleUseSampleProof}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 rounded-lg font-bold border border-amber-300 shadow-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <FileImage className="w-3.5 h-3.5 text-amber-700" /> Gunakan Contoh Struk QRIS
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-2xl border border-emerald-300 shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={paymentProofPreview}
                        alt="Bukti Bayar QRIS"
                        className="w-12 h-14 object-cover rounded-xl border border-emerald-200 shadow-xs cursor-pointer hover:opacity-90"
                        onClick={() => setShowPreviewModal(true)}
                        title="Klik untuk melihat bukti pembayaran penuh"
                      />
                      <div className="truncate text-xs">
                        <p className="font-extrabold text-slate-900 truncate">
                          {paymentProofName || 'struk_pembayaran_qris.png'}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Bukti siap diverifikasi driver & merchant
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowPreviewModal(true)}
                          className="text-[10px] font-bold text-rose-600 hover:underline mt-0.5 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" /> Lihat Foto Penuh
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveProof}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Ganti
                    </button>
                  </div>
                )}

                {/* Optional Sender Account Name Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Pemilik Rekening / E-Wallet Pengirim (Opsional):
                  </label>
                  <input
                    type="text"
                    value={senderAccountName}
                    onChange={e => setSenderAccountName(e.target.value)}
                    placeholder="Contoh: Siti Rahma (BCA / GoPay)"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-rose-500 font-medium"
                  />
                </div>

                {proofError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{proofError}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Pembayaran Tunai di Tempat (COD)</h4>
                  <p className="text-xs text-slate-500">
                    Siapkan uang tunai kepada kurir/driver saat pesanan sampai di alamat Anda.
                  </p>
                </div>
              </div>

              {/* Opsi Uang Tunai / Pecahan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Pilih Pecahan Uang Anda (Agar Driver Menyiapkan Kembalian):
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setCashTenderedType('EXACT')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      cashTenderedType === 'EXACT'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    💵 Uang Pas (Rp {totalAmount.toLocaleString('id-ID')})
                  </button>

                  <button
                    type="button"
                    onClick={() => setCashTenderedType('50K')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      cashTenderedType === '50K'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Pecahan Rp 50.000
                  </button>

                  <button
                    type="button"
                    onClick={() => setCashTenderedType('100K')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      cashTenderedType === '100K'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Pecahan Rp 100.000
                  </button>

                  <button
                    type="button"
                    onClick={() => setCashTenderedType('CUSTOM')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      cashTenderedType === 'CUSTOM'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Nominal Lainnya...
                  </button>
                </div>

                {cashTenderedType === 'CUSTOM' && (
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      Masukkan Jumlah Uang yang Akan Anda Berikan:
                    </span>
                    <input
                      type="number"
                      min={totalAmount}
                      step={1000}
                      value={customCashAmount}
                      onChange={e => setCustomCashAmount(parseInt(e.target.value) || totalAmount)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Rincian Kembalian */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Estimasi Kembalian Driver:</span>
                <span className="font-extrabold text-emerald-800 text-sm">
                  Rp {getCashChange().toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {/* Action Confirmation Button */}
          <div className="pt-2">
            {selectedMethod === 'QRIS' && !paymentProofPreview ? (
              <button
                type="button"
                onClick={() => {
                  setProofError('Wajib memilih atau upload bukti transfer QRIS sebelum dapat melanjutkan pesanan.');
                }}
                className="w-full py-3.5 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-700 border-2 border-dashed border-slate-300 hover:border-rose-400"
              >
                <Upload className="w-5 h-5 text-rose-500" />
                <span>Harap Upload Bukti Pembayaran QRIS Terlebih Dahulu</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={qrisSimulating}
                className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                  selectedMethod === 'QRIS'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-rose-600/25 ring-2 ring-rose-500/50'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-600/20'
                }`}
              >
                {qrisSimulating ? (
                  <span>Memverifikasi Bukti Pembayaran QRIS...</span>
                ) : selectedMethod === 'QRIS' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Saya Sudah Bayar & Unggah Bukti • Lacak Pesanan</span>
                  </>
                ) : (
                  <>
                    <Banknote className="w-5 h-5 text-white" />
                    <span>Konfirmasi Pesanan Bayar Tunai (COD)</span>
                  </>
                )}
              </button>
            )}
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Pesanan dan bukti pembayaran akan langsung diteruskan ke kurir/toko terdekat.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Zoom Preview Bukti Pembayaran Penuh */}
      {showPreviewModal && paymentProofPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 p-5 space-y-4 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-600" />
                Bukti Pembayaran QRIS
              </h4>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 rounded-2xl bg-slate-50 flex items-center justify-center p-2 border border-slate-200">
              <img
                src={paymentProofPreview}
                alt="Bukti Transfer QRIS Penuh"
                className="max-h-[60vh] w-auto object-contain rounded-xl shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-1 shrink-0">
              <div className="text-[11px] text-slate-500">
                <span className="font-bold text-slate-800 block truncate max-w-[200px]">{paymentProofName || 'Bukti QRIS'}</span>
                <span>Tersimpan untuk verifikasi driver & toko</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
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
