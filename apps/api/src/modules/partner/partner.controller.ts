import { Request, Response } from 'express';
import { partnerService } from './partner.service';

export class PartnerController {
  // Pelanggan mengajukan pendaftaran mitra baru
  submitApplication(req: Request, res: Response) {
    try {
      const {
        type,
        fullName,
        phone,
        email,
        city,
        address,
        vehicleCategory,
        vehiclePlate,
        vehicleModel,
        ktpNumber,
        simNumber,
        documents,
        storeName,
        merchantType,
        storeCategory,
        storeDescription,
        hasSelfCourier,
        selfCourierName,
        selfCourierPhone,
        selfCourierVehicle,
        selfCourierPlate,
        bankName,
        accountNumber,
        accountHolder
      } = req.body;

      if (!type || !fullName || !phone || !email || !city || !address) {
        return res.status(400).json({ success: false, message: 'Harap lengkapi semua kolom wajib' });
      }

      const application = partnerService.submitApplication({
        type,
        fullName,
        phone,
        email,
        city,
        address,
        vehicleCategory,
        vehiclePlate,
        vehicleModel,
        ktpNumber,
        simNumber,
        documents,
        storeName,
        merchantType,
        storeCategory,
        storeDescription,
        hasSelfCourier: hasSelfCourier === true || hasSelfCourier === 'true',
        selfCourierName,
        selfCourierPhone,
        selfCourierVehicle,
        selfCourierPlate,
        bankName,
        accountNumber,
        accountHolder
      });

      return res.status(201).json({
        success: true,
        data: application,
        message: 'Pengajuan pendaftaran mitra berhasil dikirim. Tim admin AZ GO akan segera meninjau berkas Anda.'
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // Admin mengambil daftar pendaftaran
  getApplications(req: Request, res: Response) {
    const { status, type } = req.query;
    const applications = partnerService.getApplications(status as string, type as string);
    return res.json({ success: true, data: applications });
  }

  // Admin menyetujui / menolak pengajuan
  reviewApplication(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { action, reason } = req.body;
      if (!action || (action !== 'APPROVE' && action !== 'REJECT')) {
        return res.status(400).json({ success: false, message: 'Aksi harus APPROVE atau REJECT' });
      }

      const updated = partnerService.reviewApplication(id, action, reason);
      const actionText = action === 'APPROVE' ? 'disetujui' : 'ditolak';
      return res.json({
        success: true,
        data: updated,
        message: `Pengajuan mitra berhasil ${actionText}`
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}

export const partnerController = new PartnerController();
