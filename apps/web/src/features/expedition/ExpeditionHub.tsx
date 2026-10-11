import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/apiClient';
import { User, ExpeditionDeliveryDetail, ExpeditionFareResult, ExpeditionPackageType } from '@delivery/shared';
import { ShippingLabel } from './ShippingLabel';
import { Barcode } from '../../components/Barcode';
import { 
  Package, 
  Search, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Building2, 
  Zap, 
  ArrowLeft, 
  Lock, 
  KeyRound, 
  LogOut, 
  Printer, 
  FileText,
  ArrowLeftRight,
  Scale,
  Camera,
  ScanLine,
  Keyboard,
  X,
  Volume2
} from 'lucide-react';
import { 
  INDONESIA_PROVINCES,
  INDONESIA_REGENCIES,
  INDONESIA_DISTRICTS,
  getRegenciesByProvince,
  getDistrictsByRegency,
  calculateDistanceKm
} from '../../utils/indonesiaGeo';
import { GoogleMapPinpoint } from '../../components/GoogleMapPinpoint';

import { CustomerOrder } from '../customer/CustomerOrderTrackingModal';

interface ExpeditionHubProps {
  initialSubTab?: 'rate' | 'send' | 'track' | 'scan';
  initialAwb?: string;
  isExpress?: boolean;
  isHubPortal?: boolean;
  onBack?: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
  onChangePassword?: () => void;
  onRequestLogin?: (roleMessage: string, callback?: () => void) => void;
  onOrderCreated?: (order: CustomerOrder) => void;
  onTrackOrder?: (order: CustomerOrder) => void;
}

