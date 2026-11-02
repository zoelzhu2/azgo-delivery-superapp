import { Request, Response } from 'express';
import { paymentService } from './payment.service';
import { CreateChargeRequest, PaymentWebhookPayload } from '@delivery/shared';

export class PaymentController {
  /**
   * POST /api/payment/charge
   * Membuat transaksi pembayaran baru (QRIS Dinamis / Virtual Account / E-Wallet)
   */
  public async createCharge(req: Request, res: Response) {
    try {
      const chargeReq: CreateChargeRequest = req.body;
      if (!chargeReq.orderId || !chargeReq.amount || !chargeReq.paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Parameter orderId, amount, dan paymentMethod wajib diisi.'
        });
      }

      const result = await paymentService.createCharge(chargeReq);
      return res.status(201).json(result);
    } catch (err: any) {
      console.error('[PaymentController.createCharge Error]:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Gagal membuat tagihan pembayaran',
        error: err.message
      });
    }
  }

  /**
   * GET /api/payment/status/:orderId
   * Polling atau pengecekan status pembayaran pesanan
   */
  public async getStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const tx = paymentService.getTransactionByOrderId(orderId);

      if (!tx) {
        return res.status(404).json({
          success: false,
          message: 'Transaksi pembayaran tidak ditemukan untuk pesanan ini.'
        });
      }

      return res.json({
        success: true,
        transaction: tx
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal mengecek status pembayaran',
        error: err.message
      });
    }
  }

  /**
   * POST /api/payment/webhook
   * Menerima notifikasi instan dari Payment Gateway (Midtrans/Xendit)
   */
  public async handleWebhook(req: Request, res: Response) {
    try {
      const payload: PaymentWebhookPayload = req.body;
      const result = await paymentService.handleWebhook(payload);
      return res.json(result);
    } catch (err: any) {
      console.error('[PaymentController.webhook Error]:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Gagal memproses webhook pembayaran'
      });
    }
  }

  /**
   * POST /api/payment/disburse/instant
   * Penarikan Saldo Instan Sewaktu-waktu oleh Mitra (Driver & Resto) 24/7
   */
  public async requestInstantWithdrawal(req: Request, res: Response) {
    try {
      const { partnerId, partnerName, partnerType, amount, bankName, accountNumber, accountHolder } = req.body;

      if (!partnerId || !amount || !bankName || !accountNumber || !accountHolder) {
        return res.status(400).json({
          success: false,
          message: 'Data permohonan penarikan dana tidak lengkap.'
        });
      }

      const result = await paymentService.processInstantWithdrawal({
        partnerId,
        partnerName,
        partnerType,
        amount: Number(amount),
        bankName,
        accountNumber,
        accountHolder
      });

      return res.status(200).json({
        success: true,
        message: 'Penarikan saldo instan berhasil diproses via BI-FAST.',
        withdrawal: result
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Gagal memproses penarikan saldo instan.'
      });
    }
  }

  /**
   * POST /api/payment/disburse/scheduled-batch
   * Dijalankan oleh cron job sistem untuk auto-pencairan terjadwal
   */
  public async processScheduledBatch(req: Request, res: Response) {
    try {
      const { partners } = req.body;
      const result = await paymentService.processScheduledDisbursementBatch(partners || []);
      return res.json({
        success: true,
        message: `Berhasil mengeksekusi pencairan otomatis terjadwal untuk ${result.processedCount} mitra.`,
        data: result
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memproses pencairan terjadwal',
        error: err.message
      });
    }
  }

  /**
   * GET /api/payment/cod/summary/:driverId
   * Pengecekan limit uang tunai COD yang dipegang kurir
   */
  public async getCodSummary(req: Request, res: Response) {
    try {
      const { driverId } = req.params;
      const summary = paymentService.getCodSummary(driverId);
      return res.json({
        success: true,
        summary
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memuat ringkasan COD kurir'
      });
    }
  }

  /**
   * POST /api/payment/cod/deposit
   * Mencatat setoran uang tunai COD kurir ke hub atau VA platform
   */
  public async recordCodDeposit(req: Request, res: Response) {
    try {
      const { driverId, driverName, amount, depositMethod } = req.body;
      if (!driverId || !amount || !depositMethod) {
        return res.status(400).json({
          success: false,
          message: 'Data setoran COD tidak lengkap.'
        });
      }

      const deposit = paymentService.recordCodDeposit(driverId, driverName || 'Kurir', Number(amount), depositMethod);
      return res.status(201).json({
        success: true,
        message: 'Setoran uang COD berhasil dicatat dan saldo plafon dipulihkan.',
        deposit
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal mencatat setoran COD',
        error: err.message
      });
    }
  }
}

export const paymentController = new PaymentController();
