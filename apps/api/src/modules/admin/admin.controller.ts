import { Request, Response } from 'express';
import { adminService } from './admin.service';

export class AdminController {
  getOverview(req: Request, res: Response) {
    const metrics = adminService.getMetrics();
    return res.json({ success: true, data: metrics });
  }

  getOrders(req: Request, res: Response) {
    const { serviceType } = req.query;
    const orders = adminService.getOrders(serviceType as string);
    return res.json({ success: true, data: orders });
  }

  getPricing(req: Request, res: Response) {
    const configs = adminService.getPricing();
    return res.json({ success: true, data: configs });
  }

  updatePricing(req: Request, res: Response) {
    const updated = adminService.updatePricing(req.body);
    return res.json({ success: true, data: updated, message: 'Tarif berhasil diperbarui' });
  }

  // Mitra Driver
  getDrivers(req: Request, res: Response) {
    const drivers = adminService.getDrivers();
    return res.json({ success: true, data: drivers });
  }

  createDriver(req: Request, res: Response) {
    try {
      const { name, phone, vehicle, role } = req.body;
      if (!name || !phone || !vehicle) {
        return res.status(400).json({ success: false, message: 'Nama, telepon, dan kendaraan wajib diisi' });
      }
      const driver = adminService.addDriver({ name, phone, vehicle, role });
      return res.status(201).json({ success: true, data: driver, message: 'Mitra pengemudi berhasil didaftarkan' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  verifyDriver(req: Request, res: Response) {
    const { driverId } = req.params;
    const driver = adminService.verifyDriver(driverId);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver tidak ditemukan' });
    return res.json({ success: true, data: driver, message: 'Mitra berhasil diverifikasi' });
  }

  // Mitra Merchant Toko & Resto
  getMerchants(req: Request, res: Response) {
    const merchants = adminService.getMerchants();
    return res.json({ success: true, data: merchants });
  }

  createMerchant(req: Request, res: Response) {
    try {
      const { name, category, type, address, bannerUrl, initialItemName, initialItemPrice } = req.body;
      if (!name || !category || !address || !type) {
        return res.status(400).json({ success: false, message: 'Nama toko, kategori, tipe (FOOD/MART), dan alamat wajib diisi' });
      }
      const merchant = adminService.addMerchant({
        name,
        category,
        type,
        address,
        bannerUrl,
        initialItemName,
        initialItemPrice: Number(initialItemPrice || 0)
      });
      return res.status(201).json({ success: true, data: merchant, message: 'Mitra toko/resto berhasil didaftarkan' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Jaringan Drop Point & Hub
  async getHubs(req: Request, res: Response) {
    const hubs = await adminService.getHubs();
    return res.json({ success: true, data: hubs });
  }

  async createHub(req: Request, res: Response) {
    try {
      const { hubCode, name, hubType, city, address } = req.body;
      if (!hubCode || !name || !city || !address) {
        return res.status(400).json({ success: false, message: 'Kode hub, nama, kota, dan alamat wajib diisi' });
      }
      const hub = await adminService.addHub({
        hubCode,
        name,
        hubType: hubType || 'DROP_POINT',
        city,
        address
      });
      return res.status(201).json({ success: true, data: hub, message: 'Cabang hub berhasil ditambahkan' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  toggleDriver(req: Request, res: Response) {
    try {
      const { driverId } = req.params;
      const driver = adminService.toggleDriverStatus(driverId);
      const actionText = (driver as any).isActive ? 'diaktifkan' : 'dinonaktifkan (tidak bisa terima order)';
      return res.json({ success: true, data: driver, message: `Status mitra pengemudi berhasil ${actionText}` });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  toggleMerchant(req: Request, res: Response) {
    try {
      const { merchantId } = req.params;
      const merchant = adminService.toggleMerchantStatus(merchantId);
      const actionText = merchant.isActive ? 'diaktifkan' : 'dinonaktifkan (disembunyikan dari pelanggan)';
      return res.json({ success: true, data: merchant, message: `Status mitra toko berhasil ${actionText}` });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  async toggleHub(req: Request, res: Response) {
    try {
      const { hubId } = req.params;
      const hub = await adminService.toggleHub(hubId);
      const actionText = hub.isActive ? 'diaktifkan' : 'dinonaktifkan';
      return res.json({ success: true, data: hub, message: `Cabang hub berhasil ${actionText}` });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // 4. Layanan AZ GO (Service Feature Flags)
  getServices(req: Request, res: Response) {
    const services = adminService.getServicesConfig();
    return res.json({ success: true, data: services });
  }

  toggleService(req: Request, res: Response) {
    try {
      const { serviceId } = req.params;
      const updated = adminService.toggleServiceStatus(serviceId);
      const actionText = updated.isEnabled ? 'diaktifkan untuk pelanggan' : 'dinonaktifkan (mode pemeliharaan)';
      return res.json({ success: true, data: updated, message: `Layanan ${updated.name} berhasil ${actionText}` });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}

export const adminController = new AdminController();
