import { Request, Response } from 'express';
import { expeditionService } from './expedition.service';

export class ExpeditionController {
  async calculateFare(req: Request, res: Response) {
    try {
      const { originCity, destinationCity, weightKg, lengthCm, widthCm, heightCm, serviceCode } = req.body;
      if (!originCity || !destinationCity || !weightKg) {
        return res.status(400).json({ success: false, message: 'Origin, Destination, dan Berat (Kg) wajib diisi' });
      }

      const result = await expeditionService.calculateFare({
        originCity,
        destinationCity,
        weightKg: Number(weightKg),
        lengthCm: Number(lengthCm || 0),
        widthCm: Number(widthCm || 0),
        heightCm: Number(heightCm || 0),
        serviceCode
      });

      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async calculateCargoFare(req: Request, res: Response) {
    try {
      const { vehicleType, distanceKm, helperCount } = req.body;
      if (!vehicleType || distanceKm === undefined) {
        return res.status(400).json({ success: false, message: 'Jenis armada dan jarak (distanceKm) wajib diisi' });
      }

      const result = expeditionService.calculateCargoFare({
        vehicleType,
        distanceKm: Number(distanceKm),
        helperCount: Number(helperCount || 0)
      });

      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async createShipment(req: Request, res: Response) {
    try {
      const {
        recipientName,
        recipientPhone,
        recipientAddress,
        senderName,
        senderPhone,
        senderAddress,
        packageType,
        serviceCode,
        weightKg,
        lengthCm,
        widthCm,
        heightCm,
        originCity,
        destinationCity,
        itemDescription,
        originHubId
      } = req.body;
      if (!recipientName || !recipientPhone || !originCity || !destinationCity) {
        return res.status(400).json({ success: false, message: 'Data pengirim, penerima, dan kota wajib diisi' });
      }

      const result = await expeditionService.createShipment({
        recipientName,
        recipientPhone,
        recipientAddress,
        senderName,
        senderPhone,
        senderAddress,
        packageType,
        serviceCode,
        weightKg: Number(weightKg || 1),
        lengthCm: Number(lengthCm || 10),
        widthCm: Number(widthCm || 10),
        heightCm: Number(heightCm || 10),
        originCity,
        destinationCity,
        itemDescription,
        originHubId
      });

      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async createPickup(req: Request, res: Response) {
    try {
      const { senderName, senderPhone, pickupAddress, scheduledTime, estimatedPackages, notes } = req.body;
      if (!senderName || !senderPhone || !pickupAddress) {
        return res.status(400).json({ success: false, message: 'Nama, telepon, dan alamat jemput wajib diisi' });
      }

      const result = await expeditionService.createPickupRequest({
        senderName,
        senderPhone,
        pickupAddress,
        scheduledTime,
        estimatedPackages: Number(estimatedPackages || 1),
        notes
      });

      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async trackShipment(req: Request, res: Response) {
    try {
      const { awb } = req.params;
      if (!awb) {
        return res.status(400).json({ success: false, message: 'Nomor resi (AWB) harus disertakan' });
      }

      const result = await expeditionService.trackShipment(awb);
      if (!result.delivery && result.checkpoints.length === 0) {
        return res.status(404).json({ success: false, message: 'Nomor resi tidak ditemukan di sistem AZ GO' });
      }

      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async addScanCheckpoint(req: Request, res: Response) {
    try {
      const { trackingNumber, city, checkpointTitle, description, hubId, hubName } = req.body;
      if (!trackingNumber || !checkpointTitle) {
        return res.status(400).json({ success: false, message: 'Tracking number dan judul checkpoint wajib diisi' });
      }

      const result = await expeditionService.addScanCheckpoint({
        trackingNumber,
        city: city || 'Jakarta',
        checkpointTitle,
        description: description || '',
        hubId,
        hubName
      });

      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async listHubs(req: Request, res: Response) {
    try {
      const hubs = await expeditionService.listHubs();
      return res.json({ success: true, data: hubs });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

export const expeditionController = new ExpeditionController();
