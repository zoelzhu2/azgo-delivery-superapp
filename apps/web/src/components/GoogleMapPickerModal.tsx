import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  X, 
  MapPin, 
  Search, 
  Crosshair, 
  Check, 
  ExternalLink, 
  Compass, 
  Sparkles,
  ShieldCheck,
  Layers,
  Loader2
} from 'lucide-react';

export interface LocationPoint {
  address: string;
  lat: number;
  lng: number;
  notes?: string;
}

export interface GoogleMapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTitle: string;
  targetType: 'PICKUP' | 'DROPOFF';
  currentPoint: LocationPoint;
  onSelectLocation: (point: LocationPoint) => void;
}

// Landmark populer di Surabaya & sekitarnya untuk pencarian cepat
const SURABAYA_LANDMARKS: Array<{ name: string; address: string; lat: number; lng: number; category: string }> = [
  {
    name: 'Tunjungan Plaza (TP)',
    address: 'Jl. Jenderal Basuki Rachmat No. 8-12, Kedungdoro, Tegalsari, Surabaya',
    lat: -7.2617,
    lng: 112.7388,
    category: 'Mall & Pusat Belanja'
  },
  {
    name: 'Pakuwon Mall Supermal',
    address: 'Jl. Mayjen Yono Suwoyo No. 2, Babatan, Wiyung, Surabaya',
    lat: -7.2965,
    lng: 112.6780,
    category: 'Mall & Pusat Belanja'
  },
  {
    name: 'Jl. Raya Darmo (Wonokromo)',
    address: 'Jl. Raya Darmo No. 12, Darmo, Wonokromo, Surabaya',
    lat: -7.2912,
    lng: 112.7381,
    category: 'Jalan Protokol'
  },
  {
    name: 'Stasiun Gubeng Baru',
    address: 'Jl. Gubeng Masjid No. 1, Pacar Keling, Tambaksari, Surabaya',
    lat: -7.2655,
    lng: 112.7521,
    category: 'Stasiun & Transportasi'
  },
  {
    name: 'Galaxy Mall Surabaya',
    address: 'Jl. Dharmahusada Indah Timur No. 35-37, Mulyorejo, Surabaya',
    lat: -7.2750,
    lng: 112.7801,
    category: 'Mall & Pusat Belanja'
  },
  {
    name: 'Royal Plaza Surabaya',
    address: 'Jl. Ahmad Yani No. 16-18, Wonokromo, Surabaya',
    lat: -7.3090,
    lng: 112.7344,
    category: 'Mall & Pusat Belanja'
  },
  {
    name: 'Ciputra World Surabaya',
    address: 'Jl. Mayjen Sungkono No. 89, Gunung Sari, Dukuh Pakis, Surabaya',
    lat: -7.2925,
    lng: 112.7188,
    category: 'Mall & Pusat Belanja'
  },
  {
    name: 'Stasiun Pasar Turi',
    address: 'Jl. Semarang No. 1, Tembok Dukuh, Bubutan, Surabaya',
    lat: -7.2474,
    lng: 112.7324,
    category: 'Stasiun & Transportasi'
  },
  {
    name: 'Kampus B UNAIR (Airlangga)',
    address: 'Jl. Dharmawangsa No. 29, Airlangga, Gubeng, Surabaya',
    lat: -7.2721,
    lng: 112.7585,
    category: 'Kampus & Universitas'
  },
  {
    name: 'Kampus ITS Sukolilo',
    address: 'Jl. Raya ITS, Keputih, Sukolilo, Surabaya',
    lat: -7.2824,
    lng: 112.7949,
    category: 'Kampus & Universitas'
  },
  {
    name: 'Kawasan Industri SIER Rungkut',
    address: 'Jl. Rungkut Industri Raya No. 10, Rungkut, Surabaya',
    lat: -7.3320,
    lng: 112.7610,
    category: 'Kawasan Industri'
  },
  {
    name: 'Pelabuhan Tanjung Perak',
    address: 'Jl. Perak Timur No. 610, Perak Utara, Pabean Cantian, Surabaya',
    lat: -7.2023,
    lng: 112.7360,
    category: 'Pelabuhan'
  },
  {
    name: 'Bandara Internasional Juanda',
    address: 'Jl. Ir. H. Juanda, Betro, Sedati, Kabupaten Sidoarjo',
    lat: -7.3797,
    lng: 112.7876,
    category: 'Bandara'
  }
];

