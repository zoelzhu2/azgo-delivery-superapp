import { 
  CreateChargeRequest, 
  CreateChargeResponse, 
  PaymentTransaction, 
  PaymentWebhookPayload, 
  PaymentBankChannel, 
  WithdrawalRequest, 
  CodDepositRecord, 
  CodReconciliationSummary 
} from '@delivery/shared';

export class PaymentService {
  // Penyimpanan transaksi pembayaran in-memory (dapat dihubungkan ke PostgreSQL/Supabase)
  private transactions: Map<string, PaymentTransaction> = new Map();
  private codDeposits: CodDepositRecord[] = [];
  private driverUnsettledCod: Map<string, number> = new Map([
    ['usr-drv-1', 125000] // Driver Rudi Hartono sedang memegang cash COD Rp 125.000
  ]);

  constructor() {
    // Inisialisasi mock transaksi awal untuk testing
    this.seedMockTransactions();
  }

  private seedMockTransactions() {
    const mockTx: PaymentTransaction = {
      id: 'PAY-TX-9901',
      orderId: 'ord-101',
      orderNumber: 'AZD-882910',
      customerId: 'usr-cust-1',
      customerName: 'Siti Rahma',
      serviceType: 'AZ_DELIVERY',
      amount: 38000,
      paymentMethod: 'QRIS_DYNAMIC',
      status: 'PAID',
      qrString: '00020101021226670014ID.LINKAJA.WWW01189360091800000000000215ID10293847562095204581253033605405380005802ID5913AZ GO PAY LOG6013JAKARTA TIMUR61051393062070703A01630489AB',
      expiresAt: new Date(Date.now() - 3600000).toISOString(),
      paidAt: new Date(Date.now() - 3500000).toISOString(),
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3500000).toISOString()
    };
    this.transactions.set(mockTx.orderId, mockTx);
  }

  /**
   * 1. CREATE CHARGE (Membuat Tagihan Pembayaran Baru)
   * Menghasilkan QRIS Dinamis unik, Virtual Account Bank, atau Deeplink E-Wallet
   */
  public async createCharge(req: CreateChargeRequest): Promise<CreateChargeResponse> {
    const transactionId = `TX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // Berlaku 15 menit

    let qrString: string | undefined;
    let qrImageUrl: string | undefined;
    let vaNumber: string | undefined;
    let deeplinkUrl: string | undefined;
    const instructions: string[] = [];

    switch (req.paymentMethod) {
      case 'QRIS_DYNAMIC': {
        // Standar EMVCo QRIS Dinamis Indonesia dengan nominal rupiah eksak tertanam
        const paddedAmount = req.amount.toString();
        qrString = `00020101021226670014ID.CO.AZGO.WWW01189360091800000000000215ID1029384756209520458125303360540${paddedAmount.length.toString().padStart(2, '0')}${paddedAmount}5802ID5915AZ GO NUSANTARA6007JAKARTA61051211062200716${req.orderNumber}6304E8A1`;
        // URL QR Image Generator (SVG / PNG kompatibel)
        qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}`;
        instructions.push('Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, OVO, DANA, ShopeePay).');
        instructions.push('Pilih menu Pindai / Scan QRIS dan arahkan kamera ke barcode.');
        instructions.push(`Pastikan nama penerima tertulis "AZ GO NUSANTARA" dengan nominal Rp ${req.amount.toLocaleString('id-ID')}.`);
        instructions.push('Konfirmasi pembayaran. Status pesanan akan otomatis terverifikasi tanpa upload bukti.');
        break;
      }

      case 'VIRTUAL_ACCOUNT': {
        const bank = req.bankChannel || 'BCA';
        const bankPrefix: Record<PaymentBankChannel, string> = {
          BCA: '80777',
          MANDIRI: '88908',
          BRI: '12800',
          BNI: '98800',
          PERMATA: '85220',
          CIMB: '23450'
        };
        const phoneSuffix = req.customerPhone ? req.customerPhone.replace(/[^0-9]/g, '').slice(-7) : Math.floor(1000000 + Math.random() * 9000000).toString();
        vaNumber = `${bankPrefix[bank]}${phoneSuffix}`;

        instructions.push(`Buka m-Banking atau ATM ${bank}.`);
        instructions.push(`Pilih menu Transfer > Virtual Account.`);
        instructions.push(`Masukkan nomor Virtual Account: ${vaNumber}`);
        instructions.push(`Periksa detail tagihan sebesar Rp ${req.amount.toLocaleString('id-ID')} dan selesaikan transaksi.`);
        break;
      }

      case 'EWALLET_GOPAY':
      case 'EWALLET_SHOPEEPAY':
      case 'EWALLET_DANA':
      case 'EWALLET_OVO': {
        const ewalletName = req.paymentMethod.replace('EWALLET_', '').toLowerCase();
        deeplinkUrl = `https://pay.${ewalletName}.co.id/checkout?order_id=${req.orderNumber}&amount=${req.amount}&callback_url=https://azgo.id/orders/${req.orderId}`;
        instructions.push(`Anda akan dialihkan ke aplikasi ${req.paymentMethod.replace('EWALLET_', '')}.`);
        instructions.push('Klik tombol konfirmasi bayar di aplikasi dompet Anda.');
        break;
      }

      case 'CASH': {
        instructions.push('Siapkan uang tunai kepada kurir saat pesanan sampai di tujuan.');
        break;
      }

      case 'AZGO_PAY': {
        instructions.push('Pembayaran dipotong langsung dari saldo dompet AZGO Pay Anda.');
        break;
      }
    }

    const transaction: PaymentTransaction = {
      id: transactionId,
      orderId: req.orderId,
      orderNumber: req.orderNumber,
      customerId: req.customerId,
      customerName: req.customerName,
      serviceType: req.serviceType,
      amount: req.amount,
      paymentMethod: req.paymentMethod,
      bankChannel: req.bankChannel,
      status: req.paymentMethod === 'CASH' ? 'PENDING' : 'PENDING',
      qrString,
      qrImageUrl,
      vaNumber,
      deeplinkUrl,
      expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.transactions.set(req.orderId, transaction);

    return {
      success: true,
      message: 'Tagihan pembayaran berhasil dibuat',
      transaction,
      instructions
    };
  }

  /**
   * 2. CEK STATUS TRANSAKSI
   */
  public getTransactionByOrderId(orderId: string): PaymentTransaction | undefined {
    return this.transactions.get(orderId);
  }

  /**
   * 3. HANDLE WEBHOOK NOTIFICATION (DARI PAYMENT GATEWAY)
   * Otomatisasi 100% verifikasi pembayaran tanpa upload foto struk
   */
  public async handleWebhook(payload: PaymentWebhookPayload): Promise<{ success: boolean; status: string; orderId: string }> {
    const tx = this.transactions.get(payload.orderId);
    if (!tx) {
      return { success: false, status: 'NOT_FOUND', orderId: payload.orderId };
    }

    if (payload.transactionStatus === 'settlement' || payload.transactionStatus === 'capture') {
      tx.status = 'PAID';
      tx.paidAt = new Date().toISOString();
      tx.updatedAt = new Date().toISOString();
      this.transactions.set(payload.orderId, tx);
      console.log(`[PAYMENT WEBHOOK SUCCESS] Order ${payload.orderId} telah LUNAS via ${payload.paymentMethod}`);
      return { success: true, status: 'PAID', orderId: payload.orderId };
    } else if (payload.transactionStatus === 'expire') {
      tx.status = 'EXPIRED';
      tx.updatedAt = new Date().toISOString();
      return { success: true, status: 'EXPIRED', orderId: payload.orderId };
    } else if (payload.transactionStatus === 'cancel' || payload.transactionStatus === 'deny') {
      tx.status = 'FAILED';
      tx.updatedAt = new Date().toISOString();
      return { success: true, status: 'FAILED', orderId: payload.orderId };
    }

    return { success: true, status: tx.status, orderId: payload.orderId };
  }

  /**
   * 4. ON-DEMAND INSTANT WITHDRAWAL (Penarikan Instan Sewaktu-waktu 24/7)
   * Mitra dapat mencairkan dana saat itu juga via jaringan BI-FAST
   */
  public async processInstantWithdrawal(data: {
    partnerId: string;
    partnerName: string;
    partnerType: any;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }): Promise<WithdrawalRequest> {
    const MINIMUM_AMOUNT = 20000;
    if (data.amount < MINIMUM_AMOUNT) {
      throw new Error(`Minimal penarikan saldo instan adalah Rp ${MINIMUM_AMOUNT.toLocaleString('id-ID')}`);
    }

    // Biaya switching transfer antarbank (Gratis tarikan pertama, flat Rp 2.500 jika ada penarikan lanjutan)
    const transferFee = 2500;
    const netDisbursedAmount = data.amount - transferFee;
    const referenceId = `BIFAST-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const withdrawal: WithdrawalRequest = {
      id: `wd-inst-${Date.now()}`,
      partnerId: data.partnerId,
      partnerName: data.partnerName,
      partnerType: data.partnerType,
      amount: data.amount,
      mode: 'INSTANT_ON_DEMAND',
      transferFee,
      netDisbursedAmount,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder,
      status: 'COMPLETED', // Simulasi API BI-FAST langsung sukses dalam hitungan detik
      referenceId,
      requestedAt: new Date().toISOString(),
      processedAt: new Date().toISOString()
    };

    console.log(`[INSTANT DISBURSEMENT] Berhasil mentransfer Rp ${netDisbursedAmount.toLocaleString('id-ID')} ke ${data.bankName} ${data.accountNumber} a.n ${data.accountHolder}`);
    return withdrawal;
  }

  /**
   * 5. SCHEDULED AUTO-DISBURSEMENT BATCH (Pencairan Otomatis Terjadwal)
   * Dijalankan berkala oleh cron job tanpa biaya transfer
   */
  public async processScheduledDisbursementBatch(partners: Array<{
    partnerId: string;
    partnerName: string;
    partnerType: any;
    balance: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>): Promise<{ processedCount: number; totalDisbursed: number; items: WithdrawalRequest[] }> {
    const items: WithdrawalRequest[] = [];
    let totalDisbursed = 0;

    for (const p of partners) {
      if (p.balance >= 50000) {
        const item: WithdrawalRequest = {
          id: `wd-sched-${Date.now()}-${items.length}`,
          partnerId: p.partnerId,
          partnerName: p.partnerName,
          partnerType: p.partnerType,
          amount: p.balance,
          mode: 'SCHEDULED',
          transferFee: 0, // Bebas biaya admin transfer
          netDisbursedAmount: p.balance,
          bankName: p.bankName,
          accountNumber: p.accountNumber,
          accountHolder: p.accountHolder,
          status: 'COMPLETED',
          referenceId: `BATCH-BIFAST-${Date.now()}-${items.length}`,
          requestedAt: new Date().toISOString(),
          processedAt: new Date().toISOString()
        };
        items.push(item);
        totalDisbursed += p.balance;
      }
    }

    return {
      processedCount: items.length,
      totalDisbursed,
      items
    };
  }

  /**
   * 6. COD RISK CONTROL & CASH RECONCILIATION
   * Memantau dan membatasi uang tunai COD yang dipegang kurir
   */
  public getCodSummary(driverId: string, driverName: string = 'Kurir Mitra'): CodReconciliationSummary {
    const unsettled = this.driverUnsettledCod.get(driverId) || 0;
    const LIMIT = 500000; // Plafon maksimal uang tunai COD kurir Rp 500.000

    return {
      driverId,
      driverName,
      unsettledCodAmount: unsettled,
      codCreditLimit: LIMIT,
      isCodRestricted: unsettled >= LIMIT,
      unsettledOrdersCount: unsettled > 0 ? Math.ceil(unsettled / 50000) : 0,
      lastDepositAt: new Date(Date.now() - 24 * 3600000).toISOString()
    };
  }

  public recordCodDeposit(driverId: string, driverName: string, amount: number, method: 'CASH_AT_HUB' | 'VIRTUAL_ACCOUNT' | 'QRIS'): CodDepositRecord {
    const deposit: CodDepositRecord = {
      id: `dep-${Date.now()}`,
      driverId,
      driverName,
      amount,
      depositMethod: method,
      status: 'VERIFIED',
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString()
    };

    this.codDeposits.unshift(deposit);
    const current = this.driverUnsettledCod.get(driverId) || 0;
    const newUnsettled = Math.max(0, current - amount);
    this.driverUnsettledCod.set(driverId, newUnsettled);

    return deposit;
  }
}

export const paymentService = new PaymentService();
