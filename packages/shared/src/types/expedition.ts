export type HubType = 'DROP_POINT' | 'SORTING_CENTER';

export interface Hub {
  id: string;
  hubCode: string;
  name: string;
  hubType: HubType;
  city: string;
  address: string;
  lat?: number;
  lng?: number;
  isActive: boolean;
}

export type ExpeditionPackageType = 'DOCUMENT' | 'PARCEL' | 'FRAGILE' | 'ELECTRONIC' | 'CARGO_BULKY';

export type CargoVehicleType = 'PICKUP_BAK' | 'PICKUP_BOX' | 'BLIND_VAN' | 'TRUCK_ENGKEL';

export interface CargoFareRequest {
  vehicleType: CargoVehicleType;
  distanceKm: number;
  helperCount: number; // Jumlah tenaga angkut
}

export interface CargoFareResult {
  vehicleName: string;
  maxWeightKg: number;
  baseFare: number;
  distanceFare: number;
  helperFee: number;
  appFee: number;
  totalFare: number;
}

export interface PickupRequest {
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  scheduledTime: string;
  estimatedPackages: number;
  notes?: string;
}

export interface ExpeditionDeliveryDetail {
  id: string;
  orderId: string;
  trackingNumber: string; // AWB Resi
  recipientName: string;
  recipientPhone: string;
  recipientAddress?: string;
  senderName?: string;
  senderPhone?: string;
  senderAddress?: string;
  originCity?: string;
  destinationCity?: string;
  serviceCode?: string;
  itemDescription?: string;
  totalAmount?: number;
  packageType: ExpeditionPackageType;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  chargeableWeightKg: number;
  originHubId?: string;
  destinationHubId?: string;
  currentHubId?: string;
  proofOfDeliveryUrl?: string;
  podRecipientRelation?: string;
  createdAt?: string;
}

export interface TrackingCheckpoint {
  id: string;
  orderId: string;
  trackingNumber: string;
  hubId?: string;
  hubName?: string;
  city: string;
  checkpointTitle: string;
  description: string;
  scannedAt: string;
}

export interface ExpeditionRate {
  id: string;
  originCity: string;
  destinationCity: string;
  serviceCode: 'REGULAR' | 'EXPRESS';
  ratePerKg: number;
  minWeightKg: number;
  etdDaysMin: number;
  etdDaysMax: number;
  isActive: boolean;
}