// Helper custom draggable Leaflet DivIcon
const createDraggablePinIcon = (isPickup: boolean) => {
  const color = isPickup ? '#059669' : '#e11d48';
  const label = isPickup ? '🟢 AMBIL (JEMPUT)' : '🔴 ANTAR (TUJUAN)';
  return L.divIcon({
    className: 'custom-draggable-pin',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: grab;">
        <div style="background-color: ${color}; color: white; font-size: 10px; font-weight: 900; padding: 3px 8px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(0,0,0,0.35); border: 2px solid white; white-space: nowrap; margin-bottom: 2px; letter-spacing: 0.5px;">
          ${label}
        </div>
        <div style="width: 38px; height: 38px; background-color: ${color}; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px -3px rgba(0,0,0,0.45); border: 3px solid white; animation: pulse 2s infinite;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3" fill="${color}"/>
          </svg>
        </div>
        <div style="width: 3px; height: 7px; background-color: #0f172a; border-radius: 2px;"></div>
        <div style="width: 16px; height: 5px; background-color: rgba(0,0,0,0.35); border-radius: 9999px; filter: blur(1.5px);"></div>
      </div>
    `,
    iconSize: [40, 60],
    iconAnchor: [20, 60]
  });
};

export const GoogleMapPickerModal: React.FC<GoogleMapPickerModalProps> = ({
  isOpen,
  onClose,
  targetTitle,
  targetType,
  currentPoint,
  onSelectLocation
}) => {
  const [selectedLat, setSelectedLat] = useState<number>(currentPoint.lat || -7.2912);
  const [selectedLng, setSelectedLng] = useState<number>(currentPoint.lng || 112.7381);
  const [addressText, setAddressText] = useState<string>(currentPoint.address || '');
  const [detailNotes, setDetailNotes] = useState<string>(currentPoint.notes || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; address: string; lat: number; lng: number }>>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [mapLayerType, setMapLayerType] = useState<'ROAD' | 'SATELLITE'>('ROAD');
  const [toastMessage, setToastMessage] = useState<string>('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerInstanceRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const isPickup = targetType === 'PICKUP';

  // Sinkronisasi state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const initialLat = currentPoint.lat || -7.2912;
      const initialLng = currentPoint.lng || 112.7381;
      const initialAddr = currentPoint.address || (isPickup ? 'Jl. Raya Darmo No. 12, Wonokromo, Surabaya' : 'Pakuwon Mall, Wiyung, Surabaya');
      
      setSelectedLat(initialLat);
      setSelectedLng(initialLng);
      setAddressText(initialAddr);
      setDetailNotes(currentPoint.notes || '');
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen, currentPoint, isPickup]);

  // Inisialisasi peta Leaflet saat modal terbuka
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Bersihkan map instance lama jika ada
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialLat = currentPoint.lat || -7.2912;
    const initialLng = currentPoint.lng || 112.7381;

    // Inisialisasi Map
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: false
    });

    // Tambah Tile Layer Google Maps
    const roadUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    const satUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    const activeTileUrl = mapLayerType === 'ROAD' ? roadUrl : satUrl;

    const tileLayer = L.tileLayer(activeTileUrl, {
      maxZoom: 21,
      attribution: '© Google Maps'
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Marker yang BISA DIGESER (draggable: true)
    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
      icon: createDraggablePinIcon(isPickup),
      autoPan: true
    }).addTo(map);

    // Event saat pin digeser selesai (dragend)
    marker.on('dragend', () => {
      const newPos = marker.getLatLng();
      const newLat = +newPos.lat.toFixed(5);
      const newLng = +newPos.lng.toFixed(5);
      setSelectedLat(newLat);
      setSelectedLng(newLng);
      setToastMessage(`📍 Pin dipindahkan ke ${newLat}, ${newLng}`);
      setTimeout(() => setToastMessage(''), 3000);
      handleReverseGeocode(newLat, newLng);
    });

    // Event saat peta diklik (click anywhere on map to reposition pin)
    map.on('click', (e: L.LeafletMouseEvent) => {
      const newLat = +e.latlng.lat.toFixed(5);
      const newLng = +e.latlng.lng.toFixed(5);
      marker.setLatLng([newLat, newLng]);
      setSelectedLat(newLat);
      setSelectedLng(newLng);
      setToastMessage(`📍 Pin dipasang di titik yang diklik (${newLat}, ${newLng})`);
      setTimeout(() => setToastMessage(''), 3000);
      handleReverseGeocode(newLat, newLng);
    });

    mapInstanceRef.current = map;
    markerInstanceRef.current = marker;

    // Invalidate size setelah modal selesai render animasi
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, mapLayerType, isPickup]);

  // Fungsi ganti tipe layer (Road vs Satellite)
  const handleToggleLayer = () => {
    const nextType = mapLayerType === 'ROAD' ? 'SATELLITE' : 'ROAD';
    setMapLayerType(nextType);
  };

  // Reverse Geocode: Mengubah Koordinat Lat/Lng menjadi Nama Jalan Lengkap
  const handleReverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'AzDeliveryPlatform/1.0' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          // Bersihkan dan format nama alamat agar rapi
          const cleanAddress = data.display_name;
          setAddressText(cleanAddress);
        }
      }
    } catch {
      // Fallback jika rate limit atau offline
      setAddressText(prev => prev || `Lokasi Terpilih (Lat: ${lat}, Lng: ${lng}), Surabaya`);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Geocode: Pencarian Alamat / Tempat secara Bebas
  const handleExecuteSearch = async (queryText = searchQuery) => {
    const q = queryText.trim();
    if (!q) return;

    setIsSearching(true);
    const combinedResults: Array<{ name: string; address: string; lat: number; lng: number }> = [];

    // 1. Cek dari database lokal Surabaya terlebih dahulu
    const localMatches = SURABAYA_LANDMARKS.filter(
      l => l.name.toLowerCase().includes(q.toLowerCase()) || l.address.toLowerCase().includes(q.toLowerCase())
    );
    localMatches.forEach(m => {
      combinedResults.push({
        name: m.name,
        address: m.address,
        lat: m.lat,
        lng: m.lng
      });
    });

    // 2. Cari via Nominatim OpenStreetMap API untuk seluruh jalan / tempat di Indonesia
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ' Jawa Timur Indonesia')}&limit=6&addressdetails=1`,
        { headers: { 'User-Agent': 'AzDeliveryPlatform/1.0' } }
      );
      if (res.ok) {
        const apiData = await res.json();
        if (Array.isArray(apiData)) {
          apiData.forEach((item: any) => {
            const placeName = item.name || item.display_name.split(',')[0];
            // Cegah duplikasi
            if (!combinedResults.some(r => Math.abs(r.lat - parseFloat(item.lat)) < 0.001)) {
              combinedResults.push({
                name: placeName,
                address: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
              });
            }
          });
        }
      }
    } catch (err) {
      console.warn('Geocoding search fallback:', err);
    }

    // 3. Selalu sediakan opsi Custom Name jika pengguna mencari nama bisnis khusus (misal "azzura_company")
    if (!combinedResults.some(r => r.name.toLowerCase() === q.toLowerCase())) {
      combinedResults.unshift({
        name: q,
        address: `${q}, Surabaya, Jawa Timur (Geser pin pada peta untuk lokasi presisi)`,
        lat: selectedLat,
        lng: selectedLng
      });
    }

    setSearchResults(combinedResults);
    setIsSearching(false);
  };

  // Pilih hasil pencarian
  const handleSelectSearchResult = (item: { name: string; address: string; lat: number; lng: number }) => {
    setSelectedLat(item.lat);
    setSelectedLng(item.lng);
    setAddressText(item.address);
    setSearchResults([]);
    setSearchQuery('');

    // Arahkan kamera peta dan pindahkan marker
    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.flyTo([item.lat, item.lng], 17, { duration: 1 });
      markerInstanceRef.current.setLatLng([item.lat, item.lng]);
    }

    setToastMessage(`📍 Peta diarahkan ke: ${item.name}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Deteksi Lokasi GPS Riil Perangkat Pengguna
  const handleGetDeviceLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung deteksi lokasi otomatis.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = +pos.coords.latitude.toFixed(5);
        const lng = +pos.coords.longitude.toFixed(5);
        setSelectedLat(lat);
        setSelectedLng(lng);

        if (mapInstanceRef.current && markerInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1 });
          markerInstanceRef.current.setLatLng([lat, lng]);
        }

        setIsLocating(false);
        setToastMessage('✅ Berhasil mendeteksi lokasi GPS Anda saat ini');
        setTimeout(() => setToastMessage(''), 3000);
        handleReverseGeocode(lat, lng);
      },
      () => {
        setIsLocating(false);
        setToastMessage('Izin GPS tidak aktif. Menggunakan koordinat saat ini.');
        setTimeout(() => setToastMessage(''), 3000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Zoom In / Out
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Simpan hasil pemilihan lokasi
  const handleSave = () => {
    const finalAddress = addressText.trim() || `Titik Lokasi (${selectedLat.toFixed(5)}, ${selectedLng.toFixed(5)})`;
    onSelectLocation({
      address: finalAddress,
      lat: selectedLat,
      lng: selectedLng,
      notes: detailNotes.trim()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-3 flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
              isPickup ? 'bg-emerald-600 ring-2 ring-emerald-400/30' : 'bg-rose-600 ring-2 ring-rose-400/30'
            }`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isPickup ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {isPickup ? 'Titik Ambil / Penjemputan' : 'Titik Antar / Tujuan'}
                </span>
                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Pin Bisa Digeser Bebas
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">{targetTitle}</h3>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          
          {/* Search Box & GPS Locator */}
          <div className="space-y-2">
            <form 
              onSubmit={e => {
                e.preventDefault();
                handleExecuteSearch();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Ketik nama jalan, kantor, ruko, mall (cth: azzura_company, Pakuwon)..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-rose-500 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> : <Search className="w-4 h-4" />}
                <span>Cari</span>
              </button>

              <button
                type="button"
                onClick={handleGetDeviceLocation}
                disabled={isLocating}
                title="Gunakan Lokasi GPS Saya Saat Ini"
                className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs"
              >
                <Crosshair className={`w-4 h-4 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isLocating ? 'GPS...' : 'Lokasi Saya'}</span>
              </button>
            </form>

            {/* Hasil Pencarian Autocomplete / Geocoding */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-xl overflow-hidden divide-y divide-slate-100 max-h-52 overflow-y-auto z-20 relative">
                <div className="bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-900 flex items-center justify-between">
                  <span>Hasil Pencarian Lokasi:</span>
                  <span className="text-[10px] text-amber-700">Klik untuk memindahkan pin</span>
                </div>
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSearchResult(item)}
                    className="p-3 hover:bg-rose-50/60 cursor-pointer flex items-start gap-2.5 transition group"
                  >
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="truncate flex-1">
                      <strong className="text-xs font-bold text-slate-900 block truncate group-hover:text-rose-700">
                        {item.name}
                      </strong>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.address}</p>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold shrink-0 self-center">
                      Pilih ➔
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Chips Cepat Landmark Surabaya */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-slate-400 font-bold shrink-0 text-[10px]">Pilihan Cepat:</span>
              {SURABAYA_LANDMARKS.slice(0, 6).map((l, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(l)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-semibold whitespace-nowrap transition shrink-0 cursor-pointer text-[10px]"
                >
                  📍 {l.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Kanvas Peta Interaktif Leaflet Real Tiles */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-300 shadow-md">
            
            {/* Map Container */}
            <div 
              ref={mapContainerRef} 
              className="h-64 sm:h-80 w-full bg-slate-100 relative z-0"
              style={{ minHeight: '260px' }}
            />

            {/* Map Floating Badges & Controls */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur rounded-xl text-[11px] font-extrabold text-slate-800 shadow-md border border-slate-200 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-rose-600" />
                Google Maps™ Interactive Engine
              </span>
            </div>

            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              {/* Toggle Layer (Road vs Satellite) */}
              <button
                type="button"
                onClick={handleToggleLayer}
                className="px-2.5 py-1.5 bg-white/95 hover:bg-white text-slate-800 rounded-xl text-[11px] font-bold shadow-md border border-slate-200 flex items-center gap-1 transition cursor-pointer"
                title="Ubah Tampilan Peta (Jalan / Satelit)"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">{mapLayerType === 'ROAD' ? 'Satelit' : 'Peta Jalan'}</span>
              </button>

              {/* External Google Maps Link */}
              <a
                href={`https://www.google.com/maps?q=${selectedLat},${selectedLng}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-xl text-[11px] font-bold shadow-md flex items-center gap-1 transition"
                title="Buka titik koordinat di Google Maps Web/App"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">GMaps ↗</span>
              </a>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-12 right-3 z-10 flex flex-col gap-1 shadow-md rounded-xl overflow-hidden border border-slate-300">
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center transition cursor-pointer"
                title="Perbesar Peta"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center border-t border-slate-200 transition cursor-pointer"
                title="Perkecil Peta"
              >
                -
              </button>
            </div>

            {/* Banner Panduan Geser Pin */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <span className="px-3.5 py-1 bg-slate-950/85 text-white text-[10px] font-bold rounded-full shadow-lg backdrop-blur-xs flex items-center gap-1.5 whitespace-nowrap border border-white/20">
                ✋ <strong>Klik peta</strong> atau <strong>geser pin</strong> ke lokasi persis (depan pagar/lobi)
              </span>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2 animate-in fade-in duration-150">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Form Alamat Hasil Tagging & Reverse Geocode */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800">Alamat Lengkap Titik Terpilih:</span>
                {isReverseGeocoding && (
                  <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" /> Mendeteksi nama jalan...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-extrabold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {selectedLat.toFixed(5)}, {selectedLng.toFixed(5)}
                </span>
                <span className="text-[10px] text-emerald-700 font-black flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Akurat
                </span>
              </div>
            </div>

            <textarea
              rows={2}
              value={addressText}
              onChange={e => setAddressText(e.target.value)}
              placeholder="Nama jalan, nomor rumah/gedung, kelurahan, kecamatan..."
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-rose-500 leading-snug"
            />

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Detail Patokan Tambahan untuk Kurir (Opsional):
              </label>
              <input
                type="text"
                value={detailNotes}
                onChange={e => setDetailNotes(e.target.value)}
                placeholder="Contoh: Depan pos satpam pagar hitam, samping lobi barat, atau ruko lt. 2"
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-rose-500 font-medium"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`px-6 py-2.5 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition cursor-pointer ${
              isPickup
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 ring-2 ring-emerald-500/40'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-rose-600/25 ring-2 ring-rose-500/40'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Pasang Titik Lokasi Ini</span>
          </button>
        </div>

      </div>
    </div>
  );
};
