export type UserRole = 'CUSTOMER' | 'DRIVER' | 'MERCHANT' | 'HUB_STAFF' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  storeType?: 'FOOD' | 'MART';
  isActive?: boolean;
  hasSelfCourier?: boolean;
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
