import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Compass, 
  Layers, 
  ExternalLink, 
  Route as RouteIcon, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Volume2, 
  VolumeX, 
  ZoomIn, 
  ZoomOut,
  Crosshair,
  Store,
  Home,
  Bike,
  Globe,
  Radio
} from 'lucide-react';

interface GoogleMapsDriverNavProps {
  pickupAddress: string;
  dropoffAddress: string;
  distanceKm: number;
  serviceName?: string;
  orderNumber?: string;
  heightClass?: string;
  compact?: boolean;
  tripPhase?: 'OFFER' | 'PICKING_UP' | 'ARRIVED_PICKUP' | 'IN_TRANSIT' | 'COMPLETED';
}

interface RouteSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  angle: number;
  roadName: string;
  turnIcon: 'straight' | 'left' | 'right' | 'dest';
  turnInstruction: string;
}

// 6 exact route segments along real street grid (viewBox 600 x 360)
// Driver Start (90, 280) -> Turn North (180, 280) -> Turn East (180, 180) -> Resto (240, 180) -> Turn North (440, 180) -> Turn East (440, 90) -> Customer (530, 90)
const ROUTE_SEGMENTS: RouteSegment[] = [
  {
    x1: 90,
    y1: 280,
    x2: 180,
    y2: 280,
    length: 90,
    angle: 0,
    roadName: 'Jl. Diponegoro',
    turnIcon: 'left',
    turnInstruction: 'Belok Kiri ke Jl. Ciliwung'
  },
  {
    x1: 180,
    y1: 280,
    x2: 180,
    y2: 180,
    length: 100,
    angle: -90,
    roadName: 'Jl. Ciliwung',
    turnIcon: 'right',
    turnInstruction: 'Belok Kanan ke Jl. Raya Darmo'
  },
  {
    x1: 180,
    y1: 180,
    x2: 240,
    y2: 180,
    length: 60,
    angle: 0,
    roadName: 'Jl. Raya Darmo',
    turnIcon: 'dest',
    turnInstruction: 'Tiba di Titik Ambil (Resto / Toko)'
  },
  {
    x1: 240,
    y1: 180,
    x2: 440,
    y2: 180,
    length: 200,
    angle: 0,
    roadName: 'Jl. Raya Darmo',
    turnIcon: 'left',
    turnInstruction: 'Lanjut 200m lalu Belok Kiri ke Jl. Urip Sumoharjo'
  },
  {
    x1: 440,
    y1: 180,
    x2: 440,
    y2: 90,
    length: 90,
    angle: -90,
    roadName: 'Jl. Urip Sumoharjo',
    turnIcon: 'right',
    turnInstruction: 'Belok Kanan ke Jl. Basuki Rahmat'
  },
  {
    x1: 440,
    y1: 90,
    x2: 530,
    y2: 90,
    length: 90,
    angle: 0,
    roadName: 'Jl. Basuki Rahmat',
    turnIcon: 'dest',
    turnInstruction: 'Tiba di Alamat Pengantaran Pelanggan'
  }
];

const TOTAL_ROUTE_DISTANCE = ROUTE_SEGMENTS.reduce((acc, seg) => acc + seg.length, 0); // 630 units
const RESTO_DISTANCE_MARK = 90 + 100 + 60; // 250 units (end of seg 2)

