import { PartnerApplication, PartnerType, DriverVehicleCategory, MerchantCategoryType } from '@delivery/shared';
import { authService } from '../auth/auth.service';
import { adminService } from '../admin/admin.service';

export class PartnerService {
  private applications: PartnerApplication[] = [
    {
      id: 'app-drv-01',
      type: 'DRIVER',
      fullName: 'Asep Sunandar',
      phone: '081299112233',
      email: 'asep.driver@gmail.com',
      city: 'Bandung',
      address: 'Jl. Cihampelas No. 128, RT 03/RW 04, Coblong, Bandung',
      status: 'PENDING_REVIEW',
      submittedAt: new Date(Date.now() - 40 * 60000).toISOString(),
      vehicleCategory: 'MOTORBIKE',
      vehiclePlate: 'D 4567 ABC',
      vehicleModel: 'Honda Beat CBS 2023 Hitam',
      ktpNumber: '3273012903950001',
      simNumber: '950312001928',
      bankName: 'BCA (Bank Central Asia)',
      accountNumber: '8820192819',
      accountHolder: 'Asep Sunandar',
      documents: {
        ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        simUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
        stnkUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600',
        vehiclePhotoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600'
      }
    },
    {
      id: 'app-mch-01',
      type: 'MERCHANT',
      fullName: 'Ibu Hajah Siti Maryam',
      phone: '081388776655',
      email: 'liwet.pasundan@gmail.com',
      city: 'Bandung',
      address: 'Jl. Riau No. 88, Citarum, Bandung Wetan',
      status: 'PENDING_REVIEW',
      submittedAt: new Date(Date.now() - 90 * 60000).toISOString(),
      storeName: 'Warung Nasi Liwet & Bebek Pasundan',
      merchantType: 'FOOD',
      storeCategory: 'Masakan Sunda & Olahan Bebek',
      storeDescription: 'Menyajikan Nasi Liwet Kastrol khas Parahyangan dan Bebek Goreng Sambal Korek.',
      bankName: 'Mandiri',
      accountNumber: '1310098765432',
      accountHolder: 'Siti Maryam',
      documents: {
        ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        storePhotoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
      }
    },
    {
      id: 'app-drv-02',
      type: 'DRIVER',
      fullName: 'Dedi Kusnandar',
      phone: '081922334455',
      email: 'dedi.cargo@gmail.com',
      city: 'Jakarta',
      address: 'Jl. Daan Mogot KM 11 No. 45, Cengkareng, Jakarta Barat',
      status: 'APPROVED',
      submittedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      reviewedAt: new Date(Date.now() - 20 * 3600000).toISOString(),
      reviewedBy: 'Super Administrator',
      vehicleCategory: 'CARGO_PICKUP',
      vehiclePlate: 'B 9876 DED',
      vehicleModel: 'Daihatsu Gran Max Pickup 1.5 Box',
      ktpNumber: '3174091807900003',
      simNumber: '900718002931',
      bankName: 'BNI',
      accountNumber: '0281920192',
      accountHolder: 'Dedi Kusnandar',
      generatedUserId: 'usr-drv-dedi',
      tempPassword: 'mitra123'
    }
  ];

  /**
   * Mengajukan pendaftaran mitra baru dari sisi pelanggan
   */
  submitApplication(data: {
    type: PartnerType;
    fullName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    vehicleCategory?: DriverVehicleCategory;
    vehiclePlate?: string;
    vehicleModel?: string;
    ktpNumber?: string;
    simNumber?: string;
    documents?: any;
    storeName?: string;
    merchantType?: MerchantCategoryType;
    storeCategory?: string;
    storeDescription?: string;
    hasSelfCourier?: boolean;
    selfCourierName?: string;
    selfCourierPhone?: string;
    selfCourierVehicle?: string;
    selfCourierPlate?: string;
    bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
  }): PartnerApplication {
    const existing = this.applications.find(
      a => (a.phone === data.phone || a.email.toLowerCase() === data.email.toLowerCase()) && a.status === 'PENDING_REVIEW'
    );
    if (existing) {
      throw new Error('Anda telah memiliki pengajuan pendaftaran yang sedang ditinjau');
    }

    const newApp: PartnerApplication = {
      id: `app-${data.type.toLowerCase()}-${Date.now()}`,
      type: data.type,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      city: data.city,
      address: data.address,
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
      vehicleCategory: data.vehicleCategory,
      vehiclePlate: data.vehiclePlate,
      vehicleModel: data.vehicleModel,
      ktpNumber: data.ktpNumber,
      simNumber: data.simNumber,
      documents: data.documents || {},
      storeName: data.storeName,
      merchantType: data.merchantType,
      storeCategory: data.storeCategory,
      storeDescription: data.storeDescription,
      hasSelfCourier: data.hasSelfCourier,
      selfCourierName: data.selfCourierName,
      selfCourierPhone: data.selfCourierPhone,
      selfCourierVehicle: data.selfCourierVehicle,
      selfCourierPlate: data.selfCourierPlate,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder
    };

    this.applications.unshift(newApp);
    return newApp;
  }

