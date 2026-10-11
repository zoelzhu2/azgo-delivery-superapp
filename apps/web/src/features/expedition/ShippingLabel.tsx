import React, { useRef } from 'react';
import { ExpeditionDeliveryDetail, ExpeditionFareResult } from '@delivery/shared';
import { Barcode } from '../../components/Barcode';
import { Printer, Copy, Check, Search, ArrowRight, QrCode } from 'lucide-react';

interface ShippingLabelProps {
  delivery: ExpeditionDeliveryDetail;
  fare?: ExpeditionFareResult | null;
  onTrack?: (awb: string) => void;
  onNewShipment?: () => void;
  operatorName?: string;
}

export const ShippingLabel: React.FC<ShippingLabelProps> = ({
  delivery,
  fare,
  onTrack,
  onNewShipment,
  operatorName = 'Staff Operator Hub'
}) => {
  const [copied, setCopied] = React.useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  const handleCopyResi = () => {
    navigator.clipboard.writeText(delivery.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isExpress = delivery.trackingNumber.startsWith('AZX') || delivery.serviceCode === 'EXPRESS';
  const isCargo = delivery.trackingNumber.startsWith('AZK') || delivery.serviceCode === 'CARGO';

  const originCity = delivery.originCity || 'Jakarta';
  const destCity = delivery.destinationCity || 'Bandung';

  const originCode = originCity.slice(0, 3).toUpperCase();
  const destCode = destCity.slice(0, 3).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Data Pengiriman Berhasil Diinput
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Resi AWB resmi telah diterbitkan. Tempelkan label thermal barcode ini pada paket.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyResi}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin!' : 'Salin Resi'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            Cetak Label Thermal (Print)
          </button>

          {onTrack && (
            <button
              onClick={() => onTrack(delivery.trackingNumber)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Lacak Resi
            </button>
          )}

          {onNewShipment && (
            <button
              onClick={onNewShipment}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              Input Paket Baru <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* OFFICIAL WAYBILL THERMAL LABEL (100mm x 150mm Layout) */}
      <div className="flex justify-center">
        <div
          ref={labelRef}
          id="shipping-label-printable"
          className="w-full max-w-[420px] bg-white border-2 border-slate-900 rounded-xl p-4 sm:p-5 shadow-lg text-slate-900 font-sans print:shadow-none print:border-black print:m-0 print:max-w-none print:w-[100mm]"
          style={{ minHeight: '560px' }}
        >
          {/* 1. Header Bar: Logo, Service Tag, Route Badge */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo-app-icon.png"
                alt="AZ GO Logo"
                className="w-10 h-10 rounded-xl object-contain border border-slate-300 shadow-xs"
              />
              <div>
                <img
                  src="/logo-horizontal.png"
                  alt="AZ GO"
                  className="h-6 w-auto object-contain"
                />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  {isExpress ? '🚚 AZ EXPRESS (KILAT)' : isCargo ? '🚛 AZ CARGO' : '📦 AZ COURIER (REGULER)'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-sm rounded-lg tracking-wider">
                {isExpress ? 'SAMEDAY' : isCargo ? 'CARGO' : 'REGULER'}
              </div>
              <div className="text-[11px] font-mono font-black text-slate-800 mt-0.5">
                {originCode} ➔ {destCode}
              </div>
            </div>
          </div>

          {/* 2. Routing Gateway Code Banner */}
          <div className="bg-slate-100 border-b-2 border-slate-900 py-1.5 px-3 flex justify-between items-center text-xs font-mono font-black">
            <span>GATEWAY: {originCode}-{destCode}-01</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">
              HUB DROP POINT
            </span>
          </div>

          {/* 3. Barcode Resi & AWB Display */}
          <div className="py-4 border-b-2 border-slate-900 text-center bg-slate-50/50 flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              SCAN BARCODE RESI
            </span>
            <Barcode value={delivery.trackingNumber} height={52} />
          </div>

          {/* 4. Destination & Recipient Section */}
          <div className="py-2.5 border-b-2 border-slate-900 space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
              <span>PENERIMA (DESTINATION)</span>
              <span className="text-slate-900 font-extrabold bg-slate-200 px-2 py-0.5 rounded">
                KOTA {destCity.toUpperCase()}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-950 leading-tight">
              {delivery.recipientName}
            </h3>
            <p className="text-xs font-mono font-bold text-slate-800">
              {delivery.recipientPhone}
            </p>
            <p className="text-xs text-slate-700 leading-snug pt-0.5">
              {delivery.recipientAddress || `Tujuan Pengiriman Kota ${destCity}, Jawa Barat`}
            </p>
          </div>

          {/* 5. Sender Section */}
          <div className="py-2 border-b-2 border-slate-900 text-xs space-y-0.5 bg-slate-50/50 px-2 rounded-lg my-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              PENGIRIM (SENDER):
            </span>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">{delivery.senderName || 'Drop Point AZ GO'}</span>
              <span className="text-[11px] font-mono text-slate-600">{delivery.senderPhone || '-'}</span>
            </div>
            <p className="text-[11px] text-slate-600 truncate">
              {delivery.senderAddress || `Drop Point Asal ${originCity}`}
            </p>
          </div>

          {/* 6. Package Specifications Grid */}
          <div className="grid grid-cols-3 border-b-2 border-slate-900 text-[11px] divide-x-2 divide-slate-900 text-center py-1.5 bg-slate-50">
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Berat Timbang</span>
              <span className="font-black text-slate-900 text-xs">{delivery.weightKg} Kg</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Berat Hitung</span>
              <span className="font-black text-rose-700 text-xs">{delivery.chargeableWeightKg} Kg</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Dimensi (PxLxT)</span>
              <span className="font-bold text-slate-900 text-[10px]">
                {delivery.lengthCm}x{delivery.widthCm}x{delivery.heightCm}
              </span>
            </div>
          </div>

          {/* 7. Package Type, Item Description, and Total Ongkir */}
          <div className="py-2 border-b-2 border-slate-900 text-xs flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Kategori & Isi Barang:</span>
              <span className="font-extrabold text-slate-900">
                {delivery.packageType} • {delivery.itemDescription || 'Barang Kiriman'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Biaya Kirim:</span>
              <span className="text-sm font-black text-slate-900">
                Rp {(delivery.totalAmount || fare?.totalAmount || 15000).toLocaleString('id-ID')}
              </span>
              <span className="text-[9px] font-extrabold text-emerald-700 block">LUNAS / NON-COD</span>
            </div>
          </div>

          {/* 8. Footer: Verification, QR, Petugas, Signature */}
          <div className="pt-2 flex items-center justify-between gap-3 text-[10px]">
            <div className="flex items-center gap-2">
              <div className="p-1 border border-slate-900 rounded bg-white">
                <QrCode className="w-8 h-8 text-slate-900" />
              </div>
              <div className="leading-tight">
                <span className="font-bold block text-slate-800">Petugas: {operatorName}</span>
                <span className="text-[9px] text-slate-400">
                  {new Date(delivery.createdAt || Date.now()).toLocaleString('id-ID')}
                </span>
                <span className="text-[8px] text-slate-500 block">Wajib Scan di Setiap Hub</span>
              </div>
            </div>

            <div className="flex gap-2 text-center text-[9px] font-bold">
              <div className="w-16 border border-slate-400 rounded p-1">
                <div className="h-6"></div>
                <span className="text-[8px] text-slate-500 border-t border-slate-300 block pt-0.5">Petugas</span>
              </div>
              <div className="w-16 border border-slate-400 rounded p-1">
                <div className="h-6"></div>
                <span className="text-[8px] text-slate-500 border-t border-slate-300 block pt-0.5">Kurir Antar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
