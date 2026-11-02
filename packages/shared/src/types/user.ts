export type UserRole = 'CUSTOMER' | 'DRIVER' | 'MERCHANT' | 'HUB_STAFF' | 'ADMIN';

export type PosPackageType = 'TRIAL_3_DAYS' | 'MONTHLY' | 'ANNUAL';
export type PosSubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'PENDING_APPROVAL' | 'EXPIRED' | 'REJECTED' | 'NONE';

export interface PosPricingConfig {
  monthlyPrice: number;
  annualPrice: number;
  trialDays: number;
}

export const DEFAULT_POS_PRICING: PosPricingConfig = {
  monthlyPrice: 79000,
  annualPrice: 790000,
  trialDays: 3,
};

export interface PosSubscriptionInfo {
  packageType: PosPackageType;
  status: PosSubscriptionStatus;
  price?: number;
  startDate?: string;
  endDate?: string;
  requestedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  paymentProofUrl?: string;
  paymentProofName?: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  storeType?: 'FOOD' | 'MART';
  isActive?: boolean;
  hasSelfCourier?: boolean;
  posSubscription?: PosSubscriptionInfo;
  selfCouriers?: {
    id: string;
    name: string;
    phone: string;
    vehicleModel?: string;
    vehiclePlate?: string;
  }[];
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  createdAt: string;
  updatedAt: string;
}

export type VehicleType = 'MOTORBIKE' | 'CAR' | 'TRUCK';

export interface DriverProfile {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  vehiclePlate: string;
  vehicleModel: string;
  isOnline: boolean;
  isBusy: boolean;
  currentLat?: number;
  currentLng?: number;
  rating: number;
  totalTrips: number;
}
