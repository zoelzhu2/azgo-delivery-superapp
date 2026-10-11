import { Router } from 'express';
import { partnerController } from './partner.controller';

const router = Router();

// Endpoint Publik / Pelanggan: Ajukan Pendaftaran
router.post('/apply', (req, res) => partnerController.submitApplication(req, res));

// Endpoint Admin: Tinjau Berkas & Approval
router.get('/applications', (req, res) => partnerController.getApplications(req, res));
router.patch('/applications/:id/review', (req, res) => partnerController.reviewApplication(req, res));

export default router;
