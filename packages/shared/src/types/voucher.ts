export type VoucherDiscountType = 'PERCENTAGE' | 'FIXED';

export type VoucherServiceScope = 
  | 'ALL' 
  | 'AZ_DELIVERY' 
  | 'AZ_MART' 
  | 'AZ_RIDE' 
  | 'AZ_CAR' 
  | 'AZ_EXPRESS' 
  | 'AZ_CARGO';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableService: VoucherServiceScope;
  validFrom: string;
  validUntil: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateVoucherInput {
  code: string;
  title: string;
  description?: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  usageLimit?: number;
  applicableService?: VoucherServiceScope;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
}

export interface UpdateVoucherInput {
  code?: string;
  title?: string;
  description?: string;
  discountType?: VoucherDiscountType;
  discountValue?: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  applicableService?: VoucherServiceScope;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
}

export interface ValidateVoucherResult {
  isValid: boolean;
  message: string;
  discountAmount: number;
  finalAmount: number;
  voucher?: Voucher;
}
