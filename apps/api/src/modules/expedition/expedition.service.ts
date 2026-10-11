import {
  ExpeditionFareCalculationRequest,
  ExpeditionFareResult,
  ExpeditionDeliveryDetail,
  TrackingCheckpoint,
  CargoVehicleType,
  CargoFareRequest,
  CargoFareResult,
  PickupRequest
} from '@delivery/shared';
import { expeditionRepository } from './expedition.repository';

export class ExpeditionService {
  /**
   * Menghitung tarif pengiriman paket reguler (Az Courier) & kilat (Az Express)
   */
  async calculateFare(req: ExpeditionFareCalculationRequest): Promise<ExpeditionFareResult> {
    const { originCity, destinationCity, weightKg, lengthCm, widthCm, heightCm, serviceCode } = req;

    // Rumus berat volumetrik standar logistik (PxLxT / 6000)
    const volumetricWeightKg = Number(((lengthCm * widthCm * heightCm) / 6000).toFixed(2));
    const rawWeight = Math.max(weightKg, volumetricWeightKg);
    const chargeableWeightKg = Math.max(1.0, Math.ceil(rawWeight));

    const rate = await expeditionRepository.findRate(originCity, destinationCity);
    let ratePerKg = rate ? rate.ratePerKg : 12000;
    let etdText = rate ? `${rate.etdDaysMin}-${rate.etdDaysMax} Hari` : '2-3 Hari';

    // Jika layanan Express, tarif 1.5x dan waktu sampai lebih cepat
    if (serviceCode === 'EXPRESS') {
      ratePerKg = Math.round(ratePerKg * 1.5);
      etdText = 'Hari yang Sama / Besok Pagi (Sameday)';
    }

    const shippingFee = chargeableWeightKg * ratePerKg;
    const appFee = 2000;
    const totalAmount = shippingFee + appFee;

    return {
      actualWeightKg: weightKg,
      volumetricWeightKg,
      chargeableWeightKg,
      ratePerKg,
      shippingFee,
      appFee,
      totalAmount,
      etdText
    };
  }

  /**
   * Menghitung tarif Az Cargo (Barang Besar, Pindahan, Muatan Truk/Pickup)
   */
  calculateCargoFare(req: CargoFareRequest): CargoFareResult {
    const { vehicleType, distanceKm, helperCount } = req;

    let vehicleName = 'Pickup Bak Terbuka';
    let maxWeightKg = 800;
    let baseFare = 85000; // Dasar 0-5 KM
    let pricePerKm = 5000;

    switch (vehicleType) {
      case 'PICKUP_BOX':
        vehicleName = 'Pickup Box Tertutup';
        maxWeightKg = 1000;
        baseFare = 110000;
        pricePerKm = 5500;
        break;
      case 'BLIND_VAN':
        vehicleName = 'Blind Van';
        maxWeightKg = 600;
        baseFare = 95000;
        pricePerKm = 5000;
        break;
      case 'TRUCK_ENGKEL':
        vehicleName = 'Truk Engkel CDE';
        maxWeightKg = 2500;
        baseFare = 250000;
        pricePerKm = 9000;
        break;
    }

    const distanceFare = distanceKm > 5 ? Math.round((distanceKm - 5) * pricePerKm) : 0;
    const helperFee = (helperCount || 0) * 50000; // Rp 50.000 per helper tenaga angkut
    const appFee = 5000;
    const totalFare = baseFare + distanceFare + helperFee + appFee;

    return {
      vehicleName,
      maxWeightKg,
      baseFare,
      distanceFare,
      helperFee,
      appFee,
      totalFare
    };
  }

