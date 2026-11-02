import { Router } from 'express';
import { paymentController } from './payment.controller';

const router = Router();

// 1. Tagihan Pembayaran Pelanggan
router.post('/charge', (req, res) => paymentController.createCharge(req, res));
router.get('/status/:orderId', (req, res) => paymentController.getStatus(req, res));

// 2. Webhook Payment Gateway (Midtrans / Xendit)
router.post('/webhook', (req, res) => paymentController.handleWebhook(req, res));

// 3. Pencairan Dana Mitra (Dual-Mode: Instan On-Demand & Terjadwal Batch)
router.post('/disburse/instant', (req, res) => paymentController.requestInstantWithdrawal(req, res));
router.post('/disburse/scheduled-batch', (req, res) => paymentController.processScheduledBatch(req, res));

// 4. Manajemen & Setoran COD Kurir
router.get('/cod/summary/:driverId', (req, res) => paymentController.getCodSummary(req, res));
router.post('/cod/deposit', (req, res) => paymentController.recordCodDeposit(req, res));

export default router;
