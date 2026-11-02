export type PartnerType = 'DRIVER' | 'MERCHANT';
export type DriverVehicleCategory = 'MOTORBIKE' | 'CAR' | 'CARGO_PICKUP' | 'CARGO_TRUCK';
export type MerchantCategoryType = 'FOOD' | 'MART';
export type PartnerApplicationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface PartnerApplication {
  id: string;
  type: PartnerType;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  status: PartnerApplicationStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  
  // Spesifik Driver
  vehicleCategory?: DriverVehicleCategory;
  vehiclePlate?: string;
  vehicleModel?: string;
  ktpNumber?: string;
  simNumber?: string;
  documents?: {
    ktpUrl?: string;
    simUrl?: string;
    stnkUrl?: string;
    vehiclePhotoUrl?: string;
    storePhotoUrl?: string;
  };

  // Spesifik Merchant
  storeName?: string;
  merchantType?: MerchantCategoryType;
  storeCategory?: string;
  storeDescription?: string;

  // Opsi Kurir Mandiri & Pengantaran untuk Merchant (Toko / Resto)
  hasSelfCourier?: boolean;
  deliveryOption?: 'AZGO_ONLY' | 'SELF_ONLY' | 'BOTH';
  selfCourierName?: string;
  selfCourierPhone?: string;
  selfCourierVehicle?: string;
  selfCourierPlate?: string;

  // Data Rekening Bank untuk Pencairan Dana
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;

  // Akun Mitra yang Digenerate jika Disetujui
  generatedUserId?: string;
  tempPassword?: string;
}

export interface PosSubscriptionApplication {
  id: string;
  merchantId: string;
  merchantName: string;
  storeType: MerchantCategoryType;
  phone: string;
  email: string;
  packageType: import('./user').PosPackageType;
  status: import('./user').PosSubscriptionStatus;
  price: number;
  paymentMethod: 'TRANSFER_BANK' | 'QRIS' | 'FREE_TRIAL';
  paymentProofUrl?: string;
  paymentProofName?: string;
  startDate?: string;
  endDate?: string;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