  /**
   * Generator Nomor Resi Resmi AZ GO
   * Az Courier: AZC-YYYYMMDD-XXXX
   * Az Express: AZX-YYYYMMDD-XXXX
   * Az Cargo:   AZK-YYYYMMDD-XXXX
   */
  generateTrackingNumber(prefix: string = 'AZC'): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${dateStr}-${randomSuffix}`;
  }

  /**
   * Menerbitkan Pengiriman & Resi AWB (Az Courier, Express, Cargo)
   */
  async createShipment(data: {
    recipientName: string;
    recipientPhone: string;
    recipientAddress?: string;
    senderName?: string;
    senderPhone?: string;
    senderAddress?: string;
    packageType: any;
    serviceCode?: 'REGULAR' | 'EXPRESS' | 'CARGO';
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    originCity: string;
    destinationCity: string;
    itemDescription?: string;
    originHubId?: string;
  }): Promise<{ delivery: ExpeditionDeliveryDetail; fare: ExpeditionFareResult }> {
    const fare = await this.calculateFare({
      originCity: data.originCity,
      destinationCity: data.destinationCity,
      weightKg: data.weightKg,
      lengthCm: data.lengthCm,
      widthCm: data.widthCm,
      heightCm: data.heightCm,
      serviceCode: data.serviceCode === 'EXPRESS' ? 'EXPRESS' : 'REGULAR'
    });

    const prefix = data.serviceCode === 'EXPRESS' ? 'AZX' : (data.serviceCode === 'CARGO' ? 'AZK' : 'AZC');
    const trackingNumber = this.generateTrackingNumber(prefix);

    const delivery: ExpeditionDeliveryDetail = {
      id: `del-${Date.now()}`,
      orderId: `ord-${Date.now()}`,
      trackingNumber,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      recipientAddress: data.recipientAddress || `Kota ${data.destinationCity}`,
      senderName: data.senderName || 'Drop Point AZ GO / Pengirim',
      senderPhone: data.senderPhone || '081200000000',
      senderAddress: data.senderAddress || `Drop Point ${data.originCity}`,
      originCity: data.originCity,
      destinationCity: data.destinationCity,
      serviceCode: data.serviceCode || 'REGULAR',
      itemDescription: data.itemDescription || 'Paket Kiriman',
      totalAmount: fare.totalAmount,
      packageType: data.packageType || 'PARCEL',
      weightKg: data.weightKg,
      lengthCm: data.lengthCm,
      widthCm: data.widthCm,
      heightCm: data.heightCm,
      chargeableWeightKg: fare.chargeableWeightKg,
      originHubId: data.originHubId,
      createdAt: new Date().toISOString()
    };

    await expeditionRepository.saveDelivery(delivery);

    // Otomatis buat checkpoint pertama
    await this.addScanCheckpoint({
      trackingNumber,
      city: data.originCity,
      checkpointTitle: 'Paket Diterima di Drop Point / Hub AZ GO',
      description: `Data pengiriman berhasil diinput oleh petugas Hub ${data.originCity}. Resi AWB diterbitkan dan paket siap diteruskan.`
    });

    return { delivery, fare };
  }

  /**
   * Membuat Pesanan Jemput Barang (Az Pickup)
   */
  async createPickupRequest(req: PickupRequest) {
    const pickupId = `pck-${Date.now()}`;
    const pickupOrder = {
      id: pickupId,
      orderNumber: `AZP-${Math.floor(100000 + Math.random() * 900000)}`,
      senderName: req.senderName,
      senderPhone: req.senderPhone,
      pickupAddress: req.pickupAddress,
      scheduledTime: req.scheduledTime || 'Sekarang (Instant Pickup)',
      estimatedPackages: req.estimatedPackages || 1,
      status: 'DRIVER_ASSIGNED',
      notes: req.notes || '',
      createdAt: new Date().toISOString()
    };
    return pickupOrder;
  }

  /**
   * Universal Tracking untuk semua layanan AZ GO
   */
  async trackShipment(trackingNumber: string): Promise<{
    delivery: ExpeditionDeliveryDetail | null;
    checkpoints: TrackingCheckpoint[];
  }> {
    const delivery = await expeditionRepository.findByTrackingNumber(trackingNumber);
    const checkpoints = await expeditionRepository.getCheckpoints(trackingNumber);

    return { delivery, checkpoints };
  }

  async addScanCheckpoint(data: {
    trackingNumber: string;
    city: string;
    checkpointTitle: string;
    description: string;
    hubId?: string;
    hubName?: string;
  }): Promise<TrackingCheckpoint> {
    const checkpoint: TrackingCheckpoint = {
      id: `cp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: 'internal-order-id',
      trackingNumber: data.trackingNumber,
      city: data.city,
      checkpointTitle: data.checkpointTitle,
      description: data.description,
      hubId: data.hubId,
      hubName: data.hubName,
      scannedAt: new Date().toISOString()
    };

    return await expeditionRepository.addCheckpoint(checkpoint);
  }

  async listHubs() {
    return await expeditionRepository.getHubs();
  }
}

export const expeditionService = new ExpeditionService();
