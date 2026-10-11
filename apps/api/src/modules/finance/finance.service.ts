import { CommissionConfig, WalletTransaction, WithdrawalRequest, PlatformFinanceSummary, PartnerType } from '@delivery/shared';

export class FinanceService {
  private config: CommissionConfig = {
    driverCommissionPercent: 15, // 15% dari ongkos kirim
    merchantCommissionPercent: 15, // 15% dari nilai pesanan makanan / mart
    platformFixedFee: 2000, // Rp 2.000 biaya jasa aplikasi pelanggan
    cargoCommissionPercent: 12, // 12% untuk armada kargo besar
    minimumWithdrawalAmount: 50000 // Minimal Rp 50.000 untuk penarikan dana
  };

  private transactions: WalletTransaction[] = [
    {
      id: 'tx-drv-101',
      partnerId: 'usr-drv-1',
      partnerType: 'DRIVER',
      partnerName: 'Rudi Hartono (Driver)',
      orderNumber: 'AZD-882910',
      type: 'ORDER_INCOME',
      amount: 32300,
      grossAmount: 38000,
      commissionCut: 5700,
      netAmount: 32300,
      description: 'Pendapatan Pesanan Az Delivery (Dipotong komisi AZ GO 15%)',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
    },
    {
      id: 'tx-drv-102',
      partnerId: 'usr-drv-1',
      partnerType: 'DRIVER',
      partnerName: 'Rudi Hartono (Driver)',
      orderNumber: 'AZD-901824',
      type: 'ORDER_INCOME',
      amount: 12325,
      grossAmount: 14500,
      commissionCut: 2175,
      netAmount: 12325,
      description: 'Pendapatan Pesanan Az Delivery (Dipotong komisi AZ GO 15%)',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
      id: 'tx-mch-201',
      partnerId: 'usr-mch-1',
      partnerType: 'MERCHANT',
      partnerName: 'Pemilik Ayam Geprek Sambal Bawang',
      orderNumber: 'AZD-119280',
      type: 'ORDER_INCOME',
      amount: 52700,
      grossAmount: 62000,
      commissionCut: 9300,
      netAmount: 52700,
      description: 'Hasil Penjualan Makanan (Dipotong komisi platform AZ GO 15%)',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString()
    },
    {
      id: 'tx-mch-202',
      partnerId: 'usr-mch-1',
      partnerType: 'MERCHANT',
      partnerName: 'Pemilik Ayam Geprek Sambal Bawang',
      orderNumber: 'AZD-119275',
      type: 'ORDER_INCOME',
      amount: 21250,
      grossAmount: 25000,
      commissionCut: 3750,
      netAmount: 21250,
      description: 'Hasil Penjualan Makanan (Dipotong komisi platform AZ GO 15%)',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 1 * 3600000).toISOString()
    },
    {
      id: 'tx-wd-001',
      partnerId: 'usr-drv-1',
      partnerType: 'DRIVER',
      partnerName: 'Rudi Hartono (Driver)',
      type: 'WITHDRAWAL',
      amount: -100000,
      grossAmount: 100000,
      commissionCut: 0,
      netAmount: 100000,
      description: 'Pencairan Dana Saldo ke Rekening Bank BCA 882019281',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
    }
  ];

  private withdrawals: WithdrawalRequest[] = [
    {
      id: 'wd-req-001',
      partnerId: 'usr-drv-1',
      partnerName: 'Rudi Hartono',
      partnerType: 'DRIVER',
      amount: 150000,
      bankName: 'BCA (Bank Central Asia)',
      accountNumber: '8820192819',
      accountHolder: 'Rudi Hartono',
      status: 'PENDING',
      requestedAt: new Date(Date.now() - 30 * 60000).toISOString()
    },
    {
      id: 'wd-req-002',
      partnerId: 'usr-mch-1',
      partnerName: 'Ayam Geprek Sambal Bawang Juara',
      partnerType: 'MERCHANT',
      amount: 350000,
      bankName: 'Mandiri',
      accountNumber: '1310098765432',
      accountHolder: 'Bambang Pamungkas',
      status: 'APPROVED',
      requestedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      processedAt: new Date(Date.now() - 22 * 3600000).toISOString()
    }
  ];

  // ================= 1. PENGATURAN BAGI HASIL (ADMIN) ================= //
  getConfig(): CommissionConfig {
    return this.config;
  }

  updateConfig(newConfig: Partial<CommissionConfig>): CommissionConfig {
    this.config = { ...this.config, ...newConfig };
    return this.config;
  }

  // ================= 2. REKAP KEUANGAN PLATFORM (ADMIN) ================= //
  getPlatformSummary(): PlatformFinanceSummary {
    const totalGmv = this.transactions
      .filter(t => t.type === 'ORDER_INCOME')
      .reduce((sum, t) => sum + (t.grossAmount || 0), 0) + 14850000; // baseline GMV simulasi

    const totalPlatformRevenue = this.transactions
      .filter(t => t.type === 'ORDER_INCOME')
      .reduce((sum, t) => sum + (t.commissionCut || 0), 0) + 2227500; // baseline komisi masuk AZ GO

    const totalPartnerDisbursed = this.transactions
      .filter(t => t.type === 'ORDER_INCOME')
      .reduce((sum, t) => sum + (t.netAmount || 0), 0) + 12622500; // baseline hak mitra

    const pendingWithdrawalSum = this.withdrawals
      .filter(w => w.status === 'PENDING')
      .reduce((sum, w) => sum + w.amount, 0);

    return {
      totalGmv,
      totalPlatformRevenue,
      totalPartnerDisbursed,
      totalPendingWithdrawals: pendingWithdrawalSum,
      commissionConfig: this.config
    };
  }

  // ================= 3. DOMPET & SALDO MITRA (DRIVER / TOKO) ================= //
  getPartnerWallet(partnerId: string, partnerType: PartnerType) {
    const partnerTxs = this.transactions.filter(t => t.partnerId === partnerId || t.partnerType === partnerType);
    
    // Hitung saldo aktif
    const balance = partnerTxs.reduce((sum, t) => sum + t.amount, 215000); // default baseline saldo Rp 215.000 jika baru
    const totalGross = partnerTxs.filter(t => t.type === 'ORDER_INCOME').reduce((sum, t) => sum + (t.grossAmount || 0), 0);
    const totalCommissionCut = partnerTxs.filter(t => t.type === 'ORDER_INCOME').reduce((sum, t) => sum + (t.commissionCut || 0), 0);
    const totalNet = partnerTxs.filter(t => t.type === 'ORDER_INCOME').reduce((sum, t) => sum + (t.netAmount || 0), 0);

    const partnerWithdrawals = this.withdrawals.filter(w => w.partnerId === partnerId || w.partnerType === partnerType);

    return {
      balance,
      totalGross,
      totalCommissionCut,
      totalNet,
      commissionPercent: partnerType === 'DRIVER' ? this.config.driverCommissionPercent : this.config.merchantCommissionPercent,
      transactions: partnerTxs,
      withdrawals: partnerWithdrawals
    };
  }

  // ================= 4. PENARIKAN DANA (WITHDRAWAL) ================= //
  requestWithdrawal(data: {
    partnerId: string;
    partnerName: string;
    partnerType: PartnerType;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }): WithdrawalRequest {
    if (data.amount < this.config.minimumWithdrawalAmount) {
      throw new Error(`Minimal penarikan dana adalah Rp ${this.config.minimumWithdrawalAmount.toLocaleString('id-ID')}`);
    }

    const newRequest: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      partnerId: data.partnerId,
      partnerName: data.partnerName,
      partnerType: data.partnerType,
      amount: Number(data.amount),
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder,
      status: 'PENDING',
      requestedAt: new Date().toISOString()
    };

    this.withdrawals.unshift(newRequest);

    // Catat mutasi pending di riwayat transaksi
    this.transactions.unshift({
      id: `tx-wd-${Date.now()}`,
      partnerId: data.partnerId,
      partnerType: data.partnerType,
      partnerName: data.partnerName,
      type: 'WITHDRAWAL',
      amount: -data.amount,
      grossAmount: data.amount,
      commissionCut: 0,
      netAmount: data.amount,
      description: `Penarikan Saldo ke ${data.bankName} - ${data.accountNumber} (${data.accountHolder})`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });

    return newRequest;
  }

  getWithdrawalRequests(status?: string): WithdrawalRequest[] {
    if (!status || status === 'ALL') return this.withdrawals;
    return this.withdrawals.filter(w => w.status === status);
  }

  reviewWithdrawal(id: string, action: 'APPROVE' | 'REJECT', reason?: string): WithdrawalRequest {
    const req = this.withdrawals.find(w => w.id === id);
    if (!req) throw new Error('Pengajuan penarikan dana tidak ditemukan');

    if (action === 'APPROVE') {
      req.status = 'APPROVED';
      req.processedAt = new Date().toISOString();

      // Update transaksi yang bersangkutan
      const tx = this.transactions.find(t => t.type === 'WITHDRAWAL' && t.partnerId === req.partnerId && t.status === 'PENDING');
      if (tx) tx.status = 'COMPLETED';
    } else {
      req.status = 'REJECTED';
      req.rejectionReason = reason || 'Nomor rekening atau nama pemilik bank tidak valid';
      req.processedAt = new Date().toISOString();

      // Kembalikan saldo mitra dengan membuat transaksi pembatalan
      this.transactions.unshift({
        id: `tx-refund-${Date.now()}`,
        partnerId: req.partnerId,
        partnerType: req.partnerType,
        partnerName: req.partnerName,
        type: 'BONUS',
        amount: req.amount,
        description: `Pengembalian Saldo (Penarikan Dana Ditolak: ${req.rejectionReason})`,
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      });
    }

    return req;
  }
}

export const financeService = new FinanceService();