export const ExpeditionHub: React.FC<ExpeditionHubProps> = ({
  initialSubTab = 'rate',
  initialAwb = '',
  isExpress = false,
  isHubPortal = false,
  onBack,
  currentUser,
  onLogout,
  onChangePassword,
  onRequestLogin,
  onOrderCreated,
  onTrackOrder
}) => {
  const [subTab, setSubTab] = useState<'rate' | 'send' | 'track' | 'scan'>(initialSubTab);
  const [lastPlacedCustomerOrder, setLastPlacedCustomerOrder] = useState<CustomerOrder | null>(null);

  // Active Hubs for Pos Scan
  const [activeHubs, setActiveHubs] = useState<any[]>([]);

  // Hierarchical Sender Geo State
  const [senderProvinceId, setSenderProvinceId] = useState('p-jatim');
  const [senderRegencyId, setSenderRegencyId] = useState('r-sby-kota');
  const [senderDistrictId, setSenderDistrictId] = useState('d-sby-genteng');
  const [senderManualDistrict, setSenderManualDistrict] = useState('');
  const [senderStreet, setSenderStreet] = useState('Jl. Pemuda No. 45, Embong Kaliasin, Genteng');

  // Hierarchical Recipient Geo State
  const [recipientProvinceId, setRecipientProvinceId] = useState('p-jatim');
  const [recipientRegencyId, setRecipientRegencyId] = useState('r-mlg-kota');
  const [recipientDistrictId, setRecipientDistrictId] = useState('d-mlg-klojen');
  const [recipientManualDistrict, setRecipientManualDistrict] = useState('');
  const [recipientStreet, setRecipientStreet] = useState('Jl. Ijen No. 25, Klojen');

  // Live KM Distance calculated from Coordinates
  const [calculatedDistanceKm, setCalculatedDistanceKm] = useState(90);

  // State Cek Ongkir (Kalkulator Tarif dengan Pilihan Kecamatan Otomatis Sesuai Kota)
  const [rateOriginRegencyId, setRateOriginRegencyId] = useState('r-sby-kota');
  const [rateOriginDistrictId, setRateOriginDistrictId] = useState('d-sby-genteng');
  const [rateDestRegencyId, setRateDestRegencyId] = useState('r-mlg-kota');
  const [rateDestDistrictId, setRateDestDistrictId] = useState('d-mlg-klojen');

  // State Cek Ongkir
  const [originCity, setOriginCity] = useState('Surabaya');
  const [destCity, setDestCity] = useState('Malang');
  const [weightKg, setWeightKg] = useState<number>(1);
  const [lengthCm, setLengthCm] = useState<number>(20);
  const [widthCm, setWidthCm] = useState<number>(15);
  const [heightCm, setHeightCm] = useState<number>(10);
  const [rateResult, setRateResult] = useState<any>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  // State Kirim Paket (Loket Input Pengiriman & Cetak Label Thermal)
  const [senderName, setSenderName] = useState(currentUser?.fullName || 'Pengirim di Drop Point');
  const [senderPhone, setSenderPhone] = useState(currentUser?.phone || '081288889999');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [packageType, setPackageType] = useState<ExpeditionPackageType>('PARCEL');
  const [itemDescription, setItemDescription] = useState('Pakaian / Dokumen / Barang');
  const [chosenService, setChosenService] = useState<'REGULAR' | 'EXPRESS'>(isExpress ? 'EXPRESS' : 'REGULAR');
  const [createdDelivery, setCreatedDelivery] = useState<ExpeditionDeliveryDetail | null>(null);
  const [createdFare, setCreatedFare] = useState<ExpeditionFareResult | null>(null);
  const [sendingLoading, setSendingLoading] = useState(false);
  const [recentShipments, setRecentShipments] = useState<ExpeditionDeliveryDetail[]>([
    {
      id: 'shp-sample-01',
      orderId: 'ord-sample-01',
      trackingNumber: 'AZC-20260927-8821',
      senderName: 'Toko Elektronik Makmur',
      senderPhone: '081299887766',
      senderAddress: 'ITC Roxy Mas Blok B No. 12, Jakarta Pusat',
      recipientName: 'Ahmad Fadillah',
      recipientPhone: '081377665544',
      recipientAddress: 'Jl. Riau No. 45, RT 02/05, Citarum, Bandung Kulon',
      originCity: 'Jakarta',
      destinationCity: 'Bandung',
      serviceCode: 'REGULAR',
      packageType: 'ELECTRONIC',
      itemDescription: 'Mouse Gaming & Keyboard Mechanical',
      weightKg: 2,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
      chargeableWeightKg: 2,
      totalAmount: 24000,
      createdAt: new Date().toISOString()
    }
  ]);

  const liveVolumetricKg = Math.max(1, Math.ceil((Number(lengthCm || 1) * Number(widthCm || 1) * Number(heightCm || 1)) / 6000));
  const liveChargeableKg = Math.max(Number(weightKg || 1), liveVolumetricKg);

  // State Lacak Resi
  const [searchAwb, setSearchAwb] = useState(initialAwb);
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  // State Simulator Scan Barcode Gudang
  const [scanAwb, setScanAwb] = useState(initialAwb);
  const [scanCity, setScanCity] = useState('Jakarta');
  const [scanTitle, setScanTitle] = useState('Paket Tiba di Sorting Center');
  const [scanDesc, setScanDesc] = useState('Paket sedang dalam proses pemilahan ke jalur truk antar-kota.');
  const [scanSuccess, setScanSuccess] = useState('');

  // Mode Scan Checkpoint: 'scanner' (Kamera / Laser) vs 'manual' (Ketik Manual)
  const [scanInputMode, setScanInputMode] = useState<'scanner' | 'manual'>('scanner');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);
  const [laserFlashed, setLaserFlashed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<any>(null);

  // Audio Beep Feedback (1850Hz classic warehouse barcode scanner tone)
  const playScannerBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1850, ctx.currentTime);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.log('AudioContext beep ignored:', e);
    }
  };

  const handleBarcodeCaptured = (capturedAwb: string, source: string = 'Kamera Scanner') => {
    if (!capturedAwb) return;
    const cleanAwb = capturedAwb.trim().toUpperCase();
    playScannerBeep();
    setLaserFlashed(true);
    setTimeout(() => setLaserFlashed(false), 800);
    setScanAwb(cleanAwb);
    setScanFeedback(`✅ Resi ${cleanAwb} berhasil dipindai via ${source}!`);
    setTimeout(() => setScanFeedback(null), 4000);
  };

  const startCameraScanner = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Browser ini tidak mendukung akses kamera perangkat.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log('Autoplay error', e));
      }
      setIsCameraActive(true);

      // BarcodeDetector real-time polling if browser supports it
      if ('BarcodeDetector' in window) {
        try {
          const detector = new (window as any).BarcodeDetector({
            formats: ['code_128', 'code_39', 'qr_code', 'ean_13', 'ean_8']
          });
          scanIntervalRef.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const detectedVal = barcodes[0].rawValue;
                  if (detectedVal && detectedVal.length > 4) {
                    handleBarcodeCaptured(detectedVal, 'Kamera Real-Time BarcodeDetector');
                  }
                }
              } catch (err) {
                // ignore frame read error
              }
            }
          }, 350);
        } catch (e) {
          console.log('BarcodeDetector initialization ignored:', e);
        }
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || 'Izin kamera ditolak atau kamera tidak ditemukan.');
      setIsCameraActive(false);
    }
  };

  const stopCameraScanner = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Stop camera when switching tabs or unmounting
  useEffect(() => {
    if (subTab !== 'scan' && isCameraActive) {
      stopCameraScanner();
    }
  }, [subTab, isCameraActive]);

  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  const availableResiSamples = [
    ...recentShipments.map(s => ({
      awb: s.trackingNumber,
      info: `${s.recipientName} • ${s.destinationCity} (${s.serviceCode})`
    })),
    { awb: 'AZC-20261010-1582', info: 'Budi Santoso • Malang (Reguler)' },
    { awb: 'AZX-20261010-9921', info: 'Siti Rahmawati • Bandung (Kilat Express)' },
    { awb: 'AZC-20260927-8821', info: 'Ahmad Fadillah • Bandung (Reguler)' }
  ];

  useEffect(() => {
    if (initialAwb) {
      setSearchAwb(initialAwb);
      handleTrack(initialAwb);
    }
  }, [initialAwb]);

  // Load Active Hubs for Pos Scan
  useEffect(() => {
    api.getAdminHubs().then(res => {
      if (res.success && res.data) {
        const activeList = res.data.filter((h: any) => h.isActive !== false);
        setActiveHubs(activeList);
        if (activeList.length > 0) {
          setScanCity(`${activeList[0].name} (${activeList[0].city})`);
        }
      }
    });
  }, []);

  // Ubah Kota Asal pada Kalkulator Tarif -> Otomatis perbarui daftar kecamatan asal
  const handleRateOriginRegencyChange = (regId: string) => {
    setRateOriginRegencyId(regId);
    const dists = getDistrictsByRegency(regId);
    if (dists.length > 0) {
      setRateOriginDistrictId(dists[0].id);
    }
    const reg = INDONESIA_REGENCIES.find(r => r.id === regId);
    if (reg) {
      setOriginCity(reg.name.replace(/^(Kota|Kabupaten)\s+/i, ''));
    }
  };

  // Ubah Kota Tujuan pada Kalkulator Tarif -> Otomatis perbarui daftar kecamatan tujuan
  const handleRateDestRegencyChange = (regId: string) => {
    setRateDestRegencyId(regId);
    const dists = getDistrictsByRegency(regId);
    if (dists.length > 0) {
      setRateDestDistrictId(dists[0].id);
    }
    const reg = INDONESIA_REGENCIES.find(r => r.id === regId);
    if (reg) {
      setDestCity(reg.name.replace(/^(Kota|Kabupaten)\s+/i, ''));
    }
  };

  // Tukar Asal & Tujuan
  const handleSwapRateLocations = () => {
    const tempReg = rateOriginRegencyId;
    const tempDist = rateOriginDistrictId;
    const tempCity = originCity;

    setRateOriginRegencyId(rateDestRegencyId);
    setRateOriginDistrictId(rateDestDistrictId);
    setOriginCity(destCity);

    setRateDestRegencyId(tempReg);
    setRateDestDistrictId(tempDist);
    setDestCity(tempCity);
  };

  // Handler Cek Ongkir (Perhitungan Presisi Berdasarkan Koordinat GPS Antar Kecamatan)
  const handleCheckRate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoadingRate(true);
    try {
      const originReg = INDONESIA_REGENCIES.find(r => r.id === rateOriginRegencyId) || INDONESIA_REGENCIES[0];
      const destReg = INDONESIA_REGENCIES.find(r => r.id === rateDestRegencyId) || INDONESIA_REGENCIES[1];

      const originDist = INDONESIA_DISTRICTS.find(d => d.id === rateOriginDistrictId) || 
                         getDistrictsByRegency(rateOriginRegencyId)[0] || 
                         INDONESIA_DISTRICTS[0];

      const destDist = INDONESIA_DISTRICTS.find(d => d.id === rateDestDistrictId) || 
                       getDistrictsByRegency(rateDestRegencyId)[0] || 
                       INDONESIA_DISTRICTS[1];

      const cleanOrigin = originReg?.name.replace(/^(Kota|Kabupaten)\s+/i, '') || originCity || 'Surabaya';
      const cleanDest = destReg?.name.replace(/^(Kota|Kabupaten)\s+/i, '') || destCity || 'Malang';

      const originLat = originDist?.lat || -7.2617;
      const originLng = originDist?.lng || 112.7486;
      const destLat = destDist?.lat || -7.9786;
      const destLng = destDist?.lng || 112.6317;
      const km = calculateDistanceKm(originLat, originLng, destLat, destLng);

      const volWeight = Number(((Number(lengthCm || 1) * Number(widthCm || 1) * Number(heightCm || 1)) / 6000).toFixed(2));
      const rawWeight = Math.max(Number(weightKg || 1), volWeight);
      const chargeableWeight = Math.max(1.0, Math.ceil(rawWeight));

      // Rumus tarif berjenjang standar logistik profesional
      let baseRatePerKg = 8000;
      let etdDays = '1-2 Hari';

      if (km <= 25) {
        baseRatePerKg = chosenService === 'EXPRESS' ? 12000 : 8000;
        etdDays = chosenService === 'EXPRESS' ? 'Sameday (Tiba Hari Ini)' : '1 Hari Kerja';
      } else if (km <= 100) {
        baseRatePerKg = chosenService === 'EXPRESS' ? 15000 : 10000;
        etdDays = chosenService === 'EXPRESS' ? 'Sameday / Besok Pagi' : '1-2 Hari Kerja';
      } else if (km <= 250) {
        baseRatePerKg = chosenService === 'EXPRESS' ? 20000 : 13000;
        etdDays = chosenService === 'EXPRESS' ? '1 Hari (Kilat)' : '2-3 Hari Kerja';
      } else {
        baseRatePerKg = chosenService === 'EXPRESS' ? 26000 : 16000;
        etdDays = chosenService === 'EXPRESS' ? '1-2 Hari' : '2-4 Hari Kerja';
      }

      let finalShippingFee = chargeableWeight * baseRatePerKg;
      let finalAppFee = 2000;
      let finalTotal = finalShippingFee + finalAppFee;
      let finalEtd = etdDays;

      // Panggil API backend untuk mendapatkan rate resmi database jika tersedia
      try {
        const res = await api.checkExpeditionRate({
          originCity: cleanOrigin,
          destinationCity: cleanDest,
          weightKg: Number(weightKg || 1),
          lengthCm: Number(lengthCm || 20),
          widthCm: Number(widthCm || 15),
          heightCm: Number(heightCm || 10),
          serviceCode: chosenService
        });

        if (res && res.success && res.data) {
          const apiRate = res.data;
          const kmBonus = Math.round(km * (chosenService === 'EXPRESS' ? 100 : 60));
          const adjustedShipping = Math.max(
            apiRate.shippingFee || (chargeableWeight * apiRate.ratePerKg), 
            chargeableWeight * apiRate.ratePerKg + kmBonus
          );
          baseRatePerKg = apiRate.ratePerKg || baseRatePerKg;
          finalShippingFee = adjustedShipping;
          finalAppFee = apiRate.appFee || 2000;
          finalTotal = finalShippingFee + finalAppFee;
          if (apiRate.etdText) {
            finalEtd = apiRate.etdText;
          }
        }
      } catch (apiErr) {
        console.warn('API check-rate fallback to local formula:', apiErr);
      }

      // Pastikan rateResult 100% PASTI TERISI sehingga rincian perhitungan LANGSUNG TAMPIL
      setRateResult({
        originCity: cleanOrigin,
        originRegencyName: originReg?.name || cleanOrigin,
        originDistrictName: originDist?.name || 'Asal',
        originPostalCode: originDist?.postalCode || '',
        destinationCity: cleanDest,
        destRegencyName: destReg?.name || cleanDest,
        districtName: destDist?.name || 'Tujuan',
        destPostalCode: destDist?.postalCode || '',
        actualWeightKg: Number(weightKg || 1),
        volumetricWeightKg: volWeight,
        chargeableWeightKg: chargeableWeight,
        distanceKm: km,
        ratePerKg: baseRatePerKg,
        shippingFee: finalShippingFee,
        appFee: finalAppFee,
        totalAmount: finalTotal,
        serviceCode: chosenService,
        etdText: `${finalEtd} (Jarak ~${km} KM GPS)`
      });
    } catch (err) {
      console.error('Error in handleCheckRate:', err);
    } finally {
      setLoadingRate(false);
    }
  };

  // Lanjut Kirim Paket dari hasil cek tarif (Otomatis mengisi data pengirim & penerima)
  const handleProceedToSendWithRate = () => {
    const originReg = INDONESIA_REGENCIES.find(r => r.id === rateOriginRegencyId);
    if (originReg) {
      setSenderProvinceId(originReg.provinceId);
      setSenderRegencyId(originReg.id);
      setSenderDistrictId(rateOriginDistrictId);
    }
    const destReg = INDONESIA_REGENCIES.find(r => r.id === rateDestRegencyId);
    if (destReg) {
      setRecipientProvinceId(destReg.provinceId);
      setRecipientRegencyId(destReg.id);
      setRecipientDistrictId(rateDestDistrictId);
    }
    setSubTab('send');
  };

  // Jalankan perhitungan tarif awal secara otomatis
  useEffect(() => {
    if (!rateResult) {
      handleCheckRate();
    }
  }, []);

  // Handler Kirim Paket (Input Data Pengiriman Baru dengan Hierarki Wilayah)
  const handleProceedShipment = async (userToUse = currentUser) => {
    if (!recipientName || !recipientPhone) return;
    setSendingLoading(true);
    try {
      const senderReg = INDONESIA_REGENCIES.find(r => r.id === senderRegencyId);
      const senderProv = INDONESIA_PROVINCES.find(p => p.id === senderProvinceId);
      const recipientReg = INDONESIA_REGENCIES.find(r => r.id === recipientRegencyId);
      const recipientProv = INDONESIA_PROVINCES.find(p => p.id === recipientProvinceId);

      let senderDistName = '';
      let senderPostal = '';
      if (senderDistrictId === 'manual_sender') {
        senderDistName = senderManualDistrict || 'Kecamatan Asal';
        senderPostal = '60000';
      } else {
        const senderDist = INDONESIA_DISTRICTS.find(d => d.id === senderDistrictId) || INDONESIA_DISTRICTS[0];
        senderDistName = senderDist?.name || 'Kecamatan Asal';
        senderPostal = senderDist?.postalCode || '60000';
      }

      let recipientDistName = '';
      let recipientPostal = '';
      if (recipientDistrictId === 'manual_recipient') {
        recipientDistName = recipientManualDistrict || 'Kecamatan Tujuan';
        recipientPostal = '65000';
      } else {
        const recipientDist = INDONESIA_DISTRICTS.find(d => d.id === recipientDistrictId) || INDONESIA_DISTRICTS.find(d => d.id === 'd-mlg-klojen') || INDONESIA_DISTRICTS[0];
        recipientDistName = recipientDist?.name || 'Kecamatan Tujuan';
        recipientPostal = recipientDist?.postalCode || '65000';
      }

      const fullSender = `${senderStreet}, Kec. ${senderDistName}, ${senderReg?.name || ''}, ${senderProv?.name || ''} (Kode Pos: ${senderPostal})`;
      const fullRecipient = `${recipientStreet}, Kec. ${recipientDistName}, ${recipientReg?.name || ''}, ${recipientProv?.name || ''} (Kode Pos: ${recipientPostal})`;

      const cleanOrigin = senderReg?.name?.replace(/^(Kota|Kabupaten)\s+/i, '') || originCity;
      const cleanDest = recipientReg?.name?.replace(/^(Kota|Kabupaten)\s+/i, '') || destCity;

      const res = await api.createExpeditionShipment({
        senderName: senderName || userToUse?.fullName || 'Pengirim AZ GO',
        senderPhone: senderPhone || userToUse?.phone || '081200000000',
        senderAddress: fullSender,
        recipientName,
        recipientPhone,
        recipientAddress: fullRecipient,
        packageType,
        itemDescription,
        serviceCode: chosenService,
        originCity: cleanOrigin,
        destinationCity: cleanDest,
        weightKg,
        lengthCm,
        widthCm,
        heightCm
      });
      if (res.success && res.data?.delivery) {
        setCreatedDelivery(res.data.delivery);
        setCreatedFare(res.data.fare);
        setSearchAwb(res.data.delivery.trackingNumber);
        setScanAwb(res.data.delivery.trackingNumber);
        setRecentShipments(prev => [res.data.delivery, ...prev.filter(x => x.trackingNumber !== res.data.delivery.trackingNumber)]);

        const custOrder: CustomerOrder = {
          orderNumber: res.data.delivery.trackingNumber,
          serviceType: 'EXPEDITION',
          serviceName: `Az Courier — Kirim Paket (${chosenService === 'EXPRESS' ? 'Kilat Express' : 'Reguler'})`,
          pickupAddress: fullSender,
          dropoffAddress: fullRecipient,
          items: [
            { name: `${itemDescription} (${packageType})`, quantity: 1, price: res.data.fare?.totalAmount || 0 }
          ],
          totalAmount: res.data.fare?.totalAmount || 0,
          paymentMethod: 'Tunai di Drop Point / Bayar di Tempat',
          distanceKm: calculatedDistanceKm || 90,
          customerName: userToUse?.fullName || senderName,
          customerPhone: userToUse?.phone || senderPhone,
          createdAt: new Date().toISOString(),
          status: 'PREPARING',
          driverInfo: {
            name: 'Agus Santoso (Kurir Drop Point)',
            phone: '081298765432',
            vehicleType: 'MOTOR',
            vehiclePlate: 'L 5821 AZ (Kurir Ekspedisi)',
            rating: 4.9,
            currentLocation: { lat: -7.260, lng: 112.740 },
            etaMinutes: 25
          }
        };
        setLastPlacedCustomerOrder(custOrder);
        if (onOrderCreated) {
          onOrderCreated(custOrder);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingLoading(false);
    }
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !recipientPhone) return;
    if (!isHubPortal && !currentUser) {
      if (onRequestLogin) {
        onRequestLogin(
          'Silakan masuk atau daftar akun pelanggan terlebih dahulu untuk membuat pesanan pengiriman paket ini.',
          () => handleProceedShipment()
        );
      }
      return;
    }
    handleProceedShipment();
  };

  const handleResetShipmentForm = () => {
    setCreatedDelivery(null);
    setCreatedFare(null);
    setRecipientName('');
    setRecipientPhone('');
    setRecipientStreet('');
    setItemDescription('Pakaian / Dokumen / Barang');
  };

  // Handler Lacak Resi
  const handleTrack = async (awbToTrack?: string) => {
    const awb = awbToTrack || searchAwb;
    if (!awb) return;
    setTrackingLoading(true);
    setTrackError('');
    try {
      const res = await api.trackAWB(awb);
      if (res.success) {
        setTrackResult(res.data);
      } else {
        setTrackError(res.message || 'Resi tidak ditemukan di sistem AZ GO');
        setTrackResult(null);
      }
    } catch (err) {
      setTrackError('Gagal menghubungi server pelacakan');
      setTrackResult(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  // Handler Scan Barcode Staff Gudang
  const handleScanCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanAwb) return;
    try {
      const res = await api.addScanCheckpoint({
        trackingNumber: scanAwb,
        city: scanCity,
        checkpointTitle: scanTitle,
        description: scanDesc
      });
      if (res.success) {
        setScanSuccess(`✅ Checkpoint baru berhasil di-scan untuk resi ${scanAwb}`);
        if (searchAwb === scanAwb) {
          handleTrack(scanAwb);
        }
        setTimeout(() => setScanSuccess(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Layanan
        </button>
      )}

      {/* Header Banner */}
      <div className={`rounded-3xl p-6 text-white shadow-lg ${
        isHubPortal
          ? 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-2 border-blue-500/30'
          : isExpress
          ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500'
          : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-md mb-2">
              {isHubPortal ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-amber-300" />
                  🏢 Portal Operasional Drop Point & Hub AZ GO
                </>
              ) : isExpress ? (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  🚚 Az Express — Pengiriman Cepat Prioritas
                </>
              ) : (
                <>
                  <Package className="w-3.5 h-3.5" />
                  📦 Az Courier — Kirim Paket & Dokumen
                </>
              )}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {isHubPortal
                ? 'Loket Input Pengiriman & Cetak Label Resi Thermal'
                : isExpress
                ? 'Kirim Cepat Hari Ini Sampai (Sameday)'
                : 'Ekspedisi Reguler & Surat Berharga'}
            </h2>
            <p className="text-white/80 text-xs mt-1">
              {isHubPortal
                ? `Petugas: ${currentUser?.fullName || 'Staff Hub'} • Input data kiriman pelanggan & cetak label waybill thermal barcode 100x150mm.`
                : 'Didukung rumus volumetrik logistik ($P \\times L \\times T / 6000$), penomoran resi unik, dan pelacakan universal.'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSubTab('send')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                subTab === 'send' ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              {isHubPortal ? 'Loket & Cetak Label' : 'Kirim Paket'}
            </button>
            <button
              onClick={() => setSubTab('scan')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                subTab === 'scan' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              {isHubPortal ? 'Pos Scan Checkpoint' : 'Pos Gudang'}
            </button>
            <button
              onClick={() => setSubTab('track')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subTab === 'track' ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Lacak Resi
            </button>
            <button
              onClick={() => setSubTab('rate')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subTab === 'rate' ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Cek Tarif
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: CEK ONGKIR */}
      {subTab === 'rate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Kalkulator Tarif {chosenService === 'EXPRESS' ? 'Az Express (Kilat)' : 'Az Courier (Reguler)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilihan kecamatan terisi otomatis sesuai kota/kabupaten yang dipilih.
                  </p>
                </div>
              </div>

              {/* Pilihan Layanan Reguler vs Kilat Express */}
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setChosenService('REGULAR')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    chosenService === 'REGULAR'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📦 Az Courier (Reguler)
                </button>
                <button
                  type="button"
                  onClick={() => setChosenService('EXPRESS')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    chosenService === 'EXPRESS'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ⚡ Az Express (Kilat)
                </button>
              </div>
            </div>

            <form onSubmit={handleCheckRate} className="space-y-4">
              {/* Grid 2 Kolom: Lokasi Asal & Lokasi Tujuan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. LOKASI ASAL */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wide">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span>Kota & Kecamatan Asal (Origin)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kota / Kabupaten Asal
                    </label>
                    <select
                      value={rateOriginRegencyId}
                      onChange={e => handleRateOriginRegencyChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-rose-500 bg-white"
                    >
                      <optgroup label="Jawa Timur (Lengkap 38 Kota & Kabupaten)">
                        {getRegenciesByProvince('p-jatim').map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Provinsi Lainnya">
                        {INDONESIA_REGENCIES.filter(r => r.provinceId !== 'p-jatim').map(r => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({INDONESIA_PROVINCES.find(p => p.id === r.provinceId)?.name || ''})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Kecamatan Asal <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-blue-700 font-bold bg-blue-100/70 px-2 py-0.5 rounded-full">
                        Otomatis Sesuai Kota
                      </span>
                    </div>
                    <select
                      value={rateOriginDistrictId}
                      onChange={e => setRateOriginDistrictId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-blue-900 focus:outline-blue-500 bg-white"
                    >
                      {getDistrictsByRegency(rateOriginRegencyId).map(d => (
                        <option key={d.id} value={d.id}>
                          Kec. {d.name} (Kode Pos: {d.postalCode})
                        </option>
                      ))}
                    </select>

                    {/* Selected badge info */}
                    {(() => {
                      const curDist = INDONESIA_DISTRICTS.find(d => d.id === rateOriginDistrictId) || getDistrictsByRegency(rateOriginRegencyId)[0];
                      const curReg = INDONESIA_REGENCIES.find(r => r.id === rateOriginRegencyId);
                      return curDist ? (
                        <div className="mt-1.5 p-2 bg-blue-50/70 rounded-xl border border-blue-200/80 text-[11px] text-blue-900 flex items-center justify-between">
                          <span>📍 Asal: <strong>Kec. {curDist.name}</strong>, {curReg?.name}</span>
                          <span className="font-mono text-[10px] font-bold text-blue-700">Kode Pos: {curDist.postalCode}</span>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* 2. LOKASI TUJUAN */}
                <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-rose-900 uppercase tracking-wide">
                      <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span>Kota & Kecamatan Tujuan (Destination)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kota / Kabupaten Tujuan
                    </label>
                    <select
                      value={rateDestRegencyId}
                      onChange={e => handleRateDestRegencyChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-rose-500 bg-white"
                    >
                      <optgroup label="Jawa Timur (Lengkap 38 Kota & Kabupaten)">
                        {getRegenciesByProvince('p-jatim').map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Provinsi Lainnya">
                        {INDONESIA_REGENCIES.filter(r => r.provinceId !== 'p-jatim').map(r => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({INDONESIA_PROVINCES.find(p => p.id === r.provinceId)?.name || ''})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Kecamatan Tujuan <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-rose-700 font-bold bg-rose-100/70 px-2 py-0.5 rounded-full">
                        Otomatis Sesuai Kota
                      </span>
                    </div>
                    <select
                      value={rateDestDistrictId}
                      onChange={e => setRateDestDistrictId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-rose-900 focus:outline-rose-500 bg-white"
                    >
                      {getDistrictsByRegency(rateDestRegencyId).map(d => (
                        <option key={d.id} value={d.id}>
                          Kec. {d.name} (Kode Pos: {d.postalCode})
                        </option>
                      ))}
                    </select>

                    {/* Selected badge info */}
                    {(() => {
                      const curDist = INDONESIA_DISTRICTS.find(d => d.id === rateDestDistrictId) || getDistrictsByRegency(rateDestRegencyId)[0];
                      const curReg = INDONESIA_REGENCIES.find(r => r.id === rateDestRegencyId);
                      return curDist ? (
                        <div className="mt-1.5 p-2 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900 flex items-center justify-between">
                          <span>📍 Tujuan: <strong>Kec. {curDist.name}</strong>, {curReg?.name}</span>
                          <span className="font-mono text-[10px] font-bold text-rose-700">Kode Pos: {curDist.postalCode}</span>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>

              </div>

              {/* Tombol Tukar Asal & Tujuan */}
              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={handleSwapRateLocations}
                  className="px-3.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  title="Tukar Posisi Asal dan Tujuan"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tukar Asal ⇄ Tujuan</span>
                </button>
              </div>

              {/* Berat & Dimensi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-slate-500" />
                    <span>Berat Timbangan Aktual (Kg)</span>
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={weightKg}
                    onChange={e => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-rose-500 bg-white"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Minimal 0.1 Kg (dibulatkan ke atas per Kg)</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Dimensi Paket (P × L × T cm)</span>
                    <span className="text-[10px] text-slate-500 font-mono">Volumetrik / 6000</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Panjang</span>
                      <input
                        type="number"
                        min="1"
                        value={lengthCm}
                        onChange={e => setLengthCm(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold mt-0.5 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Lebar</span>
                      <input
                        type="number"
                        min="1"
                        value={widthCm}
                        onChange={e => setWidthCm(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold mt-0.5 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Tinggi</span>
                      <input
                        type="number"
                        min="1"
                        value={heightCm}
                        onChange={e => setHeightCm(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold mt-0.5 bg-white"
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-200">
                    <span>Volumetrik: <strong>{liveVolumetricKg} Kg</strong></span>
                    <span>Chargeable: <strong className="text-rose-600">{liveChargeableKg} Kg</strong></span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingRate}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-rose-600/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {loadingRate ? (
                  <span>Menghitung Biaya Pengiriman...</span>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 text-white" />
                    <span>Cek Biaya Pengiriman</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Rincian Perhitungan Tarif */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-600" />
                  Rincian Perhitungan Tarif
                </h4>
                {rateResult && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✓ Terkalkulasi
                  </span>
                )}
              </div>

              {rateResult ? (
                <div className="space-y-4">
                  {/* Total Card */}
                  <div className="p-4 bg-gradient-to-br from-rose-50 via-red-50 to-orange-50 border border-rose-200/80 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-rose-700 font-extrabold uppercase tracking-wider">
                        {rateResult.serviceCode === 'EXPRESS' ? 'Az Express (Kilat / Sameday)' : 'Az Courier (Reguler)'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md shadow-xs">
                        ~{rateResult.distanceKm} KM GPS
                      </span>
                    </div>
                    <p className="text-3xl font-black text-rose-600">
                      Rp {rateResult.totalAmount.toLocaleString('id-ID')}
                    </p>
                    <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-2 bg-white/80 p-2 rounded-xl border border-rose-100">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-bold text-slate-800">{rateResult.etdText}</span>
                    </div>
                  </div>

                  {/* Rute Visual */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Rute Ekspedisi</span>
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                      <div>
                        <span className="text-[11px] text-slate-500 block">Asal:</span>
                        <p className="font-bold text-slate-900 leading-tight">
                          Kec. {rateResult.originDistrictName}, {rateResult.originRegencyName}
                        </p>
                        {rateResult.originPostalCode && (
                          <span className="text-[10px] text-slate-500 font-mono">Kode Pos: {rateResult.originPostalCode}</span>
                        )}
                      </div>
                    </div>
                    <div className="border-l-2 border-dashed border-slate-300 ml-1.25 h-3" />
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-600 mt-1 shrink-0" />
                      <div>
                        <span className="text-[11px] text-slate-500 block">Tujuan:</span>
                        <p className="font-bold text-slate-900 leading-tight">
                          Kec. {rateResult.districtName}, {rateResult.destRegencyName}
                        </p>
                        {rateResult.destPostalCode && (
                          <span className="text-[10px] text-slate-500 font-mono">Kode Pos: {rateResult.destPostalCode}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rincian Angka */}
                  <div className="text-xs space-y-2 text-slate-600 pt-1">
                    <div className="flex justify-between">
                      <span>Berat Aktual Timbangan:</span>
                      <span className="font-semibold text-slate-800">{rateResult.actualWeightKg} Kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Berat Volumetrik ({lengthCm}×{widthCm}×{heightCm}cm):</span>
                      <span className="font-semibold text-slate-800">{rateResult.volumetricWeightKg} Kg</span>
                    </div>
                    <div className="flex justify-between text-rose-700 font-bold bg-rose-50/60 p-1.5 rounded-lg border border-rose-100">
                      <span>Berat Tagihan (Chargeable):</span>
                      <span>{rateResult.chargeableWeightKg} Kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarif Dasar per Kg:</span>
                      <span className="font-semibold text-slate-800">Rp {rateResult.ratePerKg.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ongkos Kirim Paket:</span>
                      <span className="font-semibold text-slate-800">Rp {rateResult.shippingFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Layanan & Asuransi:</span>
                      <span className="font-semibold text-slate-800">Rp {rateResult.appFee.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Package className="w-12 h-12 mx-auto stroke-1 opacity-50" />
                  <p className="text-xs font-medium">
                    Pilih kota dan kecamatan di sebelah kiri, lalu klik <strong>Cek Biaya Pengiriman</strong>.
                  </p>
                </div>
              )}
            </div>

            {rateResult && (
              <button
                type="button"
                onClick={handleProceedToSendWithRate}
                className="mt-5 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Lanjut Kirim Paket Ini</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: LOKET INPUT PENGIRIMAN & CETAK LABEL THERMAL BARCODE */}
      {subTab === 'send' && (
        <div className="space-y-8">
          {createdDelivery ? (
            <div className="space-y-4">
              <div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl print:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-emerald-950 text-sm">Resi AWB Resmi Berhasil Diterbitkan!</h4>
                    <p className="text-xs text-emerald-700">Nomor Resi: <span className="font-mono font-bold text-slate-900">{createdDelivery.trackingNumber}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {lastPlacedCustomerOrder && onTrackOrder && (
                    <button
                      onClick={() => onTrackOrder(lastPlacedCustomerOrder)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Lacak Live GPS
                    </button>
                  )}
                  <button
                    onClick={handleResetShipmentForm}
                    className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    + Input Baru
                  </button>
                </div>
              </div>

              {/* Komponen Label Thermal & Barcode */}
              <ShippingLabel
                delivery={createdDelivery}
                fare={createdFare}
                operatorName={currentUser?.fullName || 'Petugas Hub AZ GO'}
                onTrack={(awb) => {
                  setSubTab('track');
                  setSearchAwb(awb);
                  handleTrack(awb);
                }}
                onNewShipment={handleResetShipmentForm}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Form Input Petugas */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                      <Printer className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">
                        {isHubPortal ? 'Loket Penerimaan Paket & Cetak Waybill Thermal' : 'Kirim Paket & Cetak Label'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Input data pengirim, penerima, dan ukuran paket. Sistem otomatis membuat barcode Code-128 dan nomor resi resmi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl">
                      🏢 Drop Point: {originCity}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleCreateShipment} className="space-y-6">
                  {/* Grid 2 Kolom: Pengirim & Penerima */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Pengirim */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider pb-1 border-b border-slate-200">
                        <MapPin className="w-4 h-4 text-blue-600" /> Data Pengirim (Origin)
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pengirim</label>
                        <input
                          type="text"
                          required
                          value={senderName}
                          onChange={e => setSenderName(e.target.value)}
                          placeholder="Nama Pengirim / Toko"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Pengirim</label>
                        <input
                          type="tel"
                          required
                          value={senderPhone}
                          onChange={e => setSenderPhone(e.target.value)}
                          placeholder="08123456789"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                        />
                      </div>

                      {/* Hierarki Wilayah Pengirim: Provinsi -> Kota/Kab -> Kecamatan */}
                      <div className="space-y-2 pt-1 border-t border-slate-200">
                        <span className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wide block">
                          Hierarki Wilayah Asal
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">1. Provinsi</label>
                            <select
                              value={senderProvinceId}
                              onChange={e => {
                                const newProv = e.target.value;
                                setSenderProvinceId(newProv);
                                const regs = getRegenciesByProvince(newProv);
                                if (regs.length > 0) {
                                  setSenderRegencyId(regs[0].id);
                                  const dists = getDistrictsByRegency(regs[0].id);
                                  if (dists.length > 0) setSenderDistrictId(dists[0].id);
                                }
                              }}
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:outline-rose-500 font-medium"
                            >
                              {INDONESIA_PROVINCES.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">2. Kota / Kab</label>
                            <select
                              value={senderRegencyId}
                              onChange={e => {
                                const newReg = e.target.value;
                                setSenderRegencyId(newReg);
                                const dists = getDistrictsByRegency(newReg);
                                if (dists.length > 0) setSenderDistrictId(dists[0].id);
                              }}
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:outline-rose-500 font-medium"
                            >
                              {getRegenciesByProvince(senderProvinceId).map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">3. Kecamatan</label>
                            <select
                              value={senderDistrictId}
                              onChange={e => setSenderDistrictId(e.target.value)}
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:outline-rose-500 font-bold text-blue-700"
                            >
                              {getDistrictsByRegency(senderRegencyId).map(d => (
                                <option key={d.id} value={d.id}>Kec. {d.name} ({d.postalCode})</option>
                              ))}
                              <option value="manual_sender">+ Ketik Kecamatan Lainnya...</option>
                            </select>
                            {senderDistrictId === 'manual_sender' && (
                              <input
                                type="text"
                                required
                                placeholder="Ketik nama kecamatan..."
                                value={senderManualDistrict}
                                onChange={e => setSenderManualDistrict(e.target.value)}
                                className="mt-1.5 w-full px-2 py-1 bg-white border border-blue-400 rounded-md text-xs font-semibold text-blue-900 focus:outline-blue-600"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama Jalan, Gedung, Nomor & RT/RW
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={senderStreet}
                          onChange={e => setSenderStreet(e.target.value)}
                          placeholder="Nama jalan, nomor rumah, RT/RW, nama toko atau patokan..."
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-rose-500"
                        />
                      </div>
                    </div>

                    {/* 2. Penerima */}
                    <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-rose-900 uppercase tracking-wider pb-1 border-b border-rose-200">
                        <MapPin className="w-4 h-4 text-rose-600" /> Data Penerima (Destination)
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penerima <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={e => setRecipientName(e.target.value)}
                          placeholder="Contoh: Budi Santoso"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Penerima <span className="text-rose-500">*</span></label>
                        <input
                          type="tel"
                          required
                          value={recipientPhone}
                          onChange={e => setRecipientPhone(e.target.value)}
                          placeholder="Contoh: 081398765432"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:outline-rose-500"
                        />
                      </div>

                      {/* Hierarki Wilayah Penerima: Provinsi -> Kota/Kab -> Kecamatan */}
                      <div className="space-y-2 pt-1 border-t border-rose-200">
                        <span className="text-[11px] font-extrabold text-rose-800 uppercase tracking-wide block">
                          Hierarki Wilayah Tujuan
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">1. Provinsi</label>
                            <select
                              value={recipientProvinceId}
                              onChange={e => {
                                const newProv = e.target.value;
                                setRecipientProvinceId(newProv);
                                const regs = getRegenciesByProvince(newProv);
                                if (regs.length > 0) {
                                  setRecipientRegencyId(regs[0].id);
                                  const dists = getDistrictsByRegency(regs[0].id);
                                  if (dists.length > 0) setRecipientDistrictId(dists[0].id);
                                }
                              }}
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:outline-rose-500 font-medium"
                            >
                              {INDONESIA_PROVINCES.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">2. Kota / Kab</label>
                            <select
                              value={recipientRegencyId}
                              onChange={e => {
                                const newReg = e.target.value;
                                setRecipientRegencyId(newReg);
                                const dists = getDistrictsByRegency(newReg);
                                if (dists.length > 0) setRecipientDistrictId(dists[0].id);
                              }}
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:outline-rose-500 font-medium"
                            >
                              {getRegenciesByProvince(recipientProvinceId).map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">3. Kecamatan</label>
                            <select
                              value={recipientDistrictId}
                              onChange={e => setRecipientDistrictId(e.target.value)}
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:outline-rose-500 font-bold text-rose-700"
                            >
                              {getDistrictsByRegency(recipientRegencyId).map(d => (
                                <option key={d.id} value={d.id}>Kec. {d.name} ({d.postalCode})</option>
                              ))}
                              <option value="manual_recipient">+ Ketik Kecamatan Lainnya...</option>
                            </select>
                            {recipientDistrictId === 'manual_recipient' && (
                              <input
                                type="text"
                                required
                                placeholder="Ketik nama kecamatan..."
                                value={recipientManualDistrict}
                                onChange={e => setRecipientManualDistrict(e.target.value)}
                                className="mt-1.5 w-full px-2 py-1 bg-white border border-rose-400 rounded-md text-xs font-semibold text-rose-900 focus:outline-rose-600"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama Jalan, Nomor Rumah & RT/RW <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={recipientStreet}
                          onChange={e => setRecipientStreet(e.target.value)}
                          placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan..."
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* KONEKSI GOOGLE MAPS — KOORDINAT GPS DAN RUTE PRESISI */}
                  <div className="pt-2">
                    <GoogleMapPinpoint
                      title="Koneksi Google Maps — Rute & Jarak Presisi Ekspedisi"
                      origin={{
                        lat: (INDONESIA_DISTRICTS.find(d => d.id === senderDistrictId) || INDONESIA_DISTRICTS.find(d => d.regencyId === senderRegencyId) || INDONESIA_DISTRICTS[0]).lat,
                        lng: (INDONESIA_DISTRICTS.find(d => d.id === senderDistrictId) || INDONESIA_DISTRICTS.find(d => d.regencyId === senderRegencyId) || INDONESIA_DISTRICTS[0]).lng,
                        address: `${senderStreet}, Kec. ${senderDistrictId === 'manual_sender' ? (senderManualDistrict || 'Kecamatan Asal') : (INDONESIA_DISTRICTS.find(d => d.id === senderDistrictId) || INDONESIA_DISTRICTS[0]).name}`
                      }}
                      destination={{
                        lat: (INDONESIA_DISTRICTS.find(d => d.id === recipientDistrictId) || INDONESIA_DISTRICTS.find(d => d.regencyId === recipientRegencyId) || INDONESIA_DISTRICTS.find(d => d.id === 'd-mlg-klojen') || INDONESIA_DISTRICTS[0]).lat,
                        lng: (INDONESIA_DISTRICTS.find(d => d.id === recipientDistrictId) || INDONESIA_DISTRICTS.find(d => d.regencyId === recipientRegencyId) || INDONESIA_DISTRICTS.find(d => d.id === 'd-mlg-klojen') || INDONESIA_DISTRICTS[0]).lng,
                        address: `${recipientStreet}, Kec. ${recipientDistrictId === 'manual_recipient' ? (recipientManualDistrict || 'Kecamatan Tujuan') : (INDONESIA_DISTRICTS.find(d => d.id === recipientDistrictId) || INDONESIA_DISTRICTS.find(d => d.id === 'd-mlg-klojen') || INDONESIA_DISTRICTS[0]).name}`
                      }}
                      onDistanceCalculated={(km) => setCalculatedDistanceKm(km)}
                    />
                    <div className="mt-2.5 flex items-center justify-between text-xs bg-blue-50/80 text-blue-900 px-3.5 py-2 rounded-xl border border-blue-200">
                      <span className="font-semibold">Perhitungan Jarak Rute Ekspedisi (Google Maps):</span>
                      <span className="font-black text-blue-800 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 shadow-xs">
                        {calculatedDistanceKm} KM
                      </span>
                    </div>
                  </div>

                  {/* 3. Detail Barang & Dimensi Volumetrik */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider pb-1 border-b border-slate-200">
                      <Package className="w-4 h-4 text-amber-600" /> Detail Paket & Dimensi Volumetrik
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Barang</label>
                        <select
                          value={packageType}
                          onChange={e => setPackageType(e.target.value as ExpeditionPackageType)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm"
                        >
                          <option value="PARCEL">📦 Paket Standar</option>
                          <option value="DOCUMENT">📄 Dokumen / Surat</option>
                          <option value="ELECTRONIC">💻 Elektronik</option>
                          <option value="FRAGILE">🍷 Pecah Belah (Fragile)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Layanan Ekspedisi</label>
                        <select
                          value={chosenService}
                          onChange={e => setChosenService(e.target.value as 'REGULAR' | 'EXPRESS')}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm font-bold text-rose-600"
                        >
                          <option value="REGULAR">Az Courier (Reguler 1-3 Hari)</option>
                          <option value="EXPRESS">Az Express (Kilat Prioritas Sameday/Nextday)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Isi Kiriman</label>
                        <input
                          type="text"
                          value={itemDescription}
                          onChange={e => setItemDescription(e.target.value)}
                          placeholder="Pakaian, buku, suku cadang..."
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm"
                        />
                      </div>
                    </div>

                    {/* Dimensi & Berat */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Berat Timbang (Kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={weightKg}
                          onChange={e => setWeightKg(parseFloat(e.target.value) || 0.1)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Panjang (cm)</label>
                        <input
                          type="number"
                          min="1"
                          value={lengthCm}
                          onChange={e => setLengthCm(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Lebar (cm)</label>
                        <input
                          type="number"
                          min="1"
                          value={widthCm}
                          onChange={e => setWidthCm(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tinggi (cm)</label>
                        <input
                          type="number"
                          min="1"
                          value={heightCm}
                          onChange={e => setHeightCm(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-sm font-bold"
                        />
                      </div>
                    </div>

                    {/* Box Live Volumetrik & Biaya */}
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-amber-900 block">Kalkulasi Otomatis Sistem Asperindo/IATA:</span>
                        <p className="text-amber-800">
                          Berat Volumetrik: <strong>{liveVolumetricKg} Kg</strong> ({lengthCm}×{widthCm}×{heightCm} / 6000) • Berat Timbang: <strong>{weightKg} Kg</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-500 block text-[10px]">Berat Dikenakan Biaya (Chargeable):</span>
                        <div className="font-mono text-base font-black text-rose-600">
                          {liveChargeableKg} Kg
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">
                          Estimasi: Rp {(liveChargeableKg * (chosenService === 'EXPRESS' ? 18000 : 12000)).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingLoading}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm shadow-lg transition flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    {!isHubPortal && !currentUser ? (
                      <Lock className="w-5 h-5 text-amber-300" />
                    ) : (
                      <Printer className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                    )}
                    {sendingLoading 
                      ? 'Menerbitkan Resi & Generate Barcode...' 
                      : (!isHubPortal && !currentUser)
                        ? 'Masuk & Terbitkan Label Pengiriman'
                        : 'Simpan Pengiriman & Terbitkan Label Thermal Barcode'}
                  </button>
                </form>
              </div>

              {/* Riwayat Resi & Label Hari Ini */}
              {recentShipments.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Riwayat Pengiriman Hari Ini (Loket Drop Point)
                    </h4>
                    <span className="text-xs font-bold text-slate-500">
                      {recentShipments.length} Paket Tercatat
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                          <th className="py-2.5 px-3">No. Resi (AWB)</th>
                          <th className="py-2.5 px-3">Penerima & Tujuan</th>
                          <th className="py-2.5 px-3">Layanan & Berat</th>
                          <th className="py-2.5 px-3">Total Biaya</th>
                          <th className="py-2.5 px-3 text-right">Aksi Operator</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {recentShipments.map((shp) => (
                          <tr key={shp.trackingNumber} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-3">
                              <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                                {shp.trackingNumber}
                              </span>
                              <span className="block text-[10px] text-slate-400 mt-0.5">
                                {new Date(shp.createdAt || Date.now()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-900">{shp.recipientName}</span>
                              <span className="block text-slate-500 text-[11px]">Kota {shp.destinationCity}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] ${
                                shp.serviceCode === 'EXPRESS' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {shp.serviceCode}
                              </span>
                              <span className="block text-slate-600 mt-0.5 font-mono">{shp.chargeableWeightKg} Kg</span>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-900">
                              Rp {(shp.totalAmount || 0).toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-3 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setCreatedDelivery(shp);
                                  setCreatedFare(null);
                                }}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-sm transition"
                              >
                                <Printer className="w-3 h-3 text-amber-400" /> Cetak Label
                              </button>
                              <button
                                onClick={() => {
                                  setSubTab('track');
                                  setSearchAwb(shp.trackingNumber);
                                  handleTrack(shp.trackingNumber);
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition"
                              >
                                <Search className="w-3 h-3" /> Lacak
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: LACAK RESI (UNIVERSAL TRACKING) */}
      {subTab === 'track' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-1">
              <Search className="w-5 h-5 text-rose-600" />
              Universal Tracking AZ GO
            </h3>
            <p className="text-xs text-slate-500">Lacak nomor resi dari Az Courier, Az Express, atau Az Cargo.</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan nomor resi (AZC / AZX / AZK)..."
              value={searchAwb}
              onChange={e => setSearchAwb(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm uppercase font-mono tracking-wider focus:outline-rose-500"
            />
            <button
              onClick={() => handleTrack()}
              disabled={trackingLoading}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              {trackingLoading ? 'Melacak...' : 'Lacak Resi'}
            </button>
          </div>

          {trackError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {trackError}
            </div>
          )}

          {trackResult && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              {trackResult.delivery && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500">Penerima:</span>
                    <p className="font-bold text-slate-900 text-sm">{trackResult.delivery.recipientName}</p>
                    <span className="text-slate-400">{trackResult.delivery.recipientPhone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Berat Hitung:</span>
                    <p className="font-bold text-slate-900">{trackResult.delivery.chargeableWeightKg} Kg</p>
                    <span className="text-rose-600 font-bold">{trackResult.delivery.packageType}</span>
                  </div>
                </div>
              )}

              {/* Timeline Pos Checkpoint */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Riwayat Checkpoint Perjalanan:</h4>
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-rose-200">
                  {trackResult.checkpoints.map((cp: any, idx: number) => (
                    <div key={cp.id} className="relative group">
                      <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${
                        idx === 0 ? 'bg-rose-600 border-white ring-2 ring-rose-600' : 'bg-white border-rose-400'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${idx === 0 ? 'text-rose-700' : 'text-slate-800'}`}>
                            {cp.checkpointTitle}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(cp.scannedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{cp.description}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {cp.city}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: SIMULATOR SCAN GUDANG (STAFF HUB ONLY) */}
      {subTab === 'scan' && !currentUser && (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Akses Dibatasi: Pos Gudang & Hub</h3>
            <p className="text-xs text-slate-500 mt-1">
              Menu Pos Gudang hanya dapat diakses oleh Staff Operator Hub / Drop Point atau Administrator AZ GO.
            </p>
          </div>
          <button
            onClick={() => onRequestLogin && onRequestLogin('Silakan login sebagai Staff Operator Hub atau Admin untuk memproses scan barcode.')}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition"
          >
            Login Sebagai Staff Hub / Admin
          </button>
        </div>
      )}

      {subTab === 'scan' && currentUser && currentUser.role !== 'HUB_STAFF' && currentUser.role !== 'ADMIN' && (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Hak Akses Tidak Sesuai</h3>
            <p className="text-xs text-slate-500 mt-1">
              Akun Anda saat ini ({currentUser.fullName} - {currentUser.role}) tidak memiliki izin mengakses Pos Gudang.
            </p>
          </div>
          <button
            onClick={() => onRequestLogin && onRequestLogin('Silakan login sebagai Staff Operator Hub untuk memproses scan barcode.')}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition"
          >
            Ganti Akun ke Staff Hub
          </button>
        </div>
      )}

      {subTab === 'scan' && currentUser && (currentUser.role === 'HUB_STAFF' || currentUser.role === 'ADMIN') && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-xl text-amber-800">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Portal Operator Drop Point / Hub AZ GO</h3>
                <p className="text-xs text-slate-500">Scan barcode resi untuk memperbarui status perjalanan paket.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl">
                {currentUser.fullName}
              </span>
              {onChangePassword && (
                <button
                  onClick={onChangePassword}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                >
                  <KeyRound className="w-3 h-3 text-amber-600" /> Sandi
                </button>
              )}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                >
                  <LogOut className="w-3 h-3" /> Keluar
                </button>
              )}
            </div>
          </div>

          {scanSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium">
              {scanSuccess}
            </div>
          )}

          {scanFeedback && (
            <div className="p-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-between shadow-md animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>{scanFeedback}</span>
              </div>
              <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md font-mono">BEEP!</span>
            </div>
          )}

          <style>{`
            @keyframes scanBeam {
              0% { top: 10%; opacity: 0.8; }
              50% { top: 90%; opacity: 1; }
              100% { top: 10%; opacity: 0.8; }
            }
            .laser-scan-line {
              animation: scanBeam 2s ease-in-out infinite;
            }
          `}</style>

          <form onSubmit={handleScanCheckpoint} className="space-y-4">
            {/* TOGGLE PILIHAN: SCAN BARCODE (KAMERA/LASER) vs INPUT RESI MANUAL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                  Metode Pengambilan Resi:
                </label>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {scanInputMode === 'scanner' ? 'Mode Scanner Aktif' : 'Mode Ketik Manual'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setScanInputMode('scanner');
                    startCameraScanner();
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    scanInputMode === 'scanner'
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Camera className="w-4 h-4 text-slate-900" />
                  <span>Scan Barcode (Kamera / Laser)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setScanInputMode('manual');
                    stopCameraScanner();
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    scanInputMode === 'manual'
                      ? 'bg-slate-900 text-white shadow-md font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Keyboard className="w-4 h-4" />
                  <span>Input Resi Manual</span>
                </button>
              </div>
            </div>

            {/* OPSI 1: SCANNER BARCODE (KAMERA & LASER RETICLE) */}
            {scanInputMode === 'scanner' && (
              <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 text-white border border-slate-800 space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCameraActive ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${isCameraActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </span>
                    <span className="font-extrabold text-xs text-slate-100 flex items-center gap-1.5">
                      <ScanLine className="w-4 h-4 text-amber-400" />
                      {isCameraActive ? 'Kamera Pemindai Real-Time Aktif' : 'Pemindai Barcode Standby'}
                    </span>
                  </div>

                  {isCameraActive ? (
                    <button
                      type="button"
                      onClick={stopCameraScanner}
                      className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-[11px] font-bold transition"
                    >
                      Tutup Kamera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startCameraScanner}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-[11px] shadow-sm transition flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" /> Buka Kamera
                    </button>
                  )}
                </div>

                {cameraError && (
                  <div className="p-2.5 bg-rose-950/80 border border-rose-700/60 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                    <span className="font-bold">⚠️ Info Kamera:</span>
                    <span>{cameraError}</span>
                  </div>
                )}

                {/* Viewfinder Frame */}
                <div className="relative w-full h-56 sm:h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border-2 border-slate-800">
                  {/* Video Live Stream */}
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      isCameraActive ? 'opacity-100' : 'opacity-0 absolute'
                    }`}
                  />

                  {/* Placeholder saat kamera belum menyala */}
                  {!isCameraActive && (
                    <div className="text-center p-4 space-y-2 z-10">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mx-auto shadow-inner border border-slate-700">
                        <ScanLine className="w-8 h-8 animate-pulse" />
                      </div>
                      <p className="text-xs font-bold text-slate-200">
                        Arahkan label resi thermal ke kotak kamera
                      </p>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                        Klik tombol di bawah untuk menyalakan kamera laptop/HP Anda.
                      </p>
                      <button
                        type="button"
                        onClick={startCameraScanner}
                        className="mt-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-md transition inline-flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" /> Nyalakan Kamera Scanner
                      </button>
                    </div>
                  )}

                  {/* Scanner Target Box with Corner Brackets & Glowing Laser */}
                  <div className="absolute inset-x-8 sm:inset-x-16 inset-y-8 sm:inset-y-12 border-2 border-dashed border-amber-400/50 rounded-2xl pointer-events-none flex items-center justify-center">
                    {/* Reticle Corner Brackets */}
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-amber-400 rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-amber-400 rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-amber-400 rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-amber-400 rounded-br-lg"></div>

                    {/* Animated Laser Scan Beam */}
                    <div className={`absolute left-2 right-2 h-0.5 laser-scan-line pointer-events-none transition-all ${
                      laserFlashed 
                        ? 'bg-emerald-400 shadow-[0_0_18px_#34d399] h-1' 
                        : 'bg-red-500 shadow-[0_0_12px_#ef4444]'
                    }`} />
                  </div>

                  {/* Guidance text pill */}
                  <div className="absolute bottom-2.5 px-3 py-1 bg-slate-950/80 backdrop-blur rounded-full text-[10px] font-bold text-amber-300 border border-slate-700/60 pointer-events-none">
                    Posisikan barcode resi tepat di tengah garis laser
                  </div>
                </div>

                {/* Dukungan Scanner Gun USB / Bluetooth */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Mode Scanner Gun Fisik (USB / Bluetooth):
                    </span>
                    <span className="text-[10px] text-slate-400">Tekan Enter otomatis</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Klik di sini & tembakkan pistol scanner ke label paket..."
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          handleBarcodeCaptured(val, 'Pistol Barcode Scanner Gun');
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 text-amber-200 border border-slate-700 rounded-lg text-xs font-mono placeholder:text-slate-500 focus:outline-amber-400"
                  />
                </div>

                {/* Quick-Scan Sample Barcode Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 block">
                    ⚡ Tes Cepat Scan Barcode Paket di Hub Ini:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableResiSamples.map(sample => (
                      <button
                        key={sample.awb}
                        type="button"
                        onClick={() => handleBarcodeCaptured(sample.awb, 'Simulasi Scan Barcode Cepat')}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded-xl text-[10px] font-mono font-bold transition flex items-center gap-1.5 border border-slate-800 shadow-sm"
                        title={sample.info}
                      >
                        <ScanLine className="w-3 h-3 text-amber-400" />
                        <span>{sample.awb}</span>
                        <span className="text-[9px] opacity-70 font-sans hidden sm:inline">• {sample.info.split('•')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* OPSI 2: INPUT RESI MANUAL */}
            {scanInputMode === 'manual' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">Nomor Resi (AWB) yang di-scan</label>
                  <span className="text-[10px] text-slate-400 font-mono">Format: AZC / AZX / AZK</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required={scanInputMode === 'manual'}
                    placeholder="Contoh: AZC-20260927-1582"
                    value={scanAwb}
                    onChange={e => setScanAwb(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-amber-500 uppercase bg-white font-bold"
                  />
                  {scanAwb && (
                    <button
                      type="button"
                      onClick={() => setScanAwb('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Ketik nomor resi secara manual jika barcode pada label pengiriman robek atau buram.
                </p>
              </div>
            )}

            {/* PREVIEW KARTU BARCODE RESI YANG TERPILIH / TERDETEKSI */}
            {scanAwb ? (
              <div className="p-3.5 bg-amber-50/90 border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
                    <ScanLine className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
                      Resi Terdeteksi Siap Di-Checkpoint
                    </span>
                    <p className="text-base font-black font-mono text-slate-900 tracking-wider">{scanAwb}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block bg-white px-2 py-1 rounded-lg border border-amber-200">
                    <Barcode value={scanAwb} height={30} showText={false} />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setScanAwb('');
                      if (scanInputMode === 'scanner') startCameraScanner();
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-white border border-rose-200 px-2.5 py-1.5 rounded-xl transition shadow-xs"
                  >
                    Scan Ulang
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                Belum ada resi yang di-scan atau diketik. Silakan gunakan pemindai barcode di atas atau ketik nomor resi.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Lokasi Hub / Cabang Aktif</label>
                <select
                  value={scanCity}
                  onChange={e => setScanCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-amber-500 bg-white font-medium"
                >
                  {activeHubs.length > 0 ? (
                    activeHubs.map((h: any) => (
                      <option key={h.id || h.hubCode} value={`${h.name} (${h.city})`}>
                        🏢 [{h.hubCode}] {h.name} — {h.city}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Drop Point Gambir - Jakarta">Drop Point Gambir - Jakarta</option>
                      <option value="Sorting Center Gateway - Bandung">Sorting Center Gateway - Bandung</option>
                      <option value="Drop Point Gubeng - Surabaya">Drop Point Gubeng - Surabaya</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Scan</label>
                <select
                  value={scanTitle}
                  onChange={e => {
                    setScanTitle(e.target.value);
                    if (e.target.value === 'Tiba di Sorting Center Tujuan') {
                      setScanDesc('Paket telah tiba di Gateway tujuan dan siap di-sortir ke kurir delivery.');
                    } else if (e.target.value === 'Paket Sedang Diantar Kurir (Out for Delivery)') {
                      setScanDesc('Kurir Last-Mile sedang dalam perjalanan mengantarkan paket ke rumah Anda.');
                    } else if (e.target.value === 'Paket Telah Diterima (Delivered)') {
                      setScanDesc('Paket telah diserahkan dan diterima oleh penerima yang bersangkutan (POD).');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50"
                >
                  <option value="Paket Diterima di Drop Point AZ GO">Paket Diterima di Drop Point AZ GO</option>
                  <option value="Paket Tiba di Sorting Center Asal">Paket Tiba di Sorting Center Asal</option>
                  <option value="Diberangkatkan dengan Truk Linehaul">Diberangkatkan dengan Truk Linehaul</option>
                  <option value="Tiba di Sorting Center Tujuan">Tiba di Sorting Center Tujuan</option>
                  <option value="Paket Sedang Diantar Kurir (Out for Delivery)">Paket Sedang Diantar Kurir (Out for Delivery)</option>
                  <option value="Paket Telah Diterima (Delivered)">Paket Telah Diterima (Delivered)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Aktivitas</label>
              <textarea
                rows={2}
                value={scanDesc}
                onChange={e => setScanDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-sm"
            >
              Simpan Checkpoint Baru (Scan Barcode)
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