export const GoogleMapsDriverNav: React.FC<GoogleMapsDriverNavProps> = ({
  pickupAddress,
  dropoffAddress,
  distanceKm,
  serviceName = 'Az Delivery (Makanan)',
  orderNumber = 'AZD-901824',
  heightClass = 'h-64 sm:h-72',
  compact = false,
  tripPhase = 'OFFER'
}) => {
  const [viewMode, setViewMode] = useState<'navigation' | 'satellite' | 'embed'>('navigation');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [progressDistance, setProgressDistance] = useState(0); // 0 to 630
  const [currentSpeed, setCurrentSpeed] = useState(38);

  const effectiveHeight = compact ? 'h-52 sm:h-60' : heightClass;
  const estimatedMinutes = Math.max(4, Math.round(distanceKm * 2.4));

  // Determine starting and ending boundary according to trip phase
  const isPhasePickupOnly = tripPhase === 'PICKING_UP';
  const isPhaseAtResto = tripPhase === 'ARRIVED_PICKUP';
  const isPhaseDeliveryOnly = tripPhase === 'IN_TRANSIT';
  const isPhaseCompleted = tripPhase === 'COMPLETED';

  // Animation Loop: accurately increments progress along the mathematical route
  useEffect(() => {
    if (isPhaseAtResto) {
      setProgressDistance(RESTO_DISTANCE_MARK);
      return;
    }
    if (isPhaseCompleted) {
      setProgressDistance(TOTAL_ROUTE_DISTANCE);
      return;
    }

    const interval = setInterval(() => {
      setProgressDistance(prev => {
        let step = 3.5;
        let maxDist = TOTAL_ROUTE_DISTANCE;
        let minDist = 0;

        if (isPhasePickupOnly) {
          maxDist = RESTO_DISTANCE_MARK;
          minDist = 0;
        } else if (isPhaseDeliveryOnly) {
          maxDist = TOTAL_ROUTE_DISTANCE;
          minDist = RESTO_DISTANCE_MARK;
        }

        let next = prev + step;
        if (next > maxDist) {
          next = minDist;
        }
        return next;
      });

      // Realistic speed variation (32 - 44 km/h)
      setCurrentSpeed(prev => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.min(45, Math.max(28, Math.round(prev + delta)));
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isPhasePickupOnly, isPhaseAtResto, isPhaseDeliveryOnly, isPhaseCompleted]);

  // Compute Vehicle Position & Heading angle along the exact road segment
  const computeVehicleState = (dist: number) => {
    let accumulated = 0;
    for (let i = 0; i < ROUTE_SEGMENTS.length; i++) {
      const seg = ROUTE_SEGMENTS[i];
      if (dist <= accumulated + seg.length || i === ROUTE_SEGMENTS.length - 1) {
        const localDist = Math.max(0, dist - accumulated);
        const t = Math.min(1, Math.max(0, localDist / seg.length));
        
        const x = seg.x1 + t * (seg.x2 - seg.x1);
        const y = seg.y1 + t * (seg.y2 - seg.y1);

        // Calculate smooth angle banking near corners (t > 0.8)
        let angle = seg.angle;
        if (t > 0.8 && i < ROUTE_SEGMENTS.length - 1) {
          const nextSeg = ROUTE_SEGMENTS[i + 1];
          const blend = (t - 0.8) / 0.2;
          angle = seg.angle + blend * (nextSeg.angle - seg.angle);
        }

        const remainingInSeg = Math.round(seg.length - localDist);

        return {
          x,
          y,
          angle,
          segmentIndex: i,
          roadName: seg.roadName,
          turnIcon: seg.turnIcon,
          turnInstruction: seg.turnInstruction,
          remainingMeters: Math.max(10, remainingInSeg * 2)
        };
      }
      accumulated += seg.length;
    }
    const lastSeg = ROUTE_SEGMENTS[ROUTE_SEGMENTS.length - 1];
    return {
      x: lastSeg.x2,
      y: lastSeg.y2,
      angle: lastSeg.angle,
      segmentIndex: ROUTE_SEGMENTS.length - 1,
      roadName: lastSeg.roadName,
      turnIcon: lastSeg.turnIcon,
      turnInstruction: lastSeg.turnInstruction,
      remainingMeters: 0
    };
  };

  const vehicleState = computeVehicleState(progressDistance);

  // Google Maps Official External Route URL
  const gmapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickupAddress)}&destination=${encodeURIComponent(dropoffAddress)}&travelmode=two_wheeler`;

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl select-none font-sans ${effectiveHeight} bg-[#e8ecef]`}>
      
      {/* ========================================================================= */}
      {/* MODE 1: OFFICIAL GOOGLE MAPS IFRAME (EMBED REAL MAP)                      */}
      {/* ========================================================================= */}
      {viewMode === 'embed' ? (
        <div className="absolute inset-0 z-10 w-full h-full bg-slate-100">
          <iframe
            title="Google Maps Live Official Embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(pickupAddress || 'Surabaya, Jawa Timur')}&t=m&z=15&ie=UTF8&iwloc=&output=embed`}
          />
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2 & 3: HYPER-REALISTIC GOOGLE MAPS NAVIGATION SIMULATOR (VECTOR/SAT)  */
        /* ========================================================================= */
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* A. SATELLITE LAYER (When in Satellite Mode) */}
          {viewMode === 'satellite' ? (
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-500 scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')`,
                filter: 'brightness(0.75) contrast(1.2)'
              }}
            >
              <div className="absolute inset-0 bg-slate-900/25" />
            </div>
          ) : (
            /* B. VECTOR GOOGLE MAPS CANVAS (Crisp, proportional, realistic roads) */
            <div className="absolute inset-0 bg-[#e8ecef] overflow-hidden">
              {/* City building block grid */}
              <svg className="absolute inset-0 w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="gmaps-blocks" width="70" height="70" patternUnits="userSpaceOnUse">
                    <rect x="6" y="6" width="26" height="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" rx="4" />
                    <rect x="38" y="6" width="26" height="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" rx="4" />
                    <rect x="6" y="38" width="26" height="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" rx="4" />
                    <rect x="38" y="38" width="26" height="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" rx="4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gmaps-blocks)" />
              </svg>

              {/* Waterway (Sungai Kalimas) & Parks (Taman Bungkul & Taman Prestasi) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice">
                {/* River Canal */}
                <path 
                  d="M -20,335 C 160,320 320,350 620,325" 
                  fill="none" 
                  stroke="#a5d8ff" 
                  strokeWidth="24" 
                  strokeLinecap="round"
                />
                <text x="210" y="338" fill="#0284c7" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                  Sungai Kalimas
                </text>

                {/* Green Park: Taman Bungkul */}
                <rect x="110" y="210" width="55" height="50" rx="8" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="1.5" />
                <circle cx="125" cy="225" r="4" fill="#86efac" />
                <circle cx="145" cy="240" r="5" fill="#86efac" />
                <text x="114" y="238" fill="#15803d" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Taman</text>
                <text x="114" y="247" fill="#15803d" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Bungkul</text>

                {/* Green Park: Taman Prestasi */}
                <rect x="330" y="115" width="80" height="45" rx="8" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="1.5" />
                <circle cx="350" cy="130" r="4" fill="#86efac" />
                <circle cx="390" cy="140" r="5" fill="#86efac" />
                <text x="350" y="142" fill="#15803d" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">Taman Prestasi</text>

                {/* Secondary Local Roads (White with subtle casing) */}
                <g stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 0,90 L 600,90" />
                  <path d="M 0,280 L 600,280" />
                  <path d="M 90,0 L 90,360" />
                  <path d="M 180,0 L 180,360" />
                  <path d="M 320,0 L 320,360" />
                  <path d="M 530,0 L 530,360" />
                </g>

                {/* Main Arterial Highways (Google Maps Orange-Beige) */}
                <g stroke="#fed7aa" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
                  {/* Jl. Raya Darmo */}
                  <path d="M 0,180 L 600,180" />
                  {/* Jl. Urip Sumoharjo */}
                  <path d="M 440,0 L 440,360" />
                </g>

                {/* Highway Centerline Markings (White Dashed) */}
                <g stroke="#ffffff" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round">
                  <path d="M 0,180 L 600,180" />
                  <path d="M 440,0 L 440,360" />
                </g>

                {/* Street Name Typography */}
                <text x="15" y="82" fill="#64748b" fontSize="8" fontWeight="bold">Jl. Embong Malang</text>
                <text x="450" y="82" fill="#64748b" fontSize="8.5" fontWeight="bold">Jl. Basuki Rahmat</text>
                <text x="15" y="172" fill="#9a3412" fontSize="9" fontWeight="extrabold">Jl. Raya Darmo</text>
                <text x="250" y="172" fill="#9a3412" fontSize="9" fontWeight="extrabold">Jl. Raya Darmo</text>
                <text x="15" y="272" fill="#64748b" fontSize="8" fontWeight="bold">Jl. Diponegoro</text>
                <text x="188" y="240" fill="#64748b" fontSize="7.5" fontWeight="bold">Jl. Ciliwung</text>
                <text x="448" y="240" fill="#9a3412" fontSize="8" fontWeight="extrabold">Jl. Urip Sumoharjo</text>
              </svg>
            </div>
          )}

          {/* C. DYNAMIC GOOGLE MAPS NAVIGATION ROUTE POLYLINE */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice">
            <defs>
              {/* Google Blue Route Glow Filter */}
              <filter id="route-nav-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1d4ed8" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* 1. White Background Casing for Full Active Route */}
            <path 
              d="M 90,280 L 180,280 L 180,180 L 440,180 L 440,90 L 530,90" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="10" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* 2. Full Active Polyline (Google Navigation Blue) */}
            <path 
              d="M 90,280 L 180,280 L 180,180 L 440,180 L 440,90 L 530,90" 
              fill="none" 
              stroke="#2563eb" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              filter="url(#route-nav-glow)"
            />

            {/* 3. Traffic Congestion Zone (Real Google Traffic Orange / Red on busy road) */}
            <path 
              d="M 320,180 L 410,180" 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d="M 410,180 L 440,180" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* 4. Animated Moving Directional Chevron Pulse */}
            <path 
              d="M 90,280 L 180,280 L 180,180 L 440,180 L 440,90 L 530,90" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="2.5" 
              strokeDasharray="5 18" 
              strokeLinecap="round" 
              className="animate-pulse"
            />
          </svg>

          {/* D. HTML OVERLAY MARKERS & MOVING VEHICLE */}
          <div className="absolute inset-0 pointer-events-none z-20">
            
            {/* 1. RESTO / PICKUP PIN (Fixed at X: 240, Y: 180 -> 40%, 50%) */}
            <div 
              className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-auto"
              style={{ left: `${(240 / 600) * 100}%`, top: `${(180 / 360) * 100}%` }}
            >
              <div 
                className="mb-1 px-2.5 py-0.5 bg-white border border-emerald-500 rounded-full shadow-lg flex items-center gap-1.5 text-[10px] font-black text-emerald-900 whitespace-nowrap animate-bounce max-w-[180px]"
                title={pickupAddress}
              >
                <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">1. AMBIL: {pickupAddress.split(',')[0]}</span>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-2xl flex items-center justify-center text-white ring-4 ring-emerald-500/25">
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
                <div className="w-2 h-2 bg-emerald-600 rotate-45 -mt-1 rounded-xs"></div>
              </div>
            </div>

            {/* 2. CUSTOMER / DROPOFF PIN (Fixed at X: 530, Y: 90 -> 88.3%, 25%) */}
            <div 
              className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-auto"
              style={{ left: `${(530 / 600) * 100}%`, top: `${(90 / 360) * 100}%` }}
            >
              <div 
                className="mb-1 px-2.5 py-0.5 bg-white border border-rose-500 rounded-full shadow-lg flex items-center gap-1.5 text-[10px] font-black text-rose-900 whitespace-nowrap max-w-[180px]"
                title={dropoffAddress}
              >
                <Home className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="truncate">2. ANTAR: {dropoffAddress.split(',')[0]}</span>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-2xl flex items-center justify-center text-white ring-4 ring-rose-500/25">
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
                <div className="w-2 h-2 bg-rose-600 rotate-45 -mt-1 rounded-xs"></div>
              </div>
            </div>

            {/* 3. DYNAMIC MOVING DRIVER VEHICLE (Strictly follows road polyline with smooth heading) */}
            <div 
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-linear flex flex-col items-center z-30"
              style={{
                left: `${(vehicleState.x / 600) * 100}%`,
                top: `${(vehicleState.y / 360) * 100}%`
              }}
            >
              {/* Radar Wave Ping */}
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute w-10 h-10 rounded-full bg-blue-500 opacity-60"></span>
                <span className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                  
                  {/* Rotating Motorbike Icon with Directional Heading */}
                  <div 
                    className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform duration-200"
                    style={{ transform: `rotate(${vehicleState.angle}deg)` }}
                  >
                    <Bike className="w-3.5 h-3.5" />
                  </div>
                </span>
              </div>

              {/* Driver Badge with Live Speedometer */}
              <div className="mt-1 px-2 py-0.5 bg-slate-950/90 text-white rounded-full shadow-lg border border-white/20 flex items-center gap-1 whitespace-nowrap text-[9px] font-black">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                <span>Driver (Anda) • {currentSpeed} km/j</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HUD OVERLAY: GOOGLE MAPS TURN-BY-TURN GUIDANCE BANNER (TOP)               */}
      {/* ========================================================================= */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-40 flex items-center justify-between gap-2 pointer-events-auto">
        
        {/* Google Maps Official Green Navigation Banner */}
        <div className="bg-[#137333] text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-emerald-400/30 flex items-center gap-3 flex-1 max-w-md backdrop-blur-md">
          {/* Turn Arrow Icon */}
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
            {vehicleState.turnIcon === 'left' && <ArrowLeft className="w-5 h-5 text-white" />}
            {vehicleState.turnIcon === 'right' && <ArrowRight className="w-5 h-5 text-white" />}
            {vehicleState.turnIcon === 'straight' && <ArrowUp className="w-5 h-5 text-white" />}
            {vehicleState.turnIcon === 'dest' && <MapPin className="w-5 h-5 text-amber-300" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-emerald-100 uppercase tracking-wider flex items-center gap-1">
                Dalam {vehicleState.remainingMeters}m {vehicleState.turnInstruction}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping shrink-0"></span>
            </div>
            <p className="text-xs font-bold text-emerald-200/90 truncate flex items-center gap-1.5 mt-0.5">
              <span>{serviceName}</span>
              <span>•</span>
              <span>{vehicleState.roadName}</span>
              <span>•</span>
              <span className="font-mono text-[10px] text-white/90">{orderNumber}</span>
            </p>
          </div>
        </div>

        {/* Top Right: Speed Limit & Audio Mute */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-lg border border-slate-200">
          {/* Speed Limit Sign (Indonesian Road Standard) */}
          <div className="w-7 h-7 rounded-full border-2 border-red-600 bg-white flex items-center justify-center text-[10px] font-black text-slate-900 shadow-xs" title="Batas Kecepatan 40 km/jam">
            40
          </div>
          
          <button
            type="button"
            onClick={() => setIsVoiceMuted(!isVoiceMuted)}
            className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            title={isVoiceMuted ? 'Aktifkan Suara Navigasi' : 'Bisukan Suara Navigasi'}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          <div className="w-px h-4 bg-slate-200" />
          <div className="p-1.5 text-slate-700" title="Arah Utara Kompas">
            <Compass className="w-4 h-4 text-rose-500 rotate-12" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING MAP CONTROLS (RIGHT SIDE)                                        */}
      {/* ========================================================================= */}
      <div className="absolute right-2.5 bottom-12 z-40 flex flex-col gap-1.5 pointer-events-auto">
        
        {/* Layer Switcher: Standard -> Satellite -> Official Google Maps Embed */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-slate-200 flex flex-col divide-y divide-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setViewMode('navigation')}
            className={`p-2 transition flex items-center justify-center ${
              viewMode === 'navigation' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
            title="Mode Peta Navigasi Vektor"
          >
            <RouteIcon className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => setViewMode('satellite')}
            className={`p-2 transition flex items-center justify-center ${
              viewMode === 'satellite' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
            title="Mode Citra Satelit Hybrid"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setViewMode('embed')}
            className={`p-2 transition flex items-center justify-center ${
              viewMode === 'embed' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
            title="Mode Google Maps Web Asli (Live)"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>

        {/* Recenter GPS target to vehicle */}
        <button
          type="button"
          onClick={() => {
            setProgressDistance(isPhasePickupOnly ? 0 : isPhaseDeliveryOnly ? RESTO_DISTANCE_MARK : 0);
            setZoomLevel(1.0);
          }}
          className="p-2 bg-white/95 hover:bg-white text-blue-600 rounded-2xl shadow-lg border border-slate-200 transition flex items-center justify-center"
          title="Fokuskan Kembali ke Posisi Driver"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Zoom Controls */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-slate-200 flex flex-col divide-y divide-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setZoomLevel(Math.min(zoomLevel + 0.15, 1.4))}
            className="p-2 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center"
            title="Perbesar Peta (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(Math.max(zoomLevel - 0.15, 0.85))}
            className="p-2 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center"
            title="Perkecil Peta (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM STATUS BAR & LIVE TRAFFIC WATERMARK                                */}
      {/* ========================================================================= */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-40 flex items-center justify-between pointer-events-auto">
        
        {/* Google Multi-Color Brand Pill */}
        <div className="flex items-center gap-1 px-3 py-1.5 bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-200 text-xs">
          <span className="font-black tracking-tight">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>
          <span className="text-slate-600 font-bold text-[10px] ml-1">Maps™ Live Traffic</span>
        </div>

        {/* Live Distance, ETA & External Navigation Link */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-slate-900/90 backdrop-blur text-white rounded-xl shadow-md text-xs font-black flex items-center gap-1.5 border border-white/20">
            <RouteIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>{distanceKm} KM</span>
            <span className="text-white/40">•</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>~{estimatedMinutes} Menit</span>
          </div>

          <a
            href={gmapsDirectionsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-xs font-bold flex items-center gap-1.5 transition"
            title="Buka rute navigasi di Google Maps resmi"
          >
            <ExternalLink className="w-3.5 h-3.5" /> G-Maps ↗
          </a>
        </div>
      </div>

    </div>
  );
};
