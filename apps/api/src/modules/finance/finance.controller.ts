import { Request, Response } from 'express';
import { financeService } from './finance.service';
import { PartnerType } from '@delivery/shared';

export class FinanceController {
  // 1. Admin: Rekap Keuangan & Konfigurasi Bagi Hasil
  getPlatformSummary(req: Request, res: Response) {
    const summary = financeService.getPlatformSummary();
    return res.json({ success: true, data: summary });
  }

  getCommissionConfig(req: Request, res: Response) {
    const config = financeService.getConfig();
    return res.json({ success: true, data: config });
  }

  updateCommissionConfig(req: Request, res: Response) {
    try {
      const updated = financeService.updateConfig(req.body);
      return res.json({
        success: true,
        data: updated,
        message: 'Skema bagi hasil dan komisi berhasil diperbarui secara live'
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // 2. Mitra (Driver / Toko): Saldo Dompet & Riwayat Mutasi
  getPartnerWallet(req: Request, res: Response) {
    const { partnerId } = req.params;
    const { type } = req.query;
    const wallet = financeService.getPartnerWallet(partnerId, (type as PartnerType) || 'DRIVER');
    return res.json({ success: true, data: wallet });
  }

  // 3. Mitra mengajukan penarikan dana
  requestWithdrawal(req: Request, res: Response) {
    try {
      const { partnerId, partnerName, partnerType, amount, bankName, accountNumber, accountHolder } = req.body;
      if (!partnerId || !amount || !bankName || !accountNumber || !accountHolder) {
        return res.status(400).json({ success: false, message: 'Harap lengkapi nominal dan informasi rekening bank' });
      }

      const request = financeService.requestWithdrawal({
        partnerId,
        partnerName: partnerName || 'Mitra AZ GO',
        partnerType: partnerType || 'DRIVER',
        amount: Number(amount),
        bankName,
        accountNumber,
        accountHolder
      });

      return res.status(201).json({
        success: true,
        data: request,
        message: 'Permintaan penarikan saldo berhasil diajukan dan sedang diproses tim keuangan AZ GO'
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // 4. Admin: Manajemen Penarikan Dana (Withdrawals)
  getWithdrawalRequests(req: Request, res: Response) {
    const { status } = req.query;
    const requests = financeService.getWithdrawalRequests(status as string);
    return res.json({ success: true, data: requests });
  }

  reviewWithdrawal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { action, reason } = req.body;
      if (!action || (action !== 'APPROVE' && action !== 'REJECT')) {
        return res.status(400).json({ success: false, message: 'Aksi harus APPROVE atau REJECT' });
      }

      const reviewed = financeService.reviewWithdrawal(id, action, reason);
      const actionText = action === 'APPROVE' ? 'disetujui dan dana telah ditransfer' : 'ditolak';
      return res.json({
        success: true,
        data: reviewed,
        message: `Pengajuan pencairan saldo berhasil ${actionText}`
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}

export const financeController = new FinanceController();
