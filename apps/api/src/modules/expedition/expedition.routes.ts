import { Router } from 'express';
import { expeditionController } from './expedition.controller';

const router = Router();

// Cek Tarif Az Courier (Reguler) & Az Express (Kilat)
router.post('/check-rate', (req, res) => expeditionController.calculateFare(req, res));

// Cek Tarif Az Cargo (Pickup, Box, Blind Van, Truk Engkel)
router.post('/cargo-fare', (req, res) => expeditionController.calculateCargoFare(req, res));

// Buat Pesanan Ekspedisi / Cargo & Terbitkan Resi (AWB)
router.post('/shipments', (req, res) => expeditionController.createShipment(req, res));

// Minta Penjemputan Barang ke Rumah (Az Pickup)
router.post('/pickup-request', (req, res) => expeditionController.createPickup(req, res));

// Universal Tracking Resi Publik (Semua Layanan AZ GO)
router.get('/track/:awb', (req, res) => expeditionController.trackShipment(req, res));

// Scan Barcode Checkpoint (Staff Hub & Kurir)
router.post('/checkpoints', (req, res) => expeditionController.addScanCheckpoint(req, res));

// Daftar Drop Point & Sorting Hub
router.get('/hubs', (req, res) => expeditionController.listHubs(req, res));

export default router;
