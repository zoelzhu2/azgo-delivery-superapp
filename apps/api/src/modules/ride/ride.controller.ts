import { Request, Response } from 'express';
import { rideService } from './ride.service';

export class RideController {
  estimateFare(req: Request, res: Response) {
    try {
      const { distanceKm, vehicleType } = req.body;
      if (distanceKm === undefined) {
        return res.status(400).json({ success: false, message: 'Jarak (distanceKm) harus diisi' });
      }

      const fare = rideService.calculateFare({
        serviceType: 'RIDE',
        vehicleType: vehicleType === 'CAR' ? 'CAR' : 'MOTORBIKE',
        distanceKm: Number(distanceKm)
      });

      return res.json({ success: true, data: fare });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  createOrder(req: Request, res: Response) {
    try {
      const { customerId, pickupAddress, dropoffAddress, distanceKm, vehicleType } = req.body;
      if (!pickupAddress || !dropoffAddress || distanceKm === undefined) {
        return res.status(400).json({ success: false, message: 'Lokasi jemput, tujuan, dan jarak wajib diisi' });
      }

      const order = rideService.createRideOrder({
        customerId,
        pickupAddress,
        dropoffAddress,
        distanceKm: Number(distanceKm),
        vehicleType: vehicleType === 'CAR' ? 'CAR' : 'MOTORBIKE'
      });

      return res.status(201).json({ success: true, data: order });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

export const rideController = new RideController();