  /**
   * Mengambil semua pengajuan pendaftaran (Untuk Admin)
   */
  getApplications(status?: string, type?: string): PartnerApplication[] {
    let result = this.applications;
    if (status && status !== 'ALL') {
      result = result.filter(a => a.status === status);
    }
    if (type && type !== 'ALL') {
      result = result.filter(a => a.type === type);
    }
    return result;
  }

  /**
   * Meninjau pengajuan berkas: Setujui atau Tolak (Admin Only)
   */
  reviewApplication(id: string, action: 'APPROVE' | 'REJECT', reason?: string): PartnerApplication {
    const app = this.applications.find(a => a.id === id);
    if (!app) {
      throw new Error('Data pengajuan tidak ditemukan');
    }

    if (action === 'APPROVE') {
      app.status = 'APPROVED';
      app.reviewedAt = new Date().toISOString();
      app.reviewedBy = 'Super Administrator';
      app.tempPassword = 'mitra' + Math.floor(100 + Math.random() * 900);

      // 1. Buatkan akun login resmi di authService
      try {
        const createdUser = authService.createUser({
          fullName: app.type === 'MERCHANT' && app.storeName ? `${app.storeName} (${app.fullName})` : app.fullName,
          email: app.email,
          phone: app.phone,
          role: app.type === 'DRIVER' ? 'DRIVER' : 'MERCHANT',
          storeType: app.merchantType,
          hasSelfCourier: app.hasSelfCourier,
          selfCouriers: app.hasSelfCourier ? [
            {
              id: `sc-${Date.now()}`,
              name: app.selfCourierName || 'Kurir Toko',
              phone: app.selfCourierPhone || app.phone,
              vehicleModel: app.selfCourierVehicle || 'Sepeda Motor',
              vehiclePlate: app.selfCourierPlate || 'L 1234 AB'
            }
          ] : [],
          bankName: app.bankName,
          accountNumber: app.accountNumber,
          accountHolder: app.accountHolder,
          password: app.tempPassword
        });
        app.generatedUserId = createdUser.id;
      } catch (err: any) {
        // Jika akun sudah ada, gunakan ID yang ada
        console.warn('User already exists or registered:', err.message);
      }

      // 2. Tambahkan ke master data mitra driver atau toko
      if (app.type === 'DRIVER') {
        adminService.addDriver({
          name: app.fullName,
          phone: app.phone,
          vehicle: `${app.vehicleModel || 'Kendaraan Mitra'} (${app.vehiclePlate || 'B 1234 ABC'})`,
          role: app.vehicleCategory || 'MOTORBIKE'
        });
      } else if (app.type === 'MERCHANT') {
        adminService.addMerchant({
          name: app.storeName || app.fullName,
          category: app.storeCategory || 'Aneka Kuliner / Produk',
          type: app.merchantType || 'FOOD',
          address: `${app.address}, ${app.city}`,
          initialItemName: 'Menu Andalan Mitra Baru',
          initialItemPrice: 25000
        });
      }
    } else {
      app.status = 'REJECTED';
      app.rejectionReason = reason || 'Berkas tidak memenuhi persyaratan kelengkapan/kejelasan foto';
      app.reviewedAt = new Date().toISOString();
      app.reviewedBy = 'Super Administrator';
    }

    return app;
  }
}

export const partnerService = new PartnerService();
