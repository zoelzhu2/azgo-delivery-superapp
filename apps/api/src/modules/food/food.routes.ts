import { Router } from 'express';
import { foodAndMartService } from './food.service';

const router = Router();

// Endpoint Az Delivery (Resto & Makanan)
router.get('/restaurants', (req, res) => {
  const list = foodAndMartService.getRestaurants();
  return res.json({ success: true, data: list });
});

// Endpoint Az Mart (Minimarket, Sembako, Sayuran)
router.get('/marts', (req, res) => {
  const list = foodAndMartService.getMartStores();
  return res.json({ success: true, data: list });
});

// Kalkulasi Belanja (Resto atau Mart)
router.post('/calculate', (req, res) => {
  const { items, distanceKm, isMart } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ success: false, message: 'Items array wajib diisi' });
  }
  const result = foodAndMartService.calculateOrder(items, distanceKm, !!isMart);
  return res.json({ success: true, data: result });
});

export default router;
