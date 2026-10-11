import { Router } from 'express';
import { rideController } from './ride.controller';

const router = Router();

router.post('/estimate', (req, res) => rideController.estimateFare(req, res));
router.post('/order', (req, res) => rideController.createOrder(req, res));

export default router;
