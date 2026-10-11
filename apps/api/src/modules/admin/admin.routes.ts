import { Router } from 'express';
import { adminController } from './admin.controller';

const router = Router();

// Ringkasan KPI & Metrik Operasional
router.get('/overview', (req, res) => adminController.getOverview(req, res));

// Monitoring Seluruh Transaksi Live (7 Layanan)
router.get('/orders', (req, res) => adminController.getOrders(req, res));

// Konfigurasi Tarif Dinamis
router.get('/pricing', (req, res) => adminController.getPricing(req, res));
router.put('/pricing', (req, res) => adminController.updatePricing(req, res));

// Manajemen & Pendaftaran Mitra Driver / Kurir
router.get('/drivers', (req, res) => adminController.getDrivers(req, res));
router.post('/drivers', (req, res) => adminController.createDriver(req, res));
router.patch('/drivers/:driverId/verify', (req, res) => adminController.verifyDriver(req, res));
router.patch('/drivers/:driverId/toggle', (req, res) => adminController.toggleDriver(req, res));

// Manajemen & Pendaftaran Mitra Toko / Resto & Mart
router.get('/merchants', (req, res) => adminController.getMerchants(req, res));
router.post('/merchants', (req, res) => adminController.createMerchant(req, res));
router.patch('/merchants/:merchantId/toggle', (req, res) => adminController.toggleMerchant(req, res));

// Manajemen & Pendaftaran Cabang Drop Point & Sorting Hub
router.get('/hubs', (req, res) => adminController.getHubs(req, res));
router.post('/hubs', (req, res) => adminController.createHub(req, res));
router.patch('/hubs/:hubId/toggle', (req, res) => adminController.toggleHub(req, res));

// Manajemen Layanan AZ GO (Feature Flags & Pemeliharaan)
router.get('/services', (req, res) => adminController.getServices(req, res));
router.patch('/services/:serviceId/toggle', (req, res) => adminController.toggleService(req, res));

export default router;
