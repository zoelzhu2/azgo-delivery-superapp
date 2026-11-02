import { PartnerType } from './partner';

export interface CommissionConfig {
  driverCommissionPercent: number; // Persentase potongan driver (misal 15%)
  merchantCommissionPercent: number; // Persentase potongan resto/mart (misal 15%)
  platformFixedFee: number; // Potongan tetap platform per order (misal Rp 2.000)
  cargoCommissionPercent: number; // Persentase kargo (misal 12%)
  minimumWithdrawalAmount: number; // Minimal penarikan saldo (misal Rp 50.000)
}

export interface WalletTransaction {
  id: string;
  partnerId: string;
  partnerType: PartnerType;
  partnerName: string;
  orderNumber?: string;
  type: 'ORDER_INCOME' | 'PLATFORM_COMMISSION' | 'WITHDRAWAL' | 'BONUS';
  amount: number; // Nominal yang mempengaruhi saldo (bisa positif/negatif)
  balanceAfter?: number; // Saldo berjalan setelah transaksi
  grossAmount?: number; // Total bruto sebelum potongan
  commissionCut?: number; // Nilai potongan bagi hasil masuk ke AZ GO
  netAmount?: number; // Pendapatan bersih mitra
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

export type DisbursementMode = 'SCHEDULED' | 'INSTANT_ON_DEMAND';

export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED';

export interface WithdrawalRequest {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerType: PartnerType;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: WithdrawalStatus;
  mode?: DisbursementMode;
  transferFee?: number;
  netDisbursedAmount?: number;
  referenceId?: string; // ID transaksi API Payout (Midtrans Iris / Xendit)
  requestedAt: string;
  processedAt?: string;
  rejectionReason?: string;
}

export interface CodDepositRecord {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  depositMethod: 'CASH_AT_HUB' | 'VIRTUAL_ACCOUNT' | 'QRIS';
  proofUrl?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  hubId?: string;
  verifiedBy?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface PlatformFinanceSummary {
  totalGmv: number; // Total perputaran uang seluruh order
  totalPlatformRevenue: number; // Total bagi hasil & fee yang masuk ke kas AZ GO
  totalPartnerDisbursed: number; // Total pendapatan bersih yang diserahkan ke mitra
  totalPendingWithdrawals: number; // Total permintaan penarikan dana yang belum diproses
  commissionConfig: CommissionConfig;
}
