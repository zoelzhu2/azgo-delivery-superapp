import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import expeditionRoutes from './modules/expedition/expedition.routes';
import rideRoutes from './modules/ride/ride.routes';
import foodRoutes from './modules/food/food.routes';
import adminRoutes from './modules/admin/admin.routes';
import authRoutes from './modules/auth/auth.routes';
import partnerRoutes from './modules/partner/partner.routes';
import financeRoutes from './modules/finance/finance.routes';

export const createApp = () => {
  const app = express();

  // Middleware Dasar
  app.use(cors());
  app.use(express.json());

  // Health Check Endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ONLINE',
      system: 'AZ GO SuperApp API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // MODUL-MODUL TERPISAH (DECOUPLED ROUTES)
  app.use('/api/auth', authRoutes);
  app.use('/api/expedition', expeditionRoutes);
  app.use('/api/ride', rideRoutes);
  app.use('/api/food', foodRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/partner', partnerRoutes);
  app.use('/api/finance', financeRoutes);

  // Global Error Handler Terpusat
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('[Error Occurred]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal pada server',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  return app;
};
