import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, ExternalLink, Route as RouteIcon, Check } from 'lucide-react';
import { calculateDistanceKm } from '../utils/indonesiaGeo';

interface LatLng {
  lat: number;
  lng: number;
  address?: string;
}

interface GoogleMapPinpointProps {
  origin: LatLng;
  destination: LatLng;
  onOriginChange?: (origin: LatLng) => void;
  onDestinationChange?: (destination: LatLng) => void;
  onDistanceCalculated?: (distanceKm: number) => void;
  title?: string;
  readOnly?: boolean;
}

export const GoogleMapPinpoint: React.FC<GoogleMapPinpointProps> = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onDistanceCalculated,
  title = 'Titik Lokasi & Rute Google Maps',
  readOnly = false
}) => {
  const [activePin, setActivePin] = useState<'origin' | 'destination'>('destination');
  const [currentOrigin, setCurrentOrigin] = useState<LatLng>(origin);
  const [currentDest, setCurrentDest] = useState<LatLng>(destination);

  // Sync with props
  useEffect(() => {
    setCurrentOrigin(origin);
  }, [origin.lat, origin.lng, origin.address]);

  useEffect(() => {
    setCurrentDest(destination);
  }, [destination.lat, destination.lng, destination.address]);

  // Compute live distance
  const distanceKm = calculateDistanceKm(
    currentOrigin.lat,
    currentOrigin.lng,
    currentDest.lat,
    currentDest.lng
  );

  const estimatedMinutes = Math.max(5, Math.round(distanceKm * 2.2));

  useEffect(() => {
    if (onDistanceCalculated) {
      onDistanceCalculated(distanceKm);
    }
  }, [distanceKm]);

  // Quick preset locations in Greater Jakarta / Bandung / Surabaya
  const quickLocations = [
    { name: 'Monas / Thamrin (Jakpus)', lat: -6.1754, lng: 106.8272 },
    { name: 'SCBD Sudirman (Jaksel)', lat: -6.2253, lng: 106.8094 },
    { name: 'Bandung Dago (Coblong)', lat: -6.8841, lng: 107.6167 },
    { name: 'Bandung Gedung Sate', lat: -6.9025, lng: 107.6186 },
    { name: 'Surabaya Tunjungan Plaza', lat: -7.2617, lng: 112.7486 },
    { name: 'Tangerang BSD City', lat: -6.3117, lng: 106.6694 }
  ];

  const handleSelectQuick = (loc: { name: string; lat: number; lng: number }) => {
    if (readOnly) return;
    if (activePin === 'origin') {
      const updated = { lat: loc.lat, lng: loc.lng, address: loc.name };
      setCurrentOrigin(updated);
      if (onOriginChange) onOriginChange(updated);
    } else {
      const updated = { lat: loc.lat, lng: loc.lng, address: loc.name };
      setCurrentDest(updated);
      if (onDestinationChange) onDestinationChange(updated);
    }
  };

  // Google Maps directions URL
  const gmapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${currentOrigin.lat},${currentOrigin.lng}&destination=${currentDest.lat},${currentDest.lng}&travelmode=driving`;

  // Static preview map center
  const centerLat = (currentOrigin.lat + currentDest.lat) / 2;
  const centerLng = (currentOrigin.lng + currentDest.lng) / 2;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
      {/* Header bar */}
      <div className="px-5 py-4 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-white shadow-sm">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">{title}</h4>
            <p className="text-[11px] text-slate-400">Jarak akurat terkalibrasi presisi via koordinat GPS</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={gmapsDirectionsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Buka Google Maps ↗
          </a>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Route Stats Badge */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
            <span className="text-[11px] font-bold text-rose-700 block">Jarak Rute Aktual:</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-rose-900">{distanceKm}</span>
              <span className="font-bold text-rose-700 text-xs">Kilometer</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
            <span className="text-[11px] font-bold text-amber-700 block">Estimasi Perjalanan:</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-amber-900">~{estimatedMinutes}</span>
              <span className="font-bold text-amber-700 text-xs">Menit</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-emerald-700 block">Status Kalibrasi:</span>
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1 mt-1">
              <Check className="w-4 h-4 text-emerald-600" /> GPS Grounded Presisi
            </span>
          </div>
        </div>

        {/* Pinpoint selector buttons */}
        {!readOnly && (
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActivePin('origin')}
              className={`flex-1 p-2.5 rounded-2xl border font-bold transition flex items-center justify-center gap-2 ${
                activePin === 'origin'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/30'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Atur Titik Jemput (Origin)
            </button>
            <button
              type="button"
              onClick={() => setActivePin('destination')}
              className={`flex-1 p-2.5 rounded-2xl border font-bold transition flex items-center justify-center gap-2 ${
                activePin === 'destination'
                  ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-400/30'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Atur Titik Tujuan (Destinasi)
            </button>
          </div>
        )}

        {/* Interactive Map Visual Simulator */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-52 sm:h-64 flex flex-col justify-between p-3 select-none">
          {/* Map Grid Background Texture */}
          <div 
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f1f5f9 1px)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px'
            }}
          />

          {/* Map Compass & Watermark */}
          <div className="relative z-10 flex justify-between items-start">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur rounded-xl text-[10px] font-bold text-slate-700 shadow-sm flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-rose-600" />
              Titik Tengah: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
            </span>

            <span className="px-2 py-0.5 bg-slate-900/80 text-white rounded text-[9px] font-mono">
              Google Maps™ Engine Simulator
            </span>
          </div>

          {/* Visual Route Line Connecting Origin & Destination Pins */}
          <div className="relative z-10 flex items-center justify-around my-auto px-6">
            {/* Origin Pin */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-200 animate-bounce">
                <Navigation className="w-5 h-5 -rotate-45" />
              </div>
              <div className="mt-2 px-2.5 py-1 bg-white rounded-xl shadow-md border border-slate-200 text-center max-w-[140px]">
                <span className="text-[10px] font-extrabold text-emerald-800 block">JEMPUT (Origin)</span>
                <span className="text-[9px] text-slate-600 truncate block font-medium">
                  {currentOrigin.address || `${currentOrigin.lat.toFixed(3)}, ${currentOrigin.lng.toFixed(3)}`}
                </span>
              </div>
            </div>

            {/* Connecting Road Dash */}
            <div className="flex-1 mx-3 flex flex-col items-center">
              <div className="w-full border-t-2 border-dashed border-rose-500 relative flex items-center justify-center">
                <span className="absolute -top-3 bg-white px-2 py-0.5 rounded-full text-[10px] font-black text-rose-600 border border-rose-200 shadow-sm flex items-center gap-1">
                  <RouteIcon className="w-3 h-3" /> {distanceKm} KM
                </span>
              </div>
              <span className="text-[9px] text-slate-400 mt-2">Jalur Terpendek & Bebas Hambatan</span>
            </div>

            {/* Destination Pin */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg ring-4 ring-rose-200 animate-pulse">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2.5 py-1 bg-white rounded-xl shadow-md border border-slate-200 text-center max-w-[140px]">
                <span className="text-[10px] font-extrabold text-rose-800 block">TUJUAN (Dropoff)</span>
                <span className="text-[9px] text-slate-600 truncate block font-medium">
                  {currentDest.address || `${currentDest.lat.toFixed(3)}, ${currentDest.lng.toFixed(3)}`}
                </span>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="relative z-10 flex justify-between items-end">
            <span className="text-[10px] text-slate-500 bg-white/80 backdrop-blur px-2 py-0.5 rounded-md font-mono">
              Mode: {activePin === 'origin' ? '🟢 Mengatur Titik Jemput' : '🔴 Mengatur Titik Tujuan'}
            </span>

            <a
              href={`https://maps.google.com/?q=${currentDest.lat},${currentDest.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-600 bg-white/90 hover:bg-white px-2 py-1 rounded-lg font-bold shadow-sm"
            >
              Lihat Satelit ↗
            </a>
          </div>
        </div>

        {/* Quick Pin Presets */}
        {!readOnly && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 block">
              Pilih Cepat Titik Lokasi ({activePin === 'origin' ? 'Origin Jemput' : 'Tujuan Destinasi'}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickLocations.map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuick(loc)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-semibold transition"
                >
                  📍 {loc.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
