import { Router } from 'express';
import { financeController } from './finance.controller';

const router = Router();

// 1. Admin: Rekap Keuangan & Konfigurasi Skema Bagi Hasil
router.get('/admin/summary', (req, res) => financeController.getPlatformSummary(req, res));
router.get('/admin/commission', (req, res) => financeController.getCommissionConfig(req, res));
router.put('/admin/commission', (req, res) => financeController.updateCommissionConfig(req, res));
router.get('/admin/withdrawals', (req, res) => financeController.getWithdrawalRequests(req, res));
router.patch('/admin/withdrawals/:id/review', (req, res) => financeController.reviewWithdrawal(req, res));

// 2. Mitra (Driver / Toko): Dompet & Penarikan Dana
router.get('/wallet/:partnerId', (req, res) => financeController.getPartnerWallet(req, res));
router.post('/withdraw', (req, res) => financeController.requestWithdrawal(req, res));

export default router;
