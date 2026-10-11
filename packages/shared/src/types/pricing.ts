import { ServiceType } from './order';
import { VehicleType } from './user';

export interface InstantFareCalculationRequest {
  serviceType: ServiceType;
  vehicleType: VehicleType;
  distanceKm: number;
}

export interface InstantFareResult {
  baseFare: number;
  distanceFare: number;
  appFee: number;
  totalFare: number;
}

export interface ExpeditionFareCalculationRequest {
  originCity: string;
  destinationCity: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  serviceCode?: 'REGULAR' | 'EXPRESS';
}

export interface ExpeditionFareResult {
  actualWeightKg: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  ratePerKg: number;
  shippingFee: number;
  appFee: number;
  totalAmount: number;
  etdText: string;
}
