export type PaymentMethodType = 
  | 'QRIS_DYNAMIC'
  | 'VIRTUAL_ACCOUNT'
  | 'EWALLET_GOPAY'
  | 'EWALLET_SHOPEEPAY'
  | 'EWALLET_DANA'
  | 'EWALLET_OVO'
  | 'CASH'
  | 'AZGO_PAY';

export type PaymentBankChannel = 'BCA' | 'MANDIRI' | 'BRI' | 'BNI' | 'PERMATA' | 'CIMB';

export type PaymentTransactionStatus = 
  | 'PENDING'
  | 'PAID'
  | 'EXPIRED'
  | 'FAILED'
  | 'REFUNDED';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  serviceType: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  bankChannel?: PaymentBankChannel;
  status: PaymentTransactionStatus;
  
  // Data Gateway (Midtrans / Xendit)
  externalTransactionId?: string;
  qrString?: string;
  qrImageUrl?: string;
  vaNumber?: string;
  deeplinkUrl?: string;
  
  expiresAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChargeRequest {
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceType: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  bankChannel?: PaymentBankChannel;
}

export interface CreateChargeResponse {
  success: boolean;
  message: string;
  transaction: PaymentTransaction;
  instructions?: string[];
}

export interface PaymentWebhookPayload {
  orderId: string;
  transactionId: string;
  paymentMethod: string;
  grossAmount: number;
  transactionStatus: 'settlement' | 'capture' | 'pending' | 'expire' | 'cancel' | 'deny';
  signatureKey?: string;
  statusCode?: string;
  fraudStatus?: string;
  rawTime?: string;
}

export interface CodReconciliationSummary {
  driverId: string;
  driverName: string;
  unsettledCodAmount: number;     // Total uang tunai COD yang saat ini dipegang kurir
  codCreditLimit: number;         // Plafon maksimal uang tunai (misal Rp 500.000)
  isCodRestricted: boolean;       // True jika melebihi plafon dan wajib setor
  unsettledOrdersCount: number;
  lastDepositAt?: string;
}
